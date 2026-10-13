import { CustomerData, ComponentScores, RecommendationExplanation } from "./types";
import { ALGORITHM_VERSION, getCompatibilityTier } from "./config";
import { calculateAge, formatHeight } from "../utils";

function parseJsonArray(value: string | string[] | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
}

/**
 * Derives structured positive factors, potential concerns, missing information, and
 * a deterministic human-readable explanation from the factual profiles and component scores.
 */
export function buildRecommendationExplanation(
  customer: CustomerData,
  candidate: CustomerData,
  overallScore: number,
  componentScores: ComponentScores,
  customerScoreAtoB: number,
  candidateScoreBtoA: number,
  appliedDemoPresets: string[] = []
): RecommendationExplanation {
  const topPositiveFactors: string[] = [];
  const potentialConcerns: string[] = [];
  const missingInformation: string[] = [];

  // 1. Positive factors
  if (customer.city.toLowerCase() === candidate.city.toLowerCase()) {
    topPositiveFactors.push(`Both are based in ${customer.city}, eliminating relocation friction.`);
  } else if (candidate.openToRelocate === "YES" || customer.openToRelocate === "YES") {
    topPositiveFactors.push(`Flexible location plans (${customer.city} & ${candidate.city}) with relocation openness.`);
  }

  if (customer.wantChildren === candidate.wantChildren) {
    topPositiveFactors.push(`Mutual alignment on family plans (Children: ${customer.wantChildren}).`);
  }

  if (customer.diet === candidate.diet) {
    topPositiveFactors.push(`Identical dietary lifestyle (${customer.diet.replace("_", " ")}).`);
  }

  if (componentScores.careerEducation >= 75) {
    topPositiveFactors.push(`Strong career synergy (${customer.highestEducation} & ${candidate.highestEducation}).`);
  }

  if (componentScores.familyValues >= 80) {
    topPositiveFactors.push(`Compatible family values (${customer.familyValues || "Moderate"} orientation).`);
  }

  const custHobbies = parseJsonArray(customer.hobbies);
  const candHobbies = parseJsonArray(candidate.hobbies);
  const sharedHobbies = custHobbies.filter((h) =>
    candHobbies.some((ch) => ch.toLowerCase() === h.toLowerCase())
  );
  if (sharedHobbies.length > 0) {
    topPositiveFactors.push(`Shared interests in ${sharedHobbies.slice(0, 2).join(" and ")}.`);
  }

  // Ensure top 3
  if (topPositiveFactors.length === 0) {
    topPositiveFactors.push("Balanced mutual criteria fit across core demographic factors.");
  }

  // 2. Potential concerns
  if (customer.city.toLowerCase() !== candidate.city.toLowerCase() && customer.openToRelocate === "NO" && candidate.openToRelocate === "NO") {
    potentialConcerns.push(`Living in different cities (${customer.city} vs ${candidate.city}) while neither indicates willingness to relocate.`);
  }

  if (customer.wantChildren !== candidate.wantChildren) {
    potentialConcerns.push(`Different views on children: ${customer.firstName} is '${customer.wantChildren}' while ${candidate.firstName} is '${candidate.wantChildren}'.`);
  }

  if (customer.diet !== candidate.diet) {
    potentialConcerns.push(`Dietary difference: ${customer.diet.replace("_", " ")} vs ${candidate.diet.replace("_", " ")}.`);
  }

  if (Math.abs(customerScoreAtoB - candidateScoreBtoA) >= 25) {
    potentialConcerns.push(`Asymmetric preference fit: ${customer.firstName}'s criteria fit is ${customerScoreAtoB}% while ${candidate.firstName}'s reciprocal fit is ${candidateScoreBtoA}%.`);
  }

  if (potentialConcerns.length === 0) {
    potentialConcerns.push("No significant structural dealbreakers or value conflicts identified.");
  }

  // 3. Missing information
  if (!candidate.familyValues) missingInformation.push("Candidate family values not specified");
  if (!candidate.marriageTimeline) missingInformation.push("Candidate marriage timeline undefined");
  if (!candidate.annualIncome) missingInformation.push("Candidate annual income not disclosed");
  if (!candidate.isVerified) missingInformation.push("Candidate identity verification pending");

  // 4. Grounded concise explanation
  const candidateAge = calculateAge(candidate.dateOfBirth);
  const tier = getCompatibilityTier(overallScore);

  const shortExplanation =
    `${candidate.firstName} (${candidateAge}, ${candidate.city}) matches ${customer.firstName} with an overall compatibility of ${overallScore}%. ` +
    (topPositiveFactors[0] ? `${topPositiveFactors[0]} ` : "") +
    (potentialConcerns[0] !== "No significant structural dealbreakers or value conflicts identified."
      ? `Operational note: ${potentialConcerns[0]}`
      : "Profile presents strong mutual reciprocal alignment.");

  return {
    candidateId: candidate.id,
    compatibilityScore: overallScore,
    tier,
    componentScores,
    customerScoreAtoB,
    candidateScoreBtoA,
    topPositiveFactors: topPositiveFactors.slice(0, 3),
    potentialConcerns: potentialConcerns.slice(0, 3),
    missingInformation,
    shortExplanation,
    algorithmVersion: ALGORITHM_VERSION,
    generatedAt: new Date().toISOString(),
    appliedDemoPresets,
  };
}
