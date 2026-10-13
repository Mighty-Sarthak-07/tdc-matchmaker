import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAge(dateOfBirth: Date | string | null | undefined): number {
  if (!dateOfBirth) return 28;
  const dob = typeof dateOfBirth === "string" ? new Date(dateOfBirth) : dateOfBirth;
  if (!dob || isNaN(dob.getTime())) return 28;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return isNaN(age) || age <= 0 ? 28 : age;
}

export function formatCurrencyLakhs(amountInLakhs: number | null | undefined): string {
  if (amountInLakhs == null) return "Not disclosed";
  return `₹${amountInLakhs.toLocaleString("en-IN")} LPA`;
}

export function formatHeight(heightCm: number | null | undefined): string {
  if (!heightCm) return "Unknown";
  const totalInches = Math.round(heightCm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${inches}" (${heightCm} cm)`;
}
