import { CustomerData, ComponentScores, MatchingWeights } from "./types";
import { DEFAULT_MATCHING_WEIGHTS } from "./config";
import { calculateAge } from "../utils";

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
 * Calculates one-way preference suitability: How well Candidate matches Customer's explicit preferences.
 */
export function calculateOneWayScore(customer: CustomerData, candidate: CustomerData): number {
  const prefs = customer.partnerPreference;
  if (!prefs) return 70; // Baseline neutral when no preferences set

  let totalPoints = 0;
  let maxPoints = 0;

  // Age fit
  const candidateAge = calculateAge(candidate.dateOfBirth);
  if (prefs.minAge != null && prefs.maxAge != null) {
    maxPoints += 20;
    if (candidateAge >= prefs.minAge && candidateAge <= prefs.maxAge) {
      totalPoints += 20;
    } else {
      const dist = Math.min(Math.abs(candidateAge - prefs.minAge), Math.abs(candidateAge - prefs.maxAge));
      totalPoints += Math.max(0, 20 - dist * 4);
    }
  }

  // Height fit
  if (prefs.minHeightCm != null && prefs.maxHeightCm != null) {
    maxPoints += 15;
    if (candidate.heightCm >= prefs.minHeightCm && candidate.heightCm <= prefs.maxHeightCm) {
      totalPoints += 15;
    } else {
      const dist = Math.min(Math.abs(candidate.heightCm - prefs.minHeightCm), Math.abs(candidate.heightCm - prefs.maxHeightCm));
      totalPoints += Math.max(0, 15 - dist * 2);
    }
  }

  // Location fit
  const preferredCities = parseJsonArray(prefs.preferredCities).map((c) => c.toLowerCase());
  if (preferredCities.length > 0) {
    maxPoints += 20;
    if (preferredCities.includes(candidate.city.toLowerCase())) {
      totalPoints += 20;
    } else if (candidate.openToRelocate === "YES" || customer.openToRelocate === "YES") {
      totalPoints += 14;
    } else {
      totalPoints += 4;
    }
  }

  // Education fit
  const preferredEducation = parseJsonArray(prefs.preferredEducation).map((e) => e.toUpperCase());
  if (preferredEducation.length > 0) {
    maxPoints += 15;
    if (preferredEducation.includes(candidate.highestEducation.toUpperCase())) {
      totalPoints += 15;
    } else {
      totalPoints += 6;
    }
  }

  // Diet fit
  const preferredDiets = parseJsonArray(prefs.dietPreferences).map((d) => d.toUpperCase());
  if (preferredDiets.length > 0) {
    maxPoints += 15;
    if (preferredDiets.includes(candidate.diet.toUpperCase())) {
      totalPoints += 15;
    } else {
      totalPoints += 5;
    }
  }

  // Marital Status fit
  const preferredMarital = parseJsonArray(prefs.maritalStatusPreferences);
  if (preferredMarital.length > 0) {
    maxPoints += 15;
    if (preferredMarital.includes(candidate.maritalStatus)) {
      totalPoints += 15;
    } else {
      totalPoints += 0;
    }
  }

  if (maxPoints === 0) return 75;
  return Math.round((totalPoints / maxPoints) * 100);
}

/**
 * Evaluates Family plans, relationship values, and marriage timeline (0-100).
 */
