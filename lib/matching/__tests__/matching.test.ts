import { describe, it, expect } from "vitest";
import {
  evaluateCandidate,
  rankCandidates,
  checkEligibility,
  calculateComponentScores,
  calculateWeightedScore,
  DEFAULT_MATCHING_WEIGHTS,
} from "../index";
import { CustomerData } from "../types";

const mockMaleCustomer: CustomerData = {
  id: "cust-male-1",
  customerCode: "TDC-001",
  firstName: "Rohan",
  lastName: "Sharma",
  gender: "MALE",
  dateOfBirth: "1994-06-15",
  heightCm: 178,
  email: "rohan.sharma@example.com",
  phone: "+91 98765 43210",
  city: "Mumbai",
  state: "Maharashtra",
  country: "India",
  maritalStatus: "NEVER_MARRIED",
  isVerified: true,
  highestEducation: "MASTERS",
  employmentType: "PRIVATE",
  annualIncome: 32,
  religion: "HINDU",
  motherTongue: "Hindi",
  familyValues: "MODERATE",
  familyType: "NUCLEAR",
  wantChildren: "YES",
  openToRelocate: "YES",
  openToPets: "YES",
  diet: "VEGETARIAN",
  smoking: "NEVER",
  drinking: "SOCIALLY",
  hobbies: JSON.stringify(["Reading", "Travel", "Cooking"]),
  marriageTimeline: "6_TO_12_MONTHS",
  journeyStage: "ACTIVE_MATCHMAKING",
  profileCompleteness: 95,
  isArchived: false,
  partnerPreference: {
    minAge: 25,
    maxAge: 31,
    minHeightCm: 155,
    maxHeightCm: 172,
    preferredCities: JSON.stringify(["Mumbai", "Pune"]),
    preferredEducation: JSON.stringify(["MASTERS", "BACHELORS"]),
    maritalStatusPreferences: JSON.stringify(["NEVER_MARRIED"]),
    wantChildrenPreference: "YES",
    dealbreakers: JSON.stringify(["MARITAL_STATUS", "CHILDREN"]),
  },
};

const mockFemaleCandidateHigh: CustomerData = {
  id: "cand-fem-1",
  customerCode: "TDC-002",
  firstName: "Ananya",
  lastName: "Deshmukh",
  gender: "FEMALE",
  dateOfBirth: "1996-04-20", // ~30 years old
  heightCm: 165,
  email: "ananya.deshmukh@example.com",
  phone: "+91 98765 12345",
  city: "Mumbai",
  state: "Maharashtra",
  country: "India",
  maritalStatus: "NEVER_MARRIED",
  isVerified: true,
  highestEducation: "MASTERS",
  employmentType: "PRIVATE",
  annualIncome: 24,
  religion: "HINDU",
  motherTongue: "Marathi",
  familyValues: "MODERATE",
  familyType: "NUCLEAR",
  wantChildren: "YES",
  openToRelocate: "YES",
  openToPets: "YES",
  diet: "VEGETARIAN",
  smoking: "NEVER",
  drinking: "SOCIALLY",
  hobbies: JSON.stringify(["Travel", "Photography", "Reading"]),
  marriageTimeline: "6_TO_12_MONTHS",
  journeyStage: "ACTIVE_MATCHMAKING",
  profileCompleteness: 90,
  isArchived: false,
  partnerPreference: {
    minAge: 28,
    maxAge: 34,
    minHeightCm: 172,
    maxHeightCm: 185,
    preferredCities: JSON.stringify(["Mumbai", "Pune"]),
    preferredEducation: JSON.stringify(["MASTERS"]),
    maritalStatusPreferences: JSON.stringify(["NEVER_MARRIED"]),
    wantChildrenPreference: "YES",
    dealbreakers: JSON.stringify(["MARITAL_STATUS", "CHILDREN"]),
  },
};

const mockFemaleCandidateDealbreaker: CustomerData = {
  id: "cand-fem-2",
  customerCode: "TDC-003",
  firstName: "Pooja",
  lastName: "Mehta",
  gender: "FEMALE",
  dateOfBirth: "1995-01-10",
  heightCm: 160,
  email: "pooja.mehta@example.com",
  phone: "+91 98765 77777",
  city: "Delhi",
  state: "Delhi",
  country: "India",
  maritalStatus: "DIVORCED", // Violates hard marital constraint
  isVerified: true,
  highestEducation: "BACHELORS",
  employmentType: "BUSINESS",
  annualIncome: 18,
  religion: "HINDU",
  motherTongue: "Hindi",
  familyValues: "LIBERAL",
  familyType: "NUCLEAR",
  wantChildren: "NO", // Violates hard children constraint
  openToRelocate: "NO",
  openToPets: "NO",
  diet: "NON_VEGETARIAN",
  smoking: "REGULARLY",
  drinking: "REGULARLY",
  hobbies: JSON.stringify(["Clubbing"]),
  marriageTimeline: "NOT_DECIDED",
  journeyStage: "ACTIVE_MATCHMAKING",
  profileCompleteness: 85,
  isArchived: false,
};

