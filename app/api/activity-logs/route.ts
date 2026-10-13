import { NextResponse } from "next/server";
import { ActivityService } from "@/lib/services/activity.service";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const logs = await ActivityService.getActivityLogs(60);
    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve activity log" }, { status: 500 });
  }
}
