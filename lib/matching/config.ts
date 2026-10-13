import { MatchingWeights, CompatibilityTier } from "./types";

export const ALGORITHM_VERSION = "v1.2.0";

/**
 * Standard assignment weight configuration (Phase B)
 * Total must strictly equal 1.0 (100%)
 */
export const DEFAULT_MATCHING_WEIGHTS: MatchingWeights = {
  mutualPreference: 0.30,
  familyValues: 0.25,
  careerEducation: 0.15,
  locationRelocation: 0.10,
  lifestyleInterests: 0.10,
  ageHeight: 0.10,
};

export const COMPATIBILITY_THRESHOLDS = {
  HIGH_POTENTIAL: 78,
  GOOD_POTENTIAL: 60,
};

export function getCompatibilityTier(score: number): CompatibilityTier {
  if (score >= COMPATIBILITY_THRESHOLDS.HIGH_POTENTIAL) {
    return "HIGH_POTENTIAL";
  }
  if (score >= COMPATIBILITY_THRESHOLDS.GOOD_POTENTIAL) {
    return "GOOD_POTENTIAL";
  }
  return "NEEDS_REVIEW";
}

/**
 * Phase C: Assignment-specific gender behavior demo presets.
 * Note: These are configurable demo presets rather than universal demographic assumptions.
 * When enabled in demo mode, they provide deliberate weighting shifts that are visible in the breakdown.
 */
export interface DemoGenderPresetConfig {
  enableDemoGenderPresets: boolean;
}

export const DEFAULT_DEMO_PRESET_CONFIG: DemoGenderPresetConfig = {
  enableDemoGenderPresets: true,
};
