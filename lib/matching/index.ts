import {
  CustomerData,
  EligibilityResult,
  MatchRecommendationResult,
  MatchingWeights,
} from "./types";
import { DEFAULT_MATCHING_WEIGHTS } from "./config";
import { checkEligibility } from "./eligibility";
import { calculateComponentScores, calculateWeightedScore } from "./scoring";
import { buildRecommendationExplanation } from "./explanations";

export * from "./types";
export * from "./config";
export * from "./eligibility";
export * from "./scoring";
export * from "./explanations";

export interface CandidateEvaluationOptions {
  rejectedCandidateIds?: string[];
  existingMatchedCandidateIds?: string[];
  requireCandidateVerification?: boolean;
  weights?: MatchingWeights;
}

/**
 * Pure deterministic candidate evaluator.
 * Independent of React, the database, or external APIs.
 */
export function evaluateCandidate(
  customer: CustomerData,
  candidate: CustomerData,
  options: CandidateEvaluationOptions = {}
): MatchRecommendationResult {
  const eligibility: EligibilityResult = checkEligibility(customer, candidate, {
    rejectedCandidateIds: options.rejectedCandidateIds,
    existingMatchedCandidateIds: options.existingMatchedCandidateIds,
    requireCandidateVerification: options.requireCandidateVerification,
  });

  const appliedDemoPresets: string[] = [];
  const { scores, customerScoreAtoB, candidateScoreBtoA } = calculateComponentScores(
    customer,
    candidate,
    appliedDemoPresets
  );

  const weightedScore = calculateWeightedScore(scores, options.weights || DEFAULT_MATCHING_WEIGHTS);

  const compatibility = buildRecommendationExplanation(
    customer,
    candidate,
    weightedScore,
    scores,
    customerScoreAtoB,
    candidateScoreBtoA,
    appliedDemoPresets
  );

  return {
    candidate,
    eligibility,
    compatibility,
  };
}

/**
 * Filters and ranks candidate pool for a given customer.
 * Ineligible candidates are filtered out or sorted below eligible ones.
 */
export function rankCandidates(
  customer: CustomerData,
  candidates: CustomerData[],
  options: CandidateEvaluationOptions = {}
): MatchRecommendationResult[] {
  const results = candidates.map((candidate) => evaluateCandidate(customer, candidate, options));

  // Sort eligible candidates by score descending
  return results.sort((a, b) => {
    if (a.eligibility.isEligible && !b.eligibility.isEligible) return -1;
    if (!a.eligibility.isEligible && b.eligibility.isEligible) return 1;
    return b.compatibility.compatibilityScore - a.compatibility.compatibilityScore;
  });
}
