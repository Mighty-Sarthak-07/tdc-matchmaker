import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, className, size = "sm" }: StatusBadgeProps) {
  const normalized = status.toUpperCase().replace(/\s+/g, "_");

  // Subtle, restrained editorial color classes with high contrast
  let colorStyles = "bg-[#F2F1ED] text-[#4F5149] border-[#E2DFD7]";

  if (
    normalized === "VERIFIED" ||
    normalized === "HIGH_POTENTIAL" ||
    normalized === "COMPLETED" ||
    normalized === "SUCCESSFULLY_MATCHED" ||
    normalized === "INTERESTED"
  ) {
    colorStyles = "bg-[#EBF2EE] text-[#244838] border-[#D4E3DB]";
  } else if (
    normalized === "ACTIVE_MATCHMAKING" ||
    normalized === "GOOD_POTENTIAL" ||
    normalized === "SENT" ||
    normalized === "MEETING_SCHEDULED" ||
    normalized === "HIGH"
  ) {
    colorStyles = "bg-[#FEF7EC] text-[#785412] border-[#F2E4CB]";
  } else if (
    normalized === "MATCH_SUGGESTED" ||
    normalized === "NEW_LEAD" ||
    normalized === "SUGGESTED" ||
    normalized === "APPROVED" ||
    normalized === "MEDIUM"
  ) {
    colorStyles = "bg-[#F5F2EB] text-[#5A5043] border-[#E8DFD3]";
  } else if (
    normalized === "FOLLOW_UP_REQUIRED" ||
    normalized === "NEEDS_REVIEW" ||
    normalized === "URGENT" ||
    normalized === "DECLINED" ||
    normalized === "REJECTED"
  ) {
    colorStyles = "bg-[#FDF2EE] text-[#9A4630] border-[#F5DDD5]";
  } else if (
    normalized === "ON_HOLD" ||
    normalized === "PROFILE_INCOMPLETE" ||
    normalized === "VERIFICATION_PENDING" ||
    normalized === "CANCELLED" ||
    normalized === "DISMISSED"
  ) {
    colorStyles = "bg-[#EFEFEF] text-[#636363] border-[#DDDDDD]";
  }

  // Format label text cleanly
  const label = status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border rounded",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        colorStyles,
        className
      )}
    >
      {label}
    </span>
  );
}
