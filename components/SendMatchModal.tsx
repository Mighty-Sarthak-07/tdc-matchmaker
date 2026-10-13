"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CustomerData, RecommendationExplanation } from "@/lib/matching/types";
import { X, Send, Sparkles, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { calculateAge, formatHeight } from "@/lib/utils";

interface SendMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerData;
  candidate: CustomerData;
  compatibility: RecommendationExplanation;
  onSuccess: () => void;
}

export function SendMatchModal({
  isOpen,
  onClose,
  customer,
  candidate,
  compatibility,
  onSuccess,
}: SendMatchModalProps) {
  const [mounted, setMounted] = useState(false);
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const candAge = calculateAge(candidate?.dateOfBirth);
  const custAge = calculateAge(customer?.dateOfBirth);

  useEffect(() => {
    if (isOpen && candidate && customer) {
      setError(null);
      setSuccessMsg(null);
      
      const positiveA = compatibility?.topPositiveFactors?.[0] || "Aligned lifestyle preferences";
      const positiveB = compatibility?.topPositiveFactors?.[1] || "Compatible education and career orientation";
      const score = compatibility?.compatibilityScore ?? 85;
      const tierLabel = (compatibility?.tier || "GOOD_POTENTIAL").replace(/_/g, " ");

      // Pre-fill default subject and message
      setSubject(`Curated Match Introduction: ${candidate.firstName} (${candAge}, ${candidate.city})`);
      setMessageBody(
        `Dear ${customer.firstName},\n\n` +
        `I am pleased to share an executive match profile for your consideration: ${candidate.firstName}, ${candAge} years old (${formatHeight(candidate.heightCm)}), based in ${candidate.city}.\n\n` +
        `${candidate.firstName} is currently working as ${candidate.designation || candidate.industry || "a professional"} and shares your relationship vision:\n` +
        `• ${positiveA}\n` +
        `• ${positiveB}\n\n` +
        `Our deterministic compatibility score is evaluated at ${score}% (${tierLabel}).\n\n` +
        `Please review this profile and let me know your thoughts so we can coordinate introductions.\n\n` +
        `Warm regards,\n` +
        `Your TDC Matchmaker`
      );
    }
  }, [isOpen, candidate, customer, compatibility, candAge]);

  if (!isOpen || !mounted || !customer || !candidate) return null;

  const handleGenerateAI = async () => {
    try {
      setLoadingAI(true);
      setError(null);
      const res = await fetch("/api/recommendations/ai-intro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          candidate,
          compatibility,
        }),
      });

      const data = await res.json();
      if (data.subject && data.messageBody) {
        setSubject(data.subject);
        setMessageBody(data.messageBody);
      }
    } catch (e: any) {
      setError("AI service unavailable; retained standard verified draft.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !messageBody.trim()) {
      setError("Subject and message body cannot be empty.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch("/api/matches/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerAId: customer.id,
          customerBId: candidate.id,
          subject,
          messageBody,
          compatibilityScore: compatibility?.compatibilityScore ?? 85,
          tier: compatibility?.tier ?? "GOOD_POTENTIAL",
          scoreBreakdown: compatibility?.componentScores ?? {},
          explanationText: compatibility?.shortExplanation ?? "High compatibility profile.",
          sharedPreferences: compatibility?.topPositiveFactors ?? [],
          potentialConflicts: compatibility?.potentialConcerns ?? [],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send match presentation.");
      }

      setSuccessMsg("Match presentation recorded! Dispatched via simulated email.");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const scoreDisplay = compatibility?.compatibilityScore ?? 85;
  const tierDisplay = (compatibility?.tier || "GOOD_POTENTIAL").replace(/_/g, " ");

  const modalElement = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#FFFFFF] border border-[#E6E3DC] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-[#242522] animate-modal-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E6E3DC] flex items-center justify-between bg-[#FAF9F6] shrink-0">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#777970] font-semibold">
              Action Confirmation
            </div>
            <h2 className="text-base font-semibold text-[#242522]">
              Send Match Introduction Presentation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777970] hover:text-[#242522] rounded-lg hover:bg-[#EFECE6] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Profiles Comparison Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#FAF9F6] border border-[#E6E3DC] rounded-lg text-xs">
            <div>
              <div className="text-[11px] text-[#777970] font-semibold uppercase">Client</div>
              <div className="font-semibold text-sm text-[#242522] mt-0.5">
                {customer.firstName} {customer.lastName}
              </div>
              <div className="text-[#555750]">
                {custAge} yrs • {customer.city} • {customer.highestEducation}
              </div>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-[#E6E3DC] pt-2 sm:pt-0 sm:pl-3">
              <div className="text-[11px] text-[#777970] font-semibold uppercase">Candidate</div>
              <div className="font-semibold text-sm text-[#242522] mt-0.5">
                {candidate.firstName} {candidate.lastName}
              </div>
              <div className="text-[#555750]">
                {candAge} yrs • {candidate.city} • {candidate.highestEducation}
              </div>
            </div>
          </div>

          {/* Compatibility Highlight */}
          <div className="p-3 bg-[#EBF2EE] border border-[#D4E3DB] rounded-lg text-xs text-[#244838]">
            <span className="font-semibold">Compatibility: {scoreDisplay}% ({tierDisplay})</span>
            {compatibility?.shortExplanation ? ` — ${compatibility.shortExplanation}` : ""}
          </div>

          {/* AI Drafting Toolbar */}
          <div className="flex items-center justify-between pt-1">
            <label className="text-xs font-semibold text-[#3A3C36] uppercase tracking-wider">
              Introductory Message
            </label>
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={loadingAI || submitting}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[#315747] bg-[#EBF2EE] border border-[#D4E3DB] rounded-md hover:bg-[#DCEAE3] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loadingAI ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-[#315747]" />
              )}
              <span>Regenerate with Gemini AI</span>
            </button>
          </div>

          {/* Message Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-[#777970] mb-1">
                Email Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#E6E3DC] rounded-md focus:border-[#315747] focus:ring-1 focus:ring-[#315747] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#777970] mb-1">
                Personalized Presentation Letter
              </label>
              <textarea
                rows={6}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-[#FFFFFF] border border-[#E6E3DC] rounded-md focus:border-[#315747] focus:ring-1 focus:ring-[#315747] font-mono leading-relaxed outline-none"
              />
            </div>
          </div>

          {/* Operational Simulation Notice */}
          <div className="text-[11px] text-[#777970] italic">
            * Note: For this MVP demonstration, sending simulates email transmission and writes persistent records to Sent Matches and Activity Logs.
          </div>

          {/* Feedback states */}
          {error && (
            <div className="p-3 bg-[#FDF2EE] border border-[#F5DDD5] rounded-lg text-xs text-[#9A4630] flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-[#EBF2EE] border border-[#D4E3DB] rounded-lg text-xs text-[#244838] flex items-center gap-2 animate-fade-in">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#E6E3DC] bg-[#FAF9F6] flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-xs font-medium text-[#555750] bg-white border border-[#E6E3DC] rounded-md hover:bg-[#F8F7F4] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#315747] hover:bg-[#254437] rounded-md transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Confirm & Dispatch Match</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalElement, document.body);
}
