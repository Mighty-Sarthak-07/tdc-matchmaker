export type Gender = "MALE" | "FEMALE";
export type MaritalStatus = "NEVER_MARRIED" | "DIVORCED" | "WIDOWED" | "AWAITING_DIVORCE";
export type JourneyStage =
  | "NEW_LEAD"
  | "PROFILE_INCOMPLETE"
  | "VERIFICATION_PENDING"
  | "VERIFIED"
  | "ACTIVE_MATCHMAKING"
  | "MATCH_SUGGESTED"
  | "MEETING_SCHEDULED"
  | "FOLLOW_UP_REQUIRED"
  | "SUCCESSFULLY_MATCHED"
  | "ON_HOLD";

export type CompatibilityTier = "HIGH_POTENTIAL" | "GOOD_POTENTIAL" | "NEEDS_REVIEW";

export interface CustomerData {
  id: string;
  customerCode: string;
  firstName: string;
  lastName: string;
  gender: Gender | string;
  dateOfBirth: Date | string;
  heightCm: number;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  maritalStatus: MaritalStatus | string;
  isVerified: boolean;
  verificationNotes?: string | null;

  undergraduateCollege?: string | null;
  degree?: string | null;
  highestEducation: string;
  currentCompany?: string | null;
  designation?: string | null;
  industry?: string | null;
  employmentType?: string | null;
  annualIncome?: number | null;
  incomeCurrency?: string;

  religion: string;
  caste?: string | null;
  motherTongue: string;
  otherLanguages?: string | string[] | null;
  familyType?: string | null;
  familyValues?: string | null;
  familyLocation?: string | null;
  fatherOccupation?: string | null;
  motherOccupation?: string | null;
  siblingsCount?: number;
  siblingDetails?: string | null;

  wantChildren: string; // "YES" | "NO" | "MAYBE"
  openToRelocate: string; // "YES" | "NO" | "MAYBE"
  openToPets: string; // "YES" | "NO" | "MAYBE"
  diet: string; // "VEGETARIAN" | "EGGETARIAN" | "NON_VEGETARIAN" | "VEGAN" | "JAIN"
  smoking?: string | null;
  drinking?: string | null;
  hobbies?: string | string[] | null;
  marriageTimeline?: string | null;
  relationshipExpectations?: string | null;
  familyExpectations?: string | null;

  journeyStage: JourneyStage | string;
  profileCompleteness: number;
  isArchived: boolean;

  partnerPreference?: PartnerPreferenceData | null;
}

export interface PartnerPreferenceData {
  id?: string;
  customerId?: string;
  minAge?: number | null;
  maxAge?: number | null;
  minHeightCm?: number | null;
  maxHeightCm?: number | null;
  preferredCities?: string | string[] | null;
  preferredEducation?: string | string[] | null;
  preferredProfessions?: string | string[] | null;
  maritalStatusPreferences?: string | string[] | null;
  wantChildrenPreference?: string | null; // "ANY" | "YES" | "NO" | "MAYBE"
  openToRelocatePreference?: string | null; // "ANY" | "YES" | "NO"
  dietPreferences?: string | string[] | null;
  religionPreferences?: string | string[] | null;
  dealbreakers?: string | string[] | null; // JSON array of dealbreaker keys
  flexiblePreferences?: string | string[] | null;
}

export interface EligibilityResult {
  isEligible: boolean;
  failedReasons: string[];
}

export interface ComponentScores {
  mutualPreference: number; // 0-100
  familyValues: number;     // 0-100
  careerEducation: number;  // 0-100
  locationRelocation: number; // 0-100
  lifestyleInterests: number; // 0-100
  ageHeight: number;        // 0-100
}

export interface MatchingWeights {
  mutualPreference: number;
  familyValues: number;
  careerEducation: number;
  locationRelocation: number;
  lifestyleInterests: number;
  ageHeight: number;
}

export interface RecommendationExplanation {
  candidateId: string;
  compatibilityScore: number;
  tier: CompatibilityTier;
  componentScores: ComponentScores;
  customerScoreAtoB: number;
  candidateScoreBtoA: number;
  topPositiveFactors: string[];
  potentialConcerns: string[];
  missingInformation: string[];
  shortExplanation: string;
  algorithmVersion: string;
  generatedAt: string;
  appliedDemoPresets?: string[];
}

export interface MatchRecommendationResult {
  candidate: CustomerData;
  eligibility: EligibilityResult;
  compatibility: RecommendationExplanation;
}
