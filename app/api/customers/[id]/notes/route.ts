import { NextRequest, NextResponse } from "next/server";
import { ActivityService } from "@/lib/services/activity.service";
import { getSessionUser } from "@/lib/auth";
import { z } from "zod";

const NoteSchema = z.object({
  content: z.string().min(2, "Note content cannot be empty."),
  noteType: z.string().default("GENERAL"),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const validated = NoteSchema.parse(body);

    const note = await ActivityService.addNote(
      id,
      user.userId,
      validated.content,
      validated.noteType
    );

    return NextResponse.json({ success: true, note });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add note" }, { status: 400 });
  }
}
