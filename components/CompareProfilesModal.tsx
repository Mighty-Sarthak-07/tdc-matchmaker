"use client";

import React from "react";
import { CustomerData, RecommendationExplanation } from "@/lib/matching/types";
import { X, Check, Minus } from "lucide-react";
import { calculateAge, formatHeight, formatCurrencyLakhs } from "@/lib/utils";
import { CompatibilityBreakdown } from "./CompatibilityBreakdown";

interface CompareProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerData;
  candidate: CustomerData;
  compatibility: RecommendationExplanation;
}

export function CompareProfilesModal({
  isOpen,
  onClose,
  customer,
  candidate,
  compatibility,
}: CompareProfilesModalProps) {
  if (!isOpen) return null;

  const custAge = calculateAge(customer.dateOfBirth);
  const candAge = calculateAge(candidate.dateOfBirth);

  const rows = [
    {
      category: "Personal Biodata",
      items: [
        { label: "Age", valA: `${custAge} years`, valB: `${candAge} years` },
        { label: "Height", valA: formatHeight(customer.heightCm), valB: formatHeight(candidate.heightCm) },
        { label: "Location", valA: `${customer.city}, ${customer.state}`, valB: `${candidate.city}, ${candidate.state}` },
        { label: "Marital Status", valA: customer.maritalStatus.replace("_", " "), valB: candidate.maritalStatus.replace("_", " ") },
      ],
    },
    {
      category: "Career & Education",
      items: [
        { label: "Highest Education", valA: customer.highestEducation, valB: candidate.highestEducation },
        { label: "Degree / College", valA: customer.degree || customer.undergraduateCollege || "Not specified", valB: candidate.degree || candidate.undergraduateCollege || "Not specified" },
        { label: "Profession", valA: customer.designation || customer.industry || "Professional", valB: candidate.designation || candidate.industry || "Professional" },
        { label: "Annual Income", valA: formatCurrencyLakhs(customer.annualIncome), valB: formatCurrencyLakhs(candidate.annualIncome) },
      ],
    },
    {
      category: "Family & Cultural Background",
      items: [
        { label: "Religion & Community", valA: customer.religion, valB: candidate.religion },
        { label: "Mother Tongue", valA: customer.motherTongue, valB: candidate.motherTongue },
        { label: "Family Values", valA: customer.familyValues || "Not disclosed", valB: candidate.familyValues || "Not disclosed" },
        { label: "Family Structure", valA: customer.familyType || "Nuclear", valB: candidate.familyType || "Nuclear" },
      ],
    },
    {
      category: "Lifestyle & Goals",
      items: [
        { label: "Want Children", valA: customer.wantChildren, valB: candidate.wantChildren },
        { label: "Open to Relocate", valA: customer.openToRelocate, valB: candidate.openToRelocate },
        { label: "Open to Pets", valA: customer.openToPets, valB: candidate.openToPets },
        { label: "Diet Preference", valA: customer.diet.replace("_", " "), valB: candidate.diet.replace("_", " ") },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FFFFFF] border border-[#E6E3DC] rounded-lg shadow-xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-[#242522] animate-modal-scale">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E6E3DC] flex items-center justify-between bg-[#FAF9F6]">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#777970] font-semibold">
              Profile Comparison
            </div>
            <h2 className="text-base font-semibold text-[#242522]">
              Side-by-Side Match Analysis
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#777970] hover:text-[#242522] rounded hover:bg-[#EFECE6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          <div className="overflow-x-auto">
            <div className="min-w-[560px]">
              {/* Top Sticky Profile Headers */}
              <div className="grid grid-cols-12 gap-4 pb-3 border-b border-[#E6E3DC] text-xs font-semibold">
                <div className="col-span-3 text-[#777970] uppercase tracking-wider">Attribute</div>
                <div className="col-span-4 text-[#315747]">
                  {customer.firstName} {customer.lastName} ({customer.customerCode})
                </div>
                <div className="col-span-1 text-center text-[#888A82]">Fit</div>
                <div className="col-span-4 text-[#315747]">
                  {candidate.firstName} {candidate.lastName} ({candidate.customerCode})
                </div>
              </div>

              {/* Categorized Rows */}
              <div className="space-y-6 pt-2">
                {rows.map((sec) => (
                  <div key={sec.category} className="space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#777970] bg-[#FAF9F6] px-2 py-1 rounded">
                      {sec.category}
                    </div>
                    <div className="divide-y divide-[#F2EFE9] text-xs">
                      {sec.items.map((it) => {
                        const isIdentical =
                          String(it.valA).toLowerCase() === String(it.valB).toLowerCase();

                        return (
                          <div
                            key={it.label}
                            className="grid grid-cols-12 gap-4 py-2 hover:bg-[#FAF9F6] px-2 rounded transition-colors"
                          >
                            <div className="col-span-3 text-[#555750] font-medium">{it.label}</div>
                            <div className="col-span-4 text-[#242522]">{it.valA}</div>
                            <div className="col-span-1 flex justify-center items-center">
                              {isIdentical ? (
                                <Check className="w-3.5 h-3.5 text-[#315747]" />
                              ) : (
                                <Minus className="w-3.5 h-3.5 text-[#B76E57]" />
                              )}
                            </div>
                            <div className="col-span-4 text-[#242522]">{it.valB}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compatibility Breakdown Card */}
          <div className="pt-4 border-t border-[#E6E3DC]">
            <CompatibilityBreakdown
              score={compatibility.compatibilityScore}
              tier={compatibility.tier}
              scores={compatibility.componentScores}
              customerScoreAtoB={compatibility.customerScoreAtoB}
              candidateScoreBtoA={compatibility.candidateScoreBtoA}
              positiveFactors={compatibility.topPositiveFactors}
              concerns={compatibility.potentialConcerns}
              missingInfo={compatibility.missingInformation}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E6E3DC] bg-[#FAF9F6] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-[#242522] bg-white border border-[#E6E3DC] rounded hover:bg-[#F8F7F4]"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
