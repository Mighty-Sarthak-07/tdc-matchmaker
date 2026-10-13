import { db } from "../db";

export class ActivityService {
  static async addNote(customerId: string, authorId: string, content: string, noteType: string = "GENERAL") {
    const note = await db.customerNote.create({
      data: {
        customerId,
        authorId,
        noteType,
        content,
      },
      include: {
        author: { select: { name: true, email: true } },
      },
    });

    await db.activityLog.create({
      data: {
        customerId,
        userId: authorId,
        actionType: "NOTE_ADDED",
        title: `Internal Note Added (${noteType})`,
        details: content.length > 80 ? content.slice(0, 80) + "..." : content,
      },
    });

    return note;
  }

  static async createFollowUp(
    customerId: string,
    matchmakerId: string,
    title: string,
    dueDate: Date,
    priority: string = "MEDIUM",
    description?: string
  ) {
    const followUp = await db.followUp.create({
      data: {
        customerId,
        matchmakerId,
        title,
        dueDate,
        priority,
        description,
        status: "PENDING",
      },
      include: {
        customer: { select: { firstName: true, lastName: true, customerCode: true } },
      },
    });

    await db.activityLog.create({
      data: {
        customerId,
        userId: matchmakerId,
        actionType: "FOLLOWUP_SCHEDULED",
        title: `Follow-up Scheduled: ${title}`,
        details: JSON.stringify({ priority, dueDate }),
      },
    });

    return followUp;
  }

  static async toggleFollowUp(id: string, status: "COMPLETED" | "PENDING", userId: string) {
    const updated = await db.followUp.update({
      where: { id },
      data: {
        status,
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
      include: {
        customer: { select: { firstName: true, lastName: true } },
      },
    });

    await db.activityLog.create({
      data: {
        customerId: updated.customerId,
        userId,
        actionType: status === "COMPLETED" ? "FOLLOWUP_COMPLETED" : "FOLLOWUP_REOPENED",
        title: `Follow-up ${status.toLowerCase()}: ${updated.title}`,
      },
    });

    return updated;
  }

  static async getFollowUps(status?: string) {
    return db.followUp.findMany({
      where: status && status !== "ALL" ? { status } : {},
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            customerCode: true,
            city: true,
            phone: true,
          },
        },
        matchmaker: { select: { name: true, email: true } },
      },
      orderBy: { dueDate: "asc" },
    });
  }

  static async getActivityLogs(limit: number = 50) {
    return db.activityLog.findMany({
      include: {
        customer: { select: { id: true, firstName: true, lastName: true, customerCode: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