describe("TDC Matchmaker Core Matching Engine", () => {
  it("enforces Phase A candidate eligibility and rejects hard dealbreakers", () => {
    // 1. High match candidate should be eligible
    const eligibleRes = checkEligibility(mockMaleCustomer, mockFemaleCandidateHigh);
    expect(eligibleRes.isEligible).toBe(true);
    expect(eligibleRes.failedReasons).toHaveLength(0);

    // 2. Dealbreaker candidate should fail on marital status and children
    const dealbreakerRes = checkEligibility(mockMaleCustomer, mockFemaleCandidateDealbreaker);
    expect(dealbreakerRes.isEligible).toBe(false);
    expect(dealbreakerRes.failedReasons.length).toBeGreaterThanOrEqual(2);
    expect(dealbreakerRes.failedReasons.some((r) => r.includes("marital"))).toBe(true);
    expect(dealbreakerRes.failedReasons.some((r) => r.includes("children"))).toBe(true);
  });

  it("prevents self-matching, archived candidates, and duplicate matches", () => {
    // Self match
    const selfRes = checkEligibility(mockMaleCustomer, mockMaleCustomer);
    expect(selfRes.isEligible).toBe(false);
    expect(selfRes.failedReasons).toContain("Cannot match a customer with themselves.");

    // Archived candidate
    const archivedCand = { ...mockFemaleCandidateHigh, isArchived: true };
    const archivedRes = checkEligibility(mockMaleCustomer, archivedCand);
    expect(archivedRes.isEligible).toBe(false);
    expect(archivedRes.failedReasons.some((r) => r.includes("archived"))).toBe(true);

    // Duplicate match
    const dupRes = checkEligibility(mockMaleCustomer, mockFemaleCandidateHigh, {
      existingMatchedCandidateIds: [mockFemaleCandidateHigh.id],
    });
    expect(dupRes.isEligible).toBe(false);
    expect(dupRes.failedReasons.some((r) => r.includes("already been recommended"))).toBe(true);

    // Previously rejected
    const rejRes = checkEligibility(mockMaleCustomer, mockFemaleCandidateHigh, {
      rejectedCandidateIds: [mockFemaleCandidateHigh.id],
    });
    expect(rejRes.isEligible).toBe(false);
    expect(rejRes.failedReasons.some((r) => r.includes("previously dismissed"))).toBe(true);
  });

  it("produces deterministic scoring and verified 6-component breakdown", () => {
    const appliedPresets: string[] = [];
    const { scores, customerScoreAtoB, candidateScoreBtoA } = calculateComponentScores(
      mockMaleCustomer,
      mockFemaleCandidateHigh,
      appliedPresets
    );

    // All scores must be normalized 0-100
    expect(scores.mutualPreference).toBeGreaterThanOrEqual(0);
    expect(scores.mutualPreference).toBeLessThanOrEqual(100);
    expect(scores.familyValues).toBeGreaterThanOrEqual(0);
    expect(scores.familyValues).toBeLessThanOrEqual(100);
    expect(scores.careerEducation).toBeGreaterThanOrEqual(0);
    expect(scores.careerEducation).toBeLessThanOrEqual(100);
    expect(scores.locationRelocation).toBe(100); // Same city (Mumbai)
    expect(scores.lifestyleInterests).toBeGreaterThanOrEqual(0);
    expect(scores.ageHeight).toBeGreaterThanOrEqual(0);

    // Weights sum check
    const weightsSum =
      DEFAULT_MATCHING_WEIGHTS.mutualPreference +
      DEFAULT_MATCHING_WEIGHTS.familyValues +
      DEFAULT_MATCHING_WEIGHTS.careerEducation +
      DEFAULT_MATCHING_WEIGHTS.locationRelocation +
      DEFAULT_MATCHING_WEIGHTS.lifestyleInterests +
      DEFAULT_MATCHING_WEIGHTS.ageHeight;
    expect(weightsSum).toBeCloseTo(1.0, 5);

    // Weighted calculation
    const overallScore = calculateWeightedScore(scores, DEFAULT_MATCHING_WEIGHTS);
    expect(overallScore).toBeGreaterThanOrEqual(75);

    // Deterministic check: repeating calculation yields identical result
    const repeatResult = calculateWeightedScore(scores, DEFAULT_MATCHING_WEIGHTS);
    expect(repeatResult).toBe(overallScore);
  });

  it("evaluates and ranks candidate list with explainable recommendation output", () => {
    const ranked = rankCandidates(mockMaleCustomer, [
      mockFemaleCandidateDealbreaker,
      mockFemaleCandidateHigh,
    ]);

    expect(ranked).toHaveLength(2);
    // Eligible high match candidate should be ranked first
    expect(ranked[0].candidate.id).toBe(mockFemaleCandidateHigh.id);
    expect(ranked[0].eligibility.isEligible).toBe(true);
    expect(ranked[0].compatibility.tier).toBe("HIGH_POTENTIAL");
    expect(ranked[0].compatibility.topPositiveFactors.length).toBeGreaterThanOrEqual(1);

    // Dealbreaker candidate ranked second and marked ineligible
    expect(ranked[1].candidate.id).toBe(mockFemaleCandidateDealbreaker.id);
    expect(ranked[1].eligibility.isEligible).toBe(false);
  });
});
