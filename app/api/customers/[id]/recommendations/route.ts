import { NextRequest, NextResponse } from "next/server";
import { MatchingService } from "@/lib/services/matching.service";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const minScore = parseFloat(searchParams.get("minScore") || "0");
  const city = searchParams.get("city") || undefined;
  const onlyVerified = searchParams.get("onlyVerified") === "true";

  try {
    const recommendations = await MatchingService.getRecommendationsForCustomer(id, {
      minScore,
      city,
      onlyVerified,
    });

    return NextResponse.json({ recommendations });
  } catch (error: any) {
    console.error("Recommendations error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
