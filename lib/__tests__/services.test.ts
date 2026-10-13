import { describe, it, expect } from "vitest";
import { calculateAge, formatHeight, formatCurrencyLakhs } from "../utils";
import { AIService } from "../services/ai.service";
import { CustomerData, RecommendationExplanation } from "../matching/types";

describe("Utility Helpers & Age Calculations", () => {
  it("calculates age dynamically and accurately from date of birth", () => {
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - 28);
    // Setting DOB to 28 years ago
    const age = calculateAge(dob);
    expect(age).toBe(28);

    // Formatted string DOB
    const stringDob = "1995-05-15";
    const calculated = calculateAge(stringDob);
    expect(calculated).toBeGreaterThanOrEqual(30);
  });

  it("formats height in feet/inches and cm accurately", () => {
    expect(formatHeight(178)).toBe("5'10\" (178 cm)");
    expect(formatHeight(165)).toBe("5'5\" (165 cm)");
    expect(formatHeight(null)).toBe("Unknown");
  });

  it("formats currency in lakhs correctly", () => {
    expect(formatCurrencyLakhs(32)).toBe("₹32 LPA");
    expect(formatCurrencyLakhs(null)).toBe("Not disclosed");
  });
});

describe("AIService Deterministic Fallback Pipeline", () => {
  const mockCustomer: CustomerData = {
    id: "cust-1",
    customerCode: "TDC-M101",
    firstName: "Rohan",
    lastName: "Sharma",
    gender: "MALE",
    dateOfBirth: "1994-06-15",
    heightCm: 178,
    email: "rohan@example.com",
    phone: "+91 9876543210",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    maritalStatus: "NEVER_MARRIED",
    isVerified: true,
    highestEducation: "MASTERS",
    religion: "HINDU",
    motherTongue: "Hindi",
    wantChildren: "YES",
    openToRelocate: "YES",
    openToPets: "YES",
    diet: "VEGETARIAN",
    journeyStage: "ACTIVE_MATCHMAKING",
    profileCompleteness: 90,
    isArchived: false,
  };

  const mockCandidate: CustomerData = {
    id: "cand-1",
    customerCode: "TDC-F101",
    firstName: "Ananya",
    lastName: "Deshmukh",
    gender: "FEMALE",
    dateOfBirth: "1996-04-20",
    heightCm: 165,
    email: "ananya@example.com",
    phone: "+91 9876512345",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    maritalStatus: "NEVER_MARRIED",
    isVerified: true,
    highestEducation: "MASTERS",
    religion: "HINDU",
    motherTongue: "Marathi",
    wantChildren: "YES",
    openToRelocate: "YES",
    openToPets: "YES",
    diet: "VEGETARIAN",
    journeyStage: "ACTIVE_MATCHMAKING",
    profileCompleteness: 90,
    isArchived: false,
  };

  const mockComp: RecommendationExplanation = {
    candidateId: "cand-1",
    compatibilityScore: 92.5,
    tier: "HIGH_POTENTIAL",
    componentScores: {
      mutualPreference: 95,
      familyValues: 90,
      careerEducation: 90,
      locationRelocation: 100,
      lifestyleInterests: 90,
      ageHeight: 90,
    },
    customerScoreAtoB: 94,
    candidateScoreBtoA: 91,
    topPositiveFactors: ["Both based in Mumbai", "Mutual alignment on children"],
    potentialConcerns: ["No significant structural dealbreakers"],
    missingInformation: [],
    shortExplanation: "Ananya matches Rohan with strong compatibility.",
    algorithmVersion: "v1.2.0",
    generatedAt: new Date().toISOString(),
  };

  it("produces grounded deterministic match explanation when AI is not invoked", async () => {
    const res = await AIService.generateMatchExplanation(mockCustomer, mockCandidate, mockComp);
    expect(res).toBeDefined();
    expect(res.explanation).toContain("Ananya");
    expect(res.explanation).toContain("Rohan");
    expect(res.explanation).toContain("Mumbai");
    expect(res.keyHighlights.length).toBeGreaterThanOrEqual(1);
  });

  it("produces grounded, editable introduction message draft", async () => {
    const draft = await AIService.generateIntroductionDraft(mockCustomer, mockCandidate, mockComp);
    expect(draft).toBeDefined();
    expect(draft.subject).toContain("Ananya");
    expect(draft.messageBody).toContain("Dear Rohan");
    expect(draft.messageBody).toContain("Ananya");
  });

  it("produces multi-attribute LLM fit reasoning with qualitative scoring and matchmaker advice", async () => {
    const reasoning = await AIService.evaluateFitReasoning(mockCustomer, mockCandidate, mockComp);
    expect(reasoning).toBeDefined();
    expect(reasoning.qualitativeScore).toBeGreaterThanOrEqual(0);
    expect(reasoning.tier).toBeDefined();
    expect(reasoning.culturalAndFamilySynergy).toBeDefined();
    expect(reasoning.careerAndLifestyleAlignment).toBeDefined();
    expect(reasoning.matchmakerAdvice).toBeDefined();
  });
});
