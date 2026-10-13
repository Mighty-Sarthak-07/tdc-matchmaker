"use client";

import React, { useState, useEffect } from "react";
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
  const [subject, setSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const candAge = calculateAge(candidate.dateOfBirth);
  const custAge = calculateAge(customer.dateOfBirth);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMsg(null);
      // Pre-fill default subject and message
      setSubject(`Curated Match Introduction: ${candidate.firstName} (${candAge}, ${candidate.city})`);
      setMessageBody(
        `Dear ${customer.firstName},\n\n` +
        `I am pleased to share an executive match profile for your consideration: ${candidate.firstName}, ${candAge} years old (${formatHeight(candidate.heightCm)}), based in ${candidate.city}.\n\n` +
        `${candidate.firstName} is currently working as ${candidate.designation || candidate.industry || "a professional"} and shares your relationship vision:\n` +
        `• ${compatibility.topPositiveFactors[0] || "Aligned lifestyle preferences"}\n` +
        `• ${compatibility.topPositiveFactors[1] || "Compatible education and career orientation"}\n\n` +
        `Our deterministic compatibility score is evaluated at ${compatibility.compatibilityScore}% (${compatibility.tier.replace("_", " ")}).\n\n` +
        `Please review this profile and let me know your thoughts so we can coordinate introductions.\n\n` +
        `Warm regards,\n` +
        `Your TDC Matchmaker`
      );
    }
  }, [isOpen, candidate, customer, compatibility, candAge]);

  if (!isOpen) return null;

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
          compatibilityScore: compatibility.compatibilityScore,
          tier: compatibility.tier,
          scoreBreakdown: compatibility.componentScores,
          explanationText: compatibility.shortExplanation,
          sharedPreferences: compatibility.topPositiveFactors,
          potentialConflicts: compatibility.potentialConcerns,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-[#FFFFFF] border border-[#E6E3DC] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-[#242522]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E6E3DC] flex items-center justify-between bg-[#FAF9F6]">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#777970] font-semibold">
              Action Confirmation
            </div>
            <h2 className="text-base font-semibold text-[#242522]">
              Send Match Introduction Presentation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#777970] hover:text-[#242522] rounded hover:bg-[#EFECE6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Profiles Comparison Card */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-xs">
            <div>
              <div className="text-[11px] text-[#777970] font-semibold uppercase">Client</div>
              <div className="font-semibold text-sm text-[#242522] mt-0.5">
                {customer.firstName} {customer.lastName}
              </div>
              <div className="text-[#555750]">
                {custAge} yrs • {customer.city} • {customer.highestEducation}
              </div>
            </div>
            <div className="border-l border-[#E6E3DC] pl-3">
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
          <div className="p-3 bg-[#EBF2EE] border border-[#D4E3DB] rounded text-xs text-[#244838]">
            <span className="font-semibold">Compatibility: {compatibility.compatibilityScore}% ({compatibility.tier.replace("_", " ")})</span> — {compatibility.shortExplanation}
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
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#315747] bg-[#EBF2EE] border border-[#D4E3DB] rounded hover:bg-[#DCEAE3] transition-colors disabled:opacity-50"
            >
              {loadingAI ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Regenerate with AI</span>
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
                className="w-full px-3 py-1.5 text-xs bg-[#FFFFFF] border border-[#E6E3DC] rounded focus:border-[#315747] focus:ring-1 focus:ring-[#315747]"
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
                className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#E6E3DC] rounded focus:border-[#315747] focus:ring-1 focus:ring-[#315747] font-mono leading-relaxed"
              />
            </div>
          </div>

          {/* Operational Simulation Notice */}
          <div className="text-[11px] text-[#777970] italic">
            * Note: For this MVP demonstration, sending simulates email transmission and writes persistent records to Sent Matches and Activity Logs. Real third-party emails are not dispatched.
          </div>

          {/* Feedback states */}
          {error && (
            <div className="p-3 bg-[#FDF2EE] border border-[#F5DDD5] rounded text-xs text-[#9A4630] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-[#EBF2EE] border border-[#D4E3DB] rounded text-xs text-[#244838] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#E6E3DC] bg-[#FAF9F6] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-1.5 text-xs font-medium text-[#555750] bg-white border border-[#E6E3DC] rounded hover:bg-[#F8F7F4] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-[#315747] hover:bg-[#254437] rounded transition-colors disabled:opacity-50"
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
}
