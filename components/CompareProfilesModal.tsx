"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CustomerData, RecommendationExplanation } from "@/lib/matching/types";
import { X, Check, Minus, Sparkles, Loader2, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { calculateAge, formatHeight, formatCurrencyLakhs } from "@/lib/utils";
import { CompatibilityBreakdown } from "./CompatibilityBreakdown";
import { StatusBadge } from "./StatusBadge";

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
  const [mounted, setMounted] = useState(false);
  const [reasoning, setReasoning] = useState<any | null>(null);
  const [loadingReasoning, setLoadingReasoning] = useState(false);
  const [reasoningError, setReasoningError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || !customer || !candidate) return null;

  const handleRunAIReasoning = async () => {
    try {
      setLoadingReasoning(true);
      setReasoningError(null);
      const res = await fetch("/api/recommendations/ai-reasoning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          candidate,
          compatibility,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to evaluate profile fit");
      setReasoning(data);
    } catch (err: any) {
      setReasoningError(err.message || "Failed to run AI reasoning");
    } finally {
      setLoadingReasoning(false);
    }
  };

  const custAge = calculateAge(customer.dateOfBirth);
  const candAge = calculateAge(candidate.dateOfBirth);

  const rows = [
    {
      category: "Personal Biodata",
      items: [
        { label: "Age", valA: `${custAge} years`, valB: `${candAge} years` },
        { label: "Height", valA: formatHeight(customer.heightCm), valB: formatHeight(candidate.heightCm) },
        { label: "Location", valA: `${customer.city}, ${customer.state}`, valB: `${candidate.city}, ${candidate.state}` },
        { label: "Marital Status", valA: (customer.maritalStatus || "").replace(/_/g, " "), valB: (candidate.maritalStatus || "").replace(/_/g, " ") },
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
        { label: "Diet Preference", valA: (customer.diet || "").replace(/_/g, " "), valB: (candidate.diet || "").replace(/_/g, " ") },
      ],
    },
  ];

  const modalElement = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFFFF] border border-[#E6E3DC] rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-[#242522] animate-modal-scale" onClick={(e) => e.stopPropagation()}>
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

          {/* AI Fit Reasoning Section (Gemini / LLM) */}
          <div className="pt-5 border-t border-[#E6E3DC] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#242522]">
                  <Sparkles className="w-4 h-4 text-[#B76E57]" />
                  <span>LLM Natural Language Fit Reasoning</span>
                </div>
                <p className="text-[11px] text-[#777970] mt-0.5">
                  Deep multi-attribute qualitative evaluation powered by Google Gemini with deterministic rules.
                </p>
              </div>

              {!reasoning && (
                <button
                  type="button"
                  onClick={handleRunAIReasoning}
                  disabled={loadingReasoning}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#315747] hover:bg-[#254437] rounded transition-colors shadow-xs btn-press cursor-pointer disabled:opacity-50"
                >
                  {loadingReasoning ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-[#EAE5DC]" />
                  )}
                  <span>{loadingReasoning ? "Evaluating with Gemini..." : "Run AI Deep Fit Reasoning"}</span>
                </button>
              )}
            </div>

            {reasoningError && (
              <div className="p-3 bg-[#FDF2EE] border border-[#F5DDD5] rounded text-xs text-[#9A4630] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{reasoningError}</span>
              </div>
            )}

            {reasoning && (
              <div className="p-4 bg-[#FAF9F6] border border-[#E6E3DC] rounded-lg space-y-3.5 animate-fade-in text-xs">
                {/* Header row with provider & score */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E5DE]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#242522]">
                      AI Suitability: {reasoning.qualitativeScore}%
                    </span>
                    <StatusBadge status={reasoning.tier} size="sm" />
                  </div>

                  <span className="text-[10px] font-mono text-[#777970] px-2 py-0.5 rounded bg-white border border-[#E0DCD3]">
                    Engine: {reasoning.provider === "gemini" ? "Google Gemini 1.5 Flash" : reasoning.provider === "openai" ? "OpenAI gpt-4o-mini" : "Deterministic Fallback Engine"}
                  </span>
                </div>

                {/* Synthesis */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#777970] mb-1">
                    Executive Match Summary
                  </div>
                  <p className="text-[#3A3C36] leading-relaxed">
                    {reasoning.reasoningSummary}
                  </p>
                </div>

                {/* 2-column breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white border border-[#EAE7DF] rounded space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#315747]">
                      Cultural & Family Synergy
                    </div>
                    <p className="text-[11px] text-[#555750] leading-relaxed">
                      {reasoning.culturalAndFamilySynergy}
                    </p>
                  </div>

                  <div className="p-3 bg-white border border-[#EAE7DF] rounded space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#315747]">
                      Career & Lifestyle Alignment
                    </div>
                    <p className="text-[11px] text-[#555750] leading-relaxed">
                      {reasoning.careerAndLifestyleAlignment}
                    </p>
                  </div>
                </div>

                {/* Friction Points */}
                {reasoning.potentialFrictionPoints?.length > 0 && (
                  <div className="p-3 bg-[#FEFBF6] border border-[#F4E9D8] rounded space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#A06010]">
                      Potential Friction Points & Dealbreaker Watch
                    </div>
                    <ul className="text-[11px] text-[#7A5515] list-disc list-inside space-y-0.5">
                      {reasoning.potentialFrictionPoints.map((pt: string, idx: number) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Matchmaker Advice */}
                <div className="p-3 bg-[#EBF2EE] border border-[#D4E3DB] rounded space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#244838]">
                    Matchmaker Consultation Guidance
                  </div>
                  <p className="text-[11px] text-[#244838] leading-relaxed">
                    {reasoning.matchmakerAdvice}
                  </p>
                </div>

                <div className="text-right pt-1">
                  <button
                    type="button"
                    onClick={handleRunAIReasoning}
                    disabled={loadingReasoning}
                    className="text-[11px] text-[#315747] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Re-evaluate Analysis</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E6E3DC] bg-[#FAF9F6] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-[#242522] bg-white border border-[#E6E3DC] rounded hover:bg-[#F8F7F4] cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalElement, document.body);
}
