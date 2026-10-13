import { db } from "../db";
import { rankCandidates, CustomerData, MatchRecommendationResult } from "../matching";

export class MatchingService {
  static async getRecommendationsForCustomer(
    customerId: string,
    options: {
      minScore?: number;
      city?: string;
      onlyVerified?: boolean;
    } = {}
  ): Promise<MatchRecommendationResult[]> {
    const focal = await db.customerProfile.findUnique({
      where: { id: customerId },
      include: { partnerPreference: true },
    });

    if (!focal) {
      throw new Error("Customer profile not found");
    }

    // Existing sent matches to avoid duplicates
    const existingInteractions = await db.matchInteraction.findMany({
      where: {
        OR: [
          { customerAId: customerId },
          { customerBId: customerId },
        ],
      },
      select: { customerAId: true, customerBId: true },
    });

    const existingMatchedIds = existingInteractions.map((i) =>
      i.customerAId === customerId ? i.customerBId : i.customerAId
    );

    // Previously dismissed/rejected recommendations
    const rejectedRecs = await db.matchRecommendation.findMany({
      where: {
        customerId,
        status: { in: ["REJECTED", "DISMISSED"] },
      },
      select: { candidateId: true },
    });
    const rejectedCandidateIds = rejectedRecs.map((r) => r.candidateId);

    // Query candidate pool with complementary gender
    const complementaryGender = focal.gender === "MALE" ? "FEMALE" : "MALE";
    const candidates = await db.customerProfile.findMany({
      where: {
        id: { not: customerId },
        gender: complementaryGender,
        isArchived: false,
        ...(options.onlyVerified ? { isVerified: true } : {}),
        ...(options.city && options.city !== "ALL" ? { city: options.city } : {}),
      },
      include: { partnerPreference: true },
    });

    const focalData = focal as unknown as CustomerData;
    const candidatesData = candidates as unknown as CustomerData[];

    const ranked = rankCandidates(focalData, candidatesData, {
      rejectedCandidateIds,
      existingMatchedCandidateIds: existingMatchedIds,
    });

    // Filter by minScore if requested
    const minScore = options.minScore || 0;
    return ranked.filter((r) => r.compatibility.compatibilityScore >= minScore);
  }

  static async dismissRecommendation(customerId: string, candidateId: string) {
    return db.matchRecommendation.upsert({
      where: {
        customerId_candidateId: { customerId, candidateId },
      },
      create: {
        customerId,
        candidateId,
        compatibilityScore: 0,
        tier: "NEEDS_REVIEW",
        scoreBreakdown: "{}",
        customerScoreAtoB: 0,
        candidateScoreBtoA: 0,
        sharedPreferences: "[]",
        potentialConflicts: "[]",
        missingAttributes: "[]",
        explanationText: "Dismissed by matchmaker.",
        status: "DISMISSED",
      },
      update: {
        status: "DISMISSED",
      },
    });
  }
}
