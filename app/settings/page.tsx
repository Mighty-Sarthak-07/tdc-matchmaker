import React from "react";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Sliders,
  ShieldCheck,
  Cpu,
  Database,
  Lock,
  CheckCircle2,
  Info,
} from "lucide-react";
import {
  DEFAULT_MATCHING_WEIGHTS,
  COMPATIBILITY_THRESHOLDS,
  ALGORITHM_VERSION,
} from "@/lib/matching/config";

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const hasOpenAiKey = !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== "";

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 text-[#242522]">
      {/* Header */}
      <div className="pb-4 border-b border-[#E6E3DC]">
        <div className="text-xs uppercase tracking-wider text-[#777970] font-semibold">
          Platform Configuration
        </div>
        <h1 className="text-xl font-semibold text-[#242522] tracking-tight mt-0.5">
          Matchmaking Engine & System Settings
        </h1>
        <p className="text-xs text-[#777970] mt-0.5">
          Review mathematical algorithm weights, gender demo configurations, and active service integrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Algorithm Weights */}
        <div className="p-5 bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E6E3DC]">
            <Sliders className="w-4 h-4 text-[#315747]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#777970]">
              Phase B: Configured Algorithm Weights
            </h2>
          </div>

          <p className="text-xs text-[#555750]">
            The deterministic engine normalizes scores across 6 dimensions. Weights strictly sum to 100%.
          </p>

          <div className="divide-y divide-[#EFECE6] text-xs">
            <div className="py-2 flex items-center justify-between">
              <span className="font-medium text-[#242522]">Mutual Partner-Preference Fit</span>
              <span className="font-mono font-semibold text-[#315747]">
                {(DEFAULT_MATCHING_WEIGHTS.mutualPreference * 100).toFixed(0)}%
              </span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="font-medium text-[#242522]">Family Plans & Relationship Values</span>
              <span className="font-mono font-semibold text-[#315747]">
                {(DEFAULT_MATCHING_WEIGHTS.familyValues * 100).toFixed(0)}%
              </span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="font-medium text-[#242522]">Career & Education Compatibility</span>
              <span className="font-mono font-semibold text-[#315747]">
                {(DEFAULT_MATCHING_WEIGHTS.careerEducation * 100).toFixed(0)}%
              </span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="font-medium text-[#242522]">Location & Relocation Openness</span>
              <span className="font-mono font-semibold text-[#315747]">
                {(DEFAULT_MATCHING_WEIGHTS.locationRelocation * 100).toFixed(0)}%
              </span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="font-medium text-[#242522]">Lifestyle, Diet & Interests</span>
              <span className="font-mono font-semibold text-[#315747]">
                {(DEFAULT_MATCHING_WEIGHTS.lifestyleInterests * 100).toFixed(0)}%
              </span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="font-medium text-[#242522]">Age & Height Preferences</span>
              <span className="font-mono font-semibold text-[#315747]">
                {(DEFAULT_MATCHING_WEIGHTS.ageHeight * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-[#777970] flex items-center justify-between border-t border-[#E6E3DC]">
            <span>Active Algorithm Engine:</span>
            <span className="font-mono font-semibold text-[#242522]">{ALGORITHM_VERSION}</span>
          </div>
        </div>

        {/* Card 2: Recommendation Tiers & Gender Behavior */}
        <div className="p-5 bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E6E3DC]">
            <ShieldCheck className="w-4 h-4 text-[#315747]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#777970]">
              Tiers & Assignment Demo Presets
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-semibold text-[#242522]">Score Thresholds</div>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2 bg-[#EBF2EE] border border-[#D4E3DB] rounded text-[#244838]">
                <div className="font-bold">≥ {COMPATIBILITY_THRESHOLDS.HIGH_POTENTIAL}%</div>
                <div className="mt-0.5">High Potential</div>
              </div>
              <div className="p-2 bg-[#FEF7EC] border border-[#F2E4CB] rounded text-[#785412]">
                <div className="font-bold">≥ {COMPATIBILITY_THRESHOLDS.GOOD_POTENTIAL}%</div>
                <div className="mt-0.5">Good Potential</div>
              </div>
              <div className="p-2 bg-[#FDF2EE] border border-[#F5DDD5] rounded text-[#9A4630]">
                <div className="font-bold">&lt; {COMPATIBILITY_THRESHOLDS.GOOD_POTENTIAL}%</div>
                <div className="mt-0.5">Needs Review</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E6E3DC] space-y-2 text-xs">
            <div className="font-semibold text-[#242522]">Phase C: Assignment Gender Demo Presets</div>
            <p className="text-[11px] text-[#555750] leading-relaxed">
              Configurable demo presets demonstrate assignment-requested weighting sensitivity (e.g. height proportionality and age windows for male profiles; career and educational synergy for female profiles). Individual explicit partner preferences always take precedence.
            </p>
          </div>
        </div>

        {/* Card 3: AI Service Integration */}
        <div className="p-5 bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E6E3DC]">
            <Cpu className="w-4 h-4 text-[#315747]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#777970]">
              AI Integration Status
            </h2>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#555750]">OpenAI Model:</span>
            <span className="font-mono font-medium text-[#242522]">gpt-4o-mini (JSON Mode)</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-[#555750]">API Key Configured:</span>
            <span
              className={`font-semibold ${
                hasOpenAiKey ? "text-[#315747]" : "text-[#785412]"
              }`}
            >
              {hasOpenAiKey ? "Active (Connected)" : "Omitted / Deterministic Fallback Mode"}
            </span>
          </div>

          <div className="p-2.5 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-[11px] text-[#777970] leading-relaxed">
            <Info className="w-3.5 h-3.5 text-[#315747] inline mr-1" />
            When the API key is not configured or an endpoint times out, the system automatically runs the deterministic explanation and introduction generation fallback without interruption.
          </div>
        </div>

        {/* Card 4: Database & Security */}
        <div className="p-5 bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E6E3DC]">
            <Database className="w-4 h-4 text-[#315747]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#777970]">
              Database & Demo Credentials
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#555750]">ORM Provider:</span>
              <span className="font-medium text-[#242522]">Prisma Client (v6)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#555750]">Local Database:</span>
              <span className="font-mono text-[#242522]">SQLite (dev.db)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#555750]">Production Schema:</span>
              <span className="font-mono text-[#242522]">PostgreSQL (schema.postgresql.prisma)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E6E3DC] text-[11px] text-[#555750]">
            <span className="font-semibold text-[#242522]">Demo Matchmaker Account:</span>
            <div className="font-mono text-[10px] text-[#777970] mt-0.5">
              Email: matchmaker@tdc.com | Password: password123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
