import { NextRequest, NextResponse } from "next/server";
import { MatchActionService } from "@/lib/services/match-action.service";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const matches = await MatchActionService.getSentMatches();
    return NextResponse.json({ matches });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve sent matches" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status, note } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updated = await MatchActionService.updateInteractionStatus(
      id,
      status,
      note,
      user.userId
    );
    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update match status" }, { status: 400 });
  }
}
