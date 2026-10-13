import { CustomerData, EligibilityResult } from "./types";
import { calculateAge } from "../utils";

interface EligibilityOptions {
  rejectedCandidateIds?: string[];
  existingMatchedCandidateIds?: string[];
  requireCandidateVerification?: boolean;
}

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
 * Phase A: Candidate Eligibility Evaluation.
 * Enforces hard constraints, binary gender matching rules, deduplication, and dealbreakers.
 */
export function checkEligibility(
  customer: CustomerData,
  candidate: CustomerData,
  options: EligibilityOptions = {}
): EligibilityResult {
  const failedReasons: string[] = [];

  // 1. Same customer identity check
  if (customer.id === candidate.id) {
    failedReasons.push("Cannot match a customer with themselves.");
  }

  // 2. Archived or inactive profile check
  if (candidate.isArchived) {
    failedReasons.push("Candidate profile is currently archived or inactive.");
  }

  // 3. Gender eligibility check (matrimonial binary demo configuration)
  if (customer.gender === candidate.gender) {
    failedReasons.push(`Gender eligibility mismatch: ${customer.gender} and ${candidate.gender}.`);
  }

  // 4. Verification threshold check (if required)
  if (options.requireCandidateVerification && !candidate.isVerified) {
    failedReasons.push("Candidate profile has not passed mandatory identity verification.");
  }

  // 5. Duplicate match / already sent prevention
  if (options.existingMatchedCandidateIds?.includes(candidate.id)) {
    failedReasons.push("Candidate has already been recommended or sent to this customer.");
  }

  // 6. Previously rejected / dismissed check
  if (options.rejectedCandidateIds?.includes(candidate.id)) {
    failedReasons.push("Candidate was previously dismissed or rejected by the matchmaker for this client.");
  }

  const prefs = customer.partnerPreference;
  if (prefs) {
    const dealbreakers = parseJsonArray(prefs.dealbreakers).map((d) => d.toUpperCase());
    const candidateAge = calculateAge(candidate.dateOfBirth);

    // Hard Constraint: Age Dealbreaker
    if (dealbreakers.includes("AGE") || dealbreakers.includes("AGE_RANGE")) {
      if (prefs.minAge != null && candidateAge < prefs.minAge) {
        failedReasons.push(`Candidate age (${candidateAge}) is below customer minimum limit (${prefs.minAge}).`);
      }
      if (prefs.maxAge != null && candidateAge > prefs.maxAge) {
        failedReasons.push(`Candidate age (${candidateAge}) exceeds customer maximum limit (${prefs.maxAge}).`);
      }
    }

    // Hard Constraint: Marital Status Dealbreaker
    if (dealbreakers.includes("MARITAL_STATUS")) {
      const allowedMarital = parseJsonArray(prefs.maritalStatusPreferences);
      if (allowedMarital.length > 0 && !allowedMarital.includes(candidate.maritalStatus)) {
        failedReasons.push(`Candidate marital status (${candidate.maritalStatus}) violates hard marital constraint.`);
      }
    }

    // Hard Constraint: Location / City Dealbreaker
    if (dealbreakers.includes("LOCATION") || dealbreakers.includes("CITY")) {
      const allowedCities = parseJsonArray(prefs.preferredCities).map((c) => c.toLowerCase());
      if (allowedCities.length > 0 && !allowedCities.includes(candidate.city.toLowerCase())) {
        failedReasons.push(`Candidate location (${candidate.city}) conflicts with strict location dealbreaker.`);
      }
    }

    // Hard Constraint: Children Dealbreaker
    if (dealbreakers.includes("CHILDREN")) {
      if (customer.wantChildren === "YES" && candidate.wantChildren === "NO") {
        failedReasons.push("Candidate strictly does not want children, violating customer's hard requirement.");
      } else if (customer.wantChildren === "NO" && candidate.wantChildren === "YES") {
        failedReasons.push("Candidate wants children, which conflicts with customer's hard dealbreaker.");
      }
    }

    // Hard Constraint: Diet Dealbreaker
    if (dealbreakers.includes("DIET")) {
      const allowedDiets = parseJsonArray(prefs.dietPreferences).map((d) => d.toUpperCase());
      if (allowedDiets.length > 0 && !allowedDiets.includes(candidate.diet.toUpperCase())) {
        failedReasons.push(`Candidate diet (${candidate.diet}) conflicts with strict dietary dealbreaker.`);
      }
    }
  }

  return {
    isEligible: failedReasons.length === 0,
    failedReasons,
  };
}
