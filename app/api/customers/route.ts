import { NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/lib/services/customer.service";
import { getSessionUser } from "@/lib/auth";
import { z } from "zod";

const CreateCustomerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  gender: z.enum(["MALE", "FEMALE"]),
  dateOfBirth: z.string().min(8, "Valid birth date is required"),
  heightCm: z.number().int().min(120).max(220),
  email: z.string().email(),
  phone: z.string().min(8),
  city: z.string().min(2),
  state: z.string().min(2),
  maritalStatus: z.string(),
  highestEducation: z.string(),
  currentCompany: z.string().optional().nullable(),
  designation: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  annualIncome: z.number().optional().nullable(),
  religion: z.string(),
  motherTongue: z.string(),
  wantChildren: z.string(),
  openToRelocate: z.string(),
  openToPets: z.string(),
  diet: z.string(),
});

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || undefined;
  const gender = searchParams.get("gender") || undefined;
  const city = searchParams.get("city") || undefined;
  const maritalStatus = searchParams.get("maritalStatus") || undefined;
  const journeyStage = searchParams.get("journeyStage") || undefined;
  const isVerifiedParam = searchParams.get("isVerified");
  const isVerified = isVerifiedParam === "true" ? true : isVerifiedParam === "false" ? false : undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "15", 10);
  const sortBy = (searchParams.get("sortBy") as any) || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") as any) || "desc";

  try {
    const data = await CustomerService.getCustomers({
      search,
      gender,
      city,
      maritalStatus,
      isVerified,
      journeyStage,
      page,
      pageSize,
      sortBy,
      sortOrder,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Customers query error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = CreateCustomerSchema.parse(body);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `TDC-${validated.gender === "MALE" ? "M" : "F"}${randomSuffix}`;

    const customer = await CustomerService.updateCustomer(code, {
      ...validated,
      dateOfBirth: new Date(validated.dateOfBirth),
      customerCode: code,
      assignedMatchmakerId: user.userId,
      isVerified: false,
      journeyStage: "NEW_LEAD",
      profileCompleteness: 80,
    });

    return NextResponse.json({ success: true, customer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create customer" }, { status: 400 });
  }
}
