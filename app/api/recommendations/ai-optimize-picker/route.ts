import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/lib/services/ai.service";
import { CustomerService } from "@/lib/services/customer.service";
import { MatchingService } from "@/lib/services/matching.service";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    let { customer, candidates, customerId, minScore, city, onlyVerified } = body;

    // If client provided customer and candidate pool directly, use them
    if (customer && candidates && candidates.length > 0) {
      const optimalMatch = await AIService.selectOptimalProfile(customer, candidates);
      return NextResponse.json({ success: true, optimalMatch });
    }

    // Otherwise, load focal profile and candidates using MatchingService
    const targetId = customerId || customer?.id;
    if (!targetId) {
      return NextResponse.json(
        { error: "Missing customer identifier or candidate pool" },
        { status: 400 }
      );
    }

    const focalCustomer = await CustomerService.getCustomerById(targetId);
    if (!focalCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const ranked = await MatchingService.getRecommendationsForCustomer(targetId, {
      minScore: minScore !== undefined ? Number(minScore) : 60,
      city: city && city !== "ALL" ? city : undefined,
      onlyVerified: Boolean(onlyVerified),
    });

    if (ranked.length === 0) {
      return NextResponse.json(
        { error: "No eligible candidates match current filters to pick an optimal match." },
        { status: 400 }
      );
    }

    const optimalMatch = await AIService.selectOptimalProfile(focalCustomer, ranked);
    return NextResponse.json({ success: true, optimalMatch });
  } catch (error: any) {
    console.error("AI Optimal Profile Picker error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to run AI optimal profile picker" },
      { status: 500 }
    );
  }
}
