import { NextRequest, NextResponse } from "next/server";
import { ActivityService } from "@/lib/services/activity.service";
import { getSessionUser } from "@/lib/auth";
import { z } from "zod";

const FollowUpSchema = z.object({
  customerId: z.string(),
  title: z.string().min(2),
  dueDate: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  description: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;

  try {
    const followUps = await ActivityService.getFollowUps(status);
    return NextResponse.json({ followUps });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve follow-ups" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = FollowUpSchema.parse(body);

    const followUp = await ActivityService.createFollowUp(
      validated.customerId,
      user.userId,
      validated.title,
      new Date(validated.dueDate),
      validated.priority,
      validated.description
    );

    return NextResponse.json({ success: true, followUp });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to schedule follow-up" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updated = await ActivityService.toggleFollowUp(id, status, user.userId);
    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to toggle follow-up" }, { status: 400 });
  }
}
