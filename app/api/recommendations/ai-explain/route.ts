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
    if (!customer || !candidate || !compatibility) {
      return NextResponse.json({ error: "Missing required profile comparison data" }, { status: 400 });
    }

    const result = await AIService.generateMatchExplanation(customer, candidate, compatibility);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Explain route error:", error);
    return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 });
  }
}
