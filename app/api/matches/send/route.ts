import { NextRequest, NextResponse } from "next/server";
import { MatchActionService } from "@/lib/services/match-action.service";
import { getSessionUser } from "@/lib/auth";
import { z } from "zod";

const SendMatchSchema = z.object({
  customerAId: z.string(),
  customerBId: z.string(),
  subject: z.string().min(3),
  messageBody: z.string().min(10),
  compatibilityScore: z.number(),
  tier: z.string(),
  scoreBreakdown: z.any(),
  explanationText: z.string(),
  sharedPreferences: z.array(z.string()).default([]),
  potentialConflicts: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = SendMatchSchema.parse(body);

    const interaction = await MatchActionService.sendMatch({
      ...validated,
      senderId: user.userId,
    });

    return NextResponse.json({
      success: true,
      interaction,
      message: "Match introduction successfully created and dispatched in simulation.",
    });
  } catch (error: any) {
    console.error("Send match error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to dispatch match" },
      { status: 400 }
    );
  }
}
