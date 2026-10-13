"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CustomerData, RecommendationExplanation } from "@/lib/matching/types";
import { OptimalProfilePickerResult } from "@/lib/services/ai.service";
import {
  X,
  Sparkles,
  Send,
  Scale,
  CheckCircle2,
  Award,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { formatHeight } from "@/lib/utils";

interface AIOptimalPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: OptimalProfilePickerResult;
  candidate: CustomerData;
  compatibility: RecommendationExplanation;
  onSendPresentation: (cand: CustomerData, comp: RecommendationExplanation) => void;
  onCompare: (cand: CustomerData, comp: RecommendationExplanation) => void;
}

export function AIOptimalPickerModal({
  isOpen,
  onClose,
  result,
  candidate,
  compatibility,
  onSendPresentation,
  onCompare,
}: AIOptimalPickerModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || !candidate || !result) return null;

  const modalElement = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white border border-[#E6E3DC] rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-[#242522] animate-modal-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E6E3DC] flex items-center justify-between bg-gradient-to-r from-[#FAF8F5] via-[#FAF9F6] to-[#F2EFE8] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E5DFD4] text-[#B76E57] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#B76E57]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-[#777970] font-semibold">
                  Gemini Decision Engine
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF2ED] text-[#244838] border border-[#D0E2D6]">
                  {result.provider === "gemini" ? "Gemini 3.0 Flash" : "Deterministic Engine"}
                </span>
              </div>
              <h2 className="text-base font-semibold text-[#242522]">
                Optimal Profile Recommendation
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777970] hover:text-[#242522] rounded-lg hover:bg-[#EFECE6] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Chosen Candidate Spotlight Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#FAF8F4] to-[#F3EFE7] border border-[#E0DBD0] shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E6E0D4]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#28493B] text-white font-serif font-bold text-base flex items-center justify-center shrink-0 shadow-2xs">
                  {candidate.firstName[0]}
                  {candidate.lastName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-[#242522]">
                      {candidate.firstName} {candidate.lastName}
                    </span>
                    <span className="font-mono text-[11px] text-[#777970]">
                      ({candidate.customerCode})
                    </span>
                    {candidate.isVerified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-[#315747] font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                  <div className="text-[#555750] text-xs mt-0.5">
                    {candidate.city}, {candidate.state} &bull; {formatHeight(candidate.heightCm)} &bull; {candidate.designation || candidate.industry}
                  </div>
                </div>
              </div>

              {/* Confidence Metric */}
              <div className="text-right sm:shrink-0">
                <div className="text-[10px] uppercase font-semibold text-[#777970] tracking-wider">
                  Match Compatibility
                </div>
                <div className="text-2xl font-bold text-[#242522] leading-tight">
                  {compatibility.compatibilityScore}%
                </div>
                <div className="text-[10px] text-[#315747] font-medium">
                  {result.selectionConfidence}% AI Confidence
                </div>
              </div>
            </div>

            {/* Verdict Headline */}
            <div className="pt-0.5">
              <div className="text-sm font-semibold text-[#22241F] leading-snug">
                {result.headline}
              </div>
              <p className="text-[#4A4C44] mt-1.5 leading-relaxed text-xs">
                {result.selectionRationale}
              </p>
            </div>
          </div>

          {/* Core Synergy Pillars */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-[#777970] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#315747]" />
              <span>Key Alignment Pillars</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {result.synergyPillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#FFFFFF] border border-[#E6E3DC] rounded-lg flex items-start gap-2 shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#315747] shrink-0 mt-0.5" />
                  <span className="text-[#3A3C36] leading-relaxed">{pillar}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparative Edge Callout */}
          <div className="p-3.5 bg-[#FAF9F5] border border-[#EAE6DD] rounded-lg space-y-1">
            <div className="text-[11px] font-semibold text-[#B76E57] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#B76E57]" />
              <span>Competitive Advantage Over Other Matches</span>
            </div>
            <p className="text-[#4A4C44] leading-relaxed">
              {result.comparativeEdge}
            </p>
          </div>

          {/* Matchmaker Recommended Pitch */}
          <div className="p-3.5 bg-[#F6F8F6] border border-[#DFE8DF] rounded-lg space-y-1.5">
            <div className="text-[11px] font-semibold text-[#28493B] uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#28493B]" />
              <span>Suggested Matchmaker Introduction Pitch</span>
            </div>
            <p className="text-[#2F473A] italic leading-relaxed font-serif text-[13px]">
              {result.conversationPitch}
            </p>
          </div>
        </div>

        {/* Modal Footer Toolbar */}
        <div className="px-6 py-3.5 border-t border-[#E6E3DC] bg-[#FAF9F6] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-[#555750] bg-white border border-[#E6E3DC] rounded-md hover:bg-[#F8F7F4] transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onCompare(candidate, compatibility);
              }}
              className="px-3 py-2 text-xs font-medium text-[#242522] bg-white border border-[#E6E3DC] rounded-md hover:bg-[#FAF9F6] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5 text-[#777970]" />
              <span>Compare Full Profiles</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onSendPresentation(candidate, compatibility);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#28493B] hover:bg-[#1E392E] rounded-md transition-colors cursor-pointer shadow-xs btn-press"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Presentation to Client</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalElement, document.body);
}
