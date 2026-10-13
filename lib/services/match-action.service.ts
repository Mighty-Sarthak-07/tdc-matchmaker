import { db } from "../db";

export interface SendMatchParams {
  customerAId: string;
  customerBId: string;
  senderId: string;
  subject: string;
  messageBody: string;
  compatibilityScore: number;
  tier: string;
  scoreBreakdown: any;
  explanationText: string;
  sharedPreferences: string[];
  potentialConflicts: string[];
}

export class MatchActionService {
  /**
   * Executes Send Match workflow with transaction safety and duplicate prevention.
   */
  static async sendMatch(params: SendMatchParams) {
    const {
      customerAId,
      customerBId,
      senderId,
      subject,
      messageBody,
      compatibilityScore,
      tier,
      scoreBreakdown,
      explanationText,
      sharedPreferences,
      potentialConflicts,
    } = params;

    // Check duplicate send
    const existing = await db.matchInteraction.findFirst({
      where: {
        OR: [
          { customerAId, customerBId },
          { customerAId: customerBId, customerBId: customerAId },
        ],
      },
    });

    if (existing) {
      throw new Error("A match presentation has already been recorded for this client pair.");
    }

    return db.$transaction(async (tx) => {
      // 1. Upsert MatchRecommendation
      const rec = await tx.matchRecommendation.upsert({
        where: {
          customerId_candidateId: { customerId: customerAId, candidateId: customerBId },
        },
        create: {
          customerId: customerAId,
          candidateId: customerBId,
          compatibilityScore,
          tier,
          scoreBreakdown: JSON.stringify(scoreBreakdown),
          customerScoreAtoB: scoreBreakdown.customerScoreAtoB || compatibilityScore,
          candidateScoreBtoA: scoreBreakdown.candidateScoreBtoA || compatibilityScore,
          sharedPreferences: JSON.stringify(sharedPreferences),
          potentialConflicts: JSON.stringify(potentialConflicts),
          missingAttributes: JSON.stringify([]),
          explanationText,
          status: "SENT",
        },
        update: {
          status: "SENT",
        },
      });

      // 2. Create MatchInteraction
      const now = new Date();
      const statusHistory = [
        {
          status: "SENT",
          timestamp: now.toISOString(),
          note: "Simulated match introduction email delivered to client inbox.",
        },
      ];

      const interaction = await tx.matchInteraction.create({
        data: {
          matchRecommendationId: rec.id,
          customerAId,
          customerBId,
          senderId,
          subject,
          introductionMessage: messageBody,
          status: "SENT",
          statusHistory: JSON.stringify(statusHistory),
          sentAt: now,
        },
        include: {
          customerA: { select: { firstName: true, lastName: true, customerCode: true } },
          customerB: { select: { firstName: true, lastName: true, customerCode: true } },
          sender: { select: { name: true, email: true } },
        },
      });

      // 3. Update journey stage on customer A if appropriate
      await tx.customerProfile.update({
        where: { id: customerAId },
        data: { journeyStage: "MATCH_SUGGESTED", lastContactedAt: now },
      });

      // 4. Record Activity Log
      await tx.activityLog.create({
        data: {
          customerId: customerAId,
          userId: senderId,
          actionType: "MATCH_SENT",
          title: `Match Intro Sent: ${interaction.customerB.firstName} (${interaction.customerB.customerCode})`,
          details: JSON.stringify({
            interactionId: interaction.id,
            subject,
            compatibilityScore,
          }),
        },
      });

      return interaction;
    });
  }

  static async getSentMatches() {
    return db.matchInteraction.findMany({
      include: {
        customerA: true,
        customerB: true,
        sender: { select: { id: true, name: true, email: true } },
        recommendation: true,
      },
      orderBy: { sentAt: "desc" },
    });
  }

  static async updateInteractionStatus(
    id: string,
    newStatus: string,
    note: string,
    userId: string
  ) {
    const interaction = await db.matchInteraction.findUnique({
      where: { id },
      include: { customerA: true, customerB: true },
    });

    if (!interaction) {
      throw new Error("Match interaction not found");
    }

    let history: any[] = [];
    try {
      history = JSON.parse(interaction.statusHistory);
    } catch {
      history = [];
    }

    history.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${newStatus}`,
    });

    const updated = await db.matchInteraction.update({
      where: { id },
      data: {
        status: newStatus,
        statusHistory: JSON.stringify(history),
      },
    });

    await db.activityLog.create({
      data: {
        customerId: interaction.customerAId,
        userId,
        actionType: "MATCH_STATUS_UPDATED",
        title: `Match Status: ${interaction.customerB.firstName} → ${newStatus}`,
        details: JSON.stringify({ note }),
      },
    });

    return updated;
  }
}
