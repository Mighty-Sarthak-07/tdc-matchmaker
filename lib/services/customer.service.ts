import { db } from "../db";
import { Prisma } from "@prisma/client";

export interface CustomerFilterParams {
  search?: string;
  gender?: string;
  city?: string;
  maritalStatus?: string;
  isVerified?: boolean;
  journeyStage?: string;
  minAge?: number;
  maxAge?: number;
  page?: number;
  pageSize?: number;
  sortBy?: "name" | "age" | "lastContacted" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export class CustomerService {
  static async getCustomers(params: CustomerFilterParams = {}) {
    const {
      search,
      gender,
      city,
      maritalStatus,
      isVerified,
      journeyStage,
      page = 1,
      pageSize = 15,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const where: Prisma.CustomerProfileWhereInput = {
      isArchived: false,
    };

    if (search && search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        { firstName: { contains: q } },
        { lastName: { contains: q } },
        { customerCode: { contains: q } },
        { city: { contains: q } },
        { designation: { contains: q } },
        { currentCompany: { contains: q } },
      ];
    }

    if (gender && gender !== "ALL") {
      where.gender = gender;
    }

    if (city && city !== "ALL") {
      where.city = city;
    }

    if (maritalStatus && maritalStatus !== "ALL") {
      where.maritalStatus = maritalStatus;
    }

    if (typeof isVerified === "boolean") {
      where.isVerified = isVerified;
    }

    if (journeyStage && journeyStage !== "ALL") {
      where.journeyStage = journeyStage;
    }

    let orderBy: Prisma.CustomerProfileOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "name") {
      orderBy = { firstName: sortOrder };
    } else if (sortBy === "age") {
      // Inverted for DOB: younger = later DOB
      orderBy = { dateOfBirth: sortOrder === "asc" ? "desc" : "asc" };
    } else if (sortBy === "lastContacted") {
      orderBy = { lastContactedAt: sortOrder };
    }

    const [total, customers] = await Promise.all([
      db.customerProfile.count({ where }),
      db.customerProfile.findMany({
        where,
        include: {
          partnerPreference: true,
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      customers,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  static async getCustomerById(id: string) {
    return db.customerProfile.findUnique({
      where: { id },
      include: {
        partnerPreference: true,
        notes: {
          include: { author: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
        },
        followUps: {
          include: { matchmaker: { select: { id: true, name: true } } },
          orderBy: { dueDate: "asc" },
        },
        sentMatchesAsCustomerA: {
          include: {
            customerB: { select: { id: true, firstName: true, lastName: true, customerCode: true, city: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        sentMatchesAsCustomerB: {
          include: {
            customerA: { select: { id: true, firstName: true, lastName: true, customerCode: true, city: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        activityLogs: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });
  }

  static async updateCustomer(id: string, data: any) {
    const { partnerPreference, ...profileData } = data;

    return db.$transaction(async (tx) => {
      const updatedProfile = await tx.customerProfile.update({
        where: { id },
        data: profileData,
      });

      if (partnerPreference) {
        await tx.partnerPreference.upsert({
          where: { customerId: id },
          create: {
            customerId: id,
            ...partnerPreference,
          },
          update: partnerPreference,
        });
      }

      return updatedProfile;
    });
  }

  static async archiveCustomer(id: string) {
    return db.customerProfile.update({
      where: { id },
      data: { isArchived: true },
    });
  }

  static async getDashboardMetrics() {
    const now = new Date();
    const [
      totalAssigned,
      verifiedCount,
      activeSeeking,
      pendingInteractions,
      acceptedInteractions,
      followUpsDue,
      recentCustomers,
      recentFollowUps,
      journeyDistribution,
      recentActivities,
      topRecommendations,
    ] = await Promise.all([
      db.customerProfile.count({ where: { isArchived: false } }),
      db.customerProfile.count({ where: { isArchived: false, isVerified: true } }),
      db.customerProfile.count({
        where: {
          isArchived: false,
          journeyStage: { in: ["ACTIVE_MATCHMAKING", "MATCH_SUGGESTED"] },
        },
      }),
      db.matchInteraction.count({ where: { status: "SENT" } }),
      db.matchInteraction.count({ where: { status: { in: ["INTERESTED", "MEETING_SCHEDULED", "COMPLETED"] } } }),
      db.followUp.count({ where: { status: "PENDING", dueDate: { lte: now } } }),
      db.customerProfile.findMany({
        where: { isArchived: false },
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          customerCode: true,
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          gender: true,
          city: true,
          maritalStatus: true,
          designation: true,
          highestEducation: true,
          journeyStage: true,
          isVerified: true,
          createdAt: true,
        },
      }),
      db.followUp.findMany({
        where: { status: "PENDING" },
        include: {
          customer: { select: { id: true, firstName: true, lastName: true, customerCode: true, city: true } },
        },
        orderBy: { dueDate: "asc" },
        take: 5,
      }),
      db.customerProfile.groupBy({
        by: ["journeyStage"],
        where: { isArchived: false },
        _count: { id: true },
      }),
      db.activityLog.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { id: true, firstName: true, lastName: true, city: true } },
          user: { select: { name: true } },
        },
      }),
      db.matchRecommendation.findMany({
        where: { compatibilityScore: { gte: 70 } },
        orderBy: { compatibilityScore: "desc" },
        take: 5,
        include: {
          candidate: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              city: true,
              designation: true,
              industry: true,
              highestEducation: true,
            },
          },
          customer: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
    ]);

    return {
      metrics: {
        totalAssigned,
        verifiedCount,
        activeSeeking,
        pendingInteractions,
        acceptedInteractions,
        followUpsDue,
      },
      recentCustomers,
      recentFollowUps,
      recentActivities,
      topRecommendations,
      journeyDistribution: journeyDistribution.map((d) => ({
        stage: d.journeyStage,
        count: d._count.id,
      })),
    };
  }
}
