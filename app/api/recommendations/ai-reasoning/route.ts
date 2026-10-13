import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/lib/services/ai.service";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { customer, candidate, compatibility } = await req.json();
    if (!customer || !candidate) {
      return NextResponse.json(
        { error: "Missing required customer or candidate profile data" },
        { status: 400 }
      );
    }

    const reasoning = await AIService.evaluateFitReasoning(
      customer,
      candidate,
      compatibility
    );

    return NextResponse.json(reasoning);
  } catch (error: any) {
    console.error("AI Reasoning route error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate profile fit reasoning" },
      { status: 500 }
    );
  }
}
