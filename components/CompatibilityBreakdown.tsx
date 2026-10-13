import React from "react";
import { ComponentScores, CompatibilityTier } from "@/lib/matching/types";
import { StatusBadge } from "./StatusBadge";
import { CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";

interface CompatibilityBreakdownProps {
  score: number;
  tier: CompatibilityTier;
  scores: ComponentScores;
  customerScoreAtoB?: number;
  candidateScoreBtoA?: number;
  positiveFactors?: string[];
  concerns?: string[];
  missingInfo?: string[];
  appliedPresets?: string[];
  compact?: boolean;
}

export function CompatibilityBreakdown({
  score,
  tier,
  scores,
  customerScoreAtoB,
  candidateScoreBtoA,
  positiveFactors = [],
  concerns = [],
  missingInfo = [],
  appliedPresets = [],
  compact = false,
}: CompatibilityBreakdownProps) {
  const components = [
    { label: "Mutual Partner Preferences", weight: "30%", score: scores.mutualPreference },
    { label: "Family Plans & Relationship Values", weight: "25%", score: scores.familyValues },
    { label: "Career & Education Alignment", weight: "15%", score: scores.careerEducation },
    { label: "Location & Relocation Proximity", weight: "10%", score: scores.locationRelocation },
    { label: "Lifestyle, Diet & Leisure", weight: "10%", score: scores.lifestyleInterests },
    { label: "Age & Height Tolerance", weight: "10%", score: scores.ageHeight },
  ];

  return (
    <div className="space-y-4 text-[#242522]">
      {/* Top Header Summary */}
      <div className="flex items-center justify-between p-3.5 bg-[#FAF9F6] border border-[#E6E3DC] rounded">
        <div>
          <div className="text-xs text-[#777970] font-medium uppercase tracking-wider">
            Overall Compatibility
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-semibold tracking-tight text-[#242522]">
              {score}%
            </span>
            <StatusBadge status={tier} />
          </div>
        </div>

        {customerScoreAtoB != null && candidateScoreBtoA != null && (
          <div className="text-right text-xs text-[#777970] border-l border-[#E6E3DC] pl-3.5">
            <div className="font-medium text-[#242522]">Reciprocal Balance</div>
            <div className="mt-0.5">
              Client Fit: <span className="font-semibold text-[#315747]">{customerScoreAtoB}%</span>
            </div>
            <div>
              Candidate Fit: <span className="font-semibold text-[#315747]">{candidateScoreBtoA}%</span>
            </div>
          </div>
        )}
      </div>

      {/* 6 Component Breakdown Bars */}
      <div className="space-y-2.5">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#777970]">
          Component Score Analysis
        </div>
        <div className="grid grid-cols-1 gap-2">
          {components.map((item) => (
            <div key={item.label} className="text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#3A3C36] font-medium">
                  {item.label} <span className="text-[#888A82]">({item.weight})</span>
                </span>
                <span className="font-semibold text-[#242522]">{item.score}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#ECEAE4] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#315747] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, item.score))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {!compact && (
        <>
          {/* Key Shared Strengths */}
          {positiveFactors.length > 0 && (
            <div className="pt-2 border-t border-[#E6E3DC]">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#315747] mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Key Compatibility Drivers
              </div>
              <ul className="space-y-1">
                {positiveFactors.map((factor, idx) => (
                  <li key={idx} className="text-xs text-[#3A3C36] flex items-start gap-1.5">
                    <span className="text-[#315747] mt-0.5">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Potential Concerns */}
          {concerns.length > 0 && concerns[0] !== "No significant structural dealbreakers or value conflicts identified." && (
            <div className="pt-2 border-t border-[#E6E3DC]">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#B76E57] mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Operational Considerations
              </div>
              <ul className="space-y-1">
                {concerns.map((concern, idx) => (
                  <li key={idx} className="text-xs text-[#555750] flex items-start gap-1.5">
                    <span className="text-[#B76E57] mt-0.5">•</span>
                    <span>{concern}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Info */}
          {missingInfo.length > 0 && (
            <div className="pt-2 border-t border-[#E6E3DC]">
              <div className="text-xs font-medium text-[#777970] mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Information Pending Verification
              </div>
              <div className="flex flex-wrap gap-1">
                {missingInfo.map((info, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-[#F2F1ED] text-[#555750] px-2 py-0.5 rounded border border-[#E2DFD7]"
                  >
                    {info}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Applied Demo Presets */}
          {appliedPresets.length > 0 && (
            <div className="text-[11px] text-[#777970] bg-[#FAF9F6] p-2 rounded border border-[#E6E3DC]">
              <span className="font-semibold text-[#3A3C36]">Applied Algorithm Presets: </span>
              {appliedPresets.join(", ")}
            </div>
          )}
        </>
      )}
    </div>
  );
}