export function scoreFamilyAndValues(customer: CustomerData, candidate: CustomerData): number {
  let score = 0;

  // 1. Views on children (35 points)
  if (customer.wantChildren === candidate.wantChildren) {
    score += 35;
  } else if (
    (customer.wantChildren === "MAYBE" && candidate.wantChildren !== "NO") ||
    (candidate.wantChildren === "MAYBE" && customer.wantChildren !== "NO")
  ) {
    score += 26;
  } else {
    score += 8;
  }

  // 2. Family values (25 points)
  if (customer.familyValues && candidate.familyValues) {
    if (customer.familyValues === candidate.familyValues) {
      score += 25;
    } else if (
      (customer.familyValues === "MODERATE" || candidate.familyValues === "MODERATE")
    ) {
      score += 18;
    } else {
      score += 8;
    }
  } else {
    score += 17; // Neutral fallback when missing
  }

  // 3. Family type & structure (20 points)
  if (customer.familyType && candidate.familyType) {
    if (customer.familyType === candidate.familyType) {
      score += 20;
    } else {
      score += 14;
    }
  } else {
    score += 15;
  }

  // 4. Marriage timeline (20 points)
  if (customer.marriageTimeline && candidate.marriageTimeline) {
    if (customer.marriageTimeline === candidate.marriageTimeline) {
      score += 20;
    } else {
      score += 12;
    }
  } else {
    score += 14;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Evaluates Career, education, and professional synergy (0-100).
 */
export function scoreCareerAndEducation(customer: CustomerData, candidate: CustomerData): number {
  let score = 0;

  // 1. Highest Education (40 points)
  const eduRank: Record<string, number> = {
    DOCTORATE: 4,
    MASTERS: 3,
    BACHELORS: 2,
    OTHER: 1,
  };
  const cRank = eduRank[customer.highestEducation.toUpperCase()] || 2;
  const candRank = eduRank[candidate.highestEducation.toUpperCase()] || 2;
  const diff = Math.abs(cRank - candRank);
  if (diff === 0) {
    score += 40;
  } else if (diff === 1) {
    score += 32;
  } else {
    score += 20;
  }

  // 2. Industry & Employment type (30 points)
  if (customer.employmentType && candidate.employmentType) {
    if (customer.employmentType === candidate.employmentType) {
      score += 30;
    } else {
      score += 22;
    }
  } else {
    score += 20;
  }

  // 3. Income alignment / parity (30 points)
  if (customer.annualIncome != null && candidate.annualIncome != null) {
    const ratio = Math.min(customer.annualIncome, candidate.annualIncome) /
      Math.max(customer.annualIncome, candidate.annualIncome);
    if (ratio >= 0.7) {
      score += 30;
    } else if (ratio >= 0.4) {
      score += 22;
    } else {
      score += 15;
    }
  } else {
    score += 22;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Evaluates Location proximity and relocation openness (0-100).
 */
export function scoreLocationAndRelocation(customer: CustomerData, candidate: CustomerData): number {
  // Same city = 100
  if (customer.city.toLowerCase() === candidate.city.toLowerCase()) {
    return 100;
  }

  // Same state = 75
  if (customer.state.toLowerCase() === candidate.state.toLowerCase()) {
    return 75;
  }

  // Both or one open to relocation
  if (customer.openToRelocate === "YES" && candidate.openToRelocate === "YES") {
    return 80;
  }
  if (customer.openToRelocate === "YES" || candidate.openToRelocate === "YES") {
    return 65;
  }
  if (customer.openToRelocate === "MAYBE" || candidate.openToRelocate === "MAYBE") {
    return 50;
  }

  return 30;
}

/**
 * Evaluates Lifestyle, diet, pet openness, and leisure interests (0-100).
 */
export function scoreLifestyleAndInterests(customer: CustomerData, candidate: CustomerData): number {
  let score = 0;

  // 1. Diet compatibility (35 points)
  if (customer.diet === candidate.diet) {
    score += 35;
  } else if (
    (customer.diet === "VEGETARIAN" && candidate.diet === "EGGETARIAN") ||
    (customer.diet === "EGGETARIAN" && candidate.diet === "VEGETARIAN")
  ) {
    score += 28;
  } else if (
    (customer.diet === "VEGETARIAN" && candidate.diet === "VEGAN") ||
    (customer.diet === "VEGAN" && candidate.diet === "VEGETARIAN")
  ) {
    score += 30;
  } else {
    score += 12;
  }

  // 2. Pet openness (25 points)
  if (customer.openToPets === candidate.openToPets) {
    score += 25;
  } else if (customer.openToPets === "MAYBE" || candidate.openToPets === "MAYBE") {
    score += 20;
  } else {
    score += 10;
  }

  // 3. Smoking & Drinking habits (20 points)
  const smokeMatch = customer.smoking === candidate.smoking;
  const drinkMatch = customer.drinking === candidate.drinking;
  score += (smokeMatch ? 10 : 5) + (drinkMatch ? 10 : 5);

  // 4. Shared hobbies / interests (20 points)
  const custHobbies = parseJsonArray(customer.hobbies).map((h) => h.toLowerCase());
  const candHobbies = parseJsonArray(candidate.hobbies).map((h) => h.toLowerCase());
  const shared = custHobbies.filter((h) => candHobbies.includes(h));
  if (shared.length >= 2) {
    score += 20;
  } else if (shared.length === 1) {
    score += 15;
  } else {
    score += 8;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Evaluates Age & Height preferences (0-100).
 */
export function scoreAgeAndHeight(customer: CustomerData, candidate: CustomerData): number {
  const prefs = customer.partnerPreference;
  const candidateAge = calculateAge(candidate.dateOfBirth);
  let ageScore = 75;

  if (prefs?.minAge != null && prefs?.maxAge != null) {
    if (candidateAge >= prefs.minAge && candidateAge <= prefs.maxAge) {
      ageScore = 100;
    } else {
      const diff = Math.min(Math.abs(candidateAge - prefs.minAge), Math.abs(candidateAge - prefs.maxAge));
      ageScore = Math.max(20, 100 - diff * 15);
    }
  }

  let heightScore = 75;
  if (prefs?.minHeightCm != null && prefs?.maxHeightCm != null) {
    if (candidate.heightCm >= prefs.minHeightCm && candidate.heightCm <= prefs.maxHeightCm) {
      heightScore = 100;
    } else {
      const diff = Math.min(
        Math.abs(candidate.heightCm - prefs.minHeightCm),
        Math.abs(candidate.heightCm - prefs.maxHeightCm)
      );
      heightScore = Math.max(20, 100 - diff * 8);
    }
  }

  return Math.round(ageScore * 0.6 + heightScore * 0.4);
}

/**
 * Calculates all 6 normalized component scores (0-100 each).
 */
export function calculateComponentScores(
  customer: CustomerData,
  candidate: CustomerData,
  appliedDemoPresets: string[] = []
): { scores: ComponentScores; customerScoreAtoB: number; candidateScoreBtoA: number } {
  const customerScoreAtoB = calculateOneWayScore(customer, candidate);
  const candidateScoreBtoA = calculateOneWayScore(candidate, customer);

  // Reciprocal mutual preference score is the harmonic mean of both directions
  const mutualPreference = Math.round(
    customerScoreAtoB > 0 && candidateScoreBtoA > 0
      ? (2 * customerScoreAtoB * candidateScoreBtoA) / (customerScoreAtoB + candidateScoreBtoA)
      : (customerScoreAtoB + candidateScoreBtoA) / 2
  );

  let familyValues = scoreFamilyAndValues(customer, candidate);
  let careerEducation = scoreCareerAndEducation(customer, candidate);
  let locationRelocation = scoreLocationAndRelocation(customer, candidate);
  let lifestyleInterests = scoreLifestyleAndInterests(customer, candidate);
  let ageHeight = scoreAgeAndHeight(customer, candidate);

  // Phase C: Assignment Demo Gender Presets
  // These represent the assignment's explicit demonstration specifications
  if (customer.gender === "MALE") {
    appliedDemoPresets.push("Demo Preset: Male Customer Profile (proportional height, age window, family plans)");
    // Male customer demo preset fine-tuning
    if (candidate.wantChildren === "YES" && customer.wantChildren === "YES") {
      familyValues = Math.min(100, familyValues + 5);
    }
  } else if (customer.gender === "FEMALE") {
    appliedDemoPresets.push("Demo Preset: Female Customer Profile (education synergy, family values, relocation clarity)");
    // Female customer demo preset fine-tuning
    if (candidate.highestEducation === "MASTERS" || candidate.highestEducation === "DOCTORATE") {
      careerEducation = Math.min(100, careerEducation + 4);
    }
  }

  return {
    scores: {
      mutualPreference,
      familyValues,
      careerEducation,
      locationRelocation,
      lifestyleInterests,
      ageHeight,
    },
    customerScoreAtoB,
    candidateScoreBtoA,
  };
}

/**
 * Computes overall weighted compatibility score using configured weights.
 */
export function calculateWeightedScore(
  scores: ComponentScores,
  weights: MatchingWeights = DEFAULT_MATCHING_WEIGHTS
): number {
  const weighted =
    scores.mutualPreference * weights.mutualPreference +
    scores.familyValues * weights.familyValues +
    scores.careerEducation * weights.careerEducation +
    scores.locationRelocation * weights.locationRelocation +
    scores.lifestyleInterests * weights.lifestyleInterests +
    scores.ageHeight * weights.ageHeight;

  return Math.round(Math.min(100, Math.max(0, weighted)) * 10) / 10;
}
