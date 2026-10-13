"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Users,
  Filter,
  Eye,
  SlidersHorizontal,
  Send,
  XCircle,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { CompatibilityBreakdown } from "@/components/CompatibilityBreakdown";
import { SendMatchModal } from "@/components/SendMatchModal";
import { CompareProfilesModal } from "@/components/CompareProfilesModal";
import { calculateAge, formatHeight } from "@/lib/utils";

function RecommendationsWorkspaceInner() {
  const searchParams = useSearchParams();
  const initialCustomerId = searchParams.get("customerId") || "";

  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(initialCustomerId);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  // Filters
  const [minScore, setMinScore] = useState(60);
  const [filterCity, setFilterCity] = useState("ALL");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "recency">("score");

  // Modals state
  const [compareCandidate, setCompareCandidate] = useState<any | null>(null);
  const [sendMatchCandidate, setSendMatchCandidate] = useState<any | null>(null);

  // Load client dropdown list
  useEffect(() => {
    async function loadClientList() {
      try {
        setLoadingCustomers(true);
        const res = await fetch("/api/customers?pageSize=100");
        const data = await res.json();
        if (data.customers) {
          setCustomers(data.customers);
          if (!selectedCustomerId && data.customers.length > 0) {
            setSelectedCustomerId(data.customers[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load client directory:", err);
      } finally {
        setLoadingCustomers(false);
      }
    }
    loadClientList();
  }, [selectedCustomerId]);

  // Load focal client and candidate recommendations
  const loadRecommendations = useCallback(async () => {
    if (!selectedCustomerId) return;
    setLoading(true);
    try {
      // 1. Fetch focal profile
      const custRes = await fetch(`/api/customers/${selectedCustomerId}`);
      const custData = await custRes.json();
      if (custData.customer) {
        setSelectedCustomer(custData.customer);
      }

      // 2. Fetch ranked candidate recommendations
      const queryParams = new URLSearchParams();
      if (minScore > 0) queryParams.set("minScore", minScore.toString());
      if (filterCity !== "ALL") queryParams.set("city", filterCity);
      if (onlyVerified) queryParams.set("onlyVerified", "true");

      const recRes = await fetch(
        `/api/customers/${selectedCustomerId}/recommendations?${queryParams.toString()}`
      );
      const recData = await recRes.json();
      if (recData.recommendations) {
        setRecommendations(recData.recommendations);
      }
    } catch (err) {
      console.error("Failed to calculate recommendations:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCustomerId, minScore, filterCity, onlyVerified]);

  useEffect(() => {
    if (selectedCustomerId) {
      loadRecommendations();
    }
  }, [selectedCustomerId, loadRecommendations]);

  const handleDismissCandidate = (candidateId: string) => {
    setRecommendations((prev) => prev.filter((r) => r.candidate.id !== candidateId));
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 text-[#242522] animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E3DC]">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#777970] font-semibold">
            Decision Engine Workspace
          </div>
          <h1 className="text-xl font-semibold text-[#242522] tracking-tight mt-0.5">
            Match Recommendations
          </h1>
          <p className="text-xs text-[#777970] mt-0.5">
            Deterministic, explainable candidate ranking powered by reciprocal partner preference evaluation.
          </p>
        </div>

        {/* Client Selector Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-xs font-medium text-[#777970] shrink-0">Client Portfolio:</label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            disabled={loadingCustomers}
            className="w-full sm:w-auto px-3 py-1.5 bg-[#FFFFFF] border border-[#E6E3DC] rounded text-xs font-medium min-w-[220px]"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName} ({c.customerCode} • {c.gender})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Client Summary Ribbon */}
      {selectedCustomer && (
        <div className="p-4 bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E8E4DA] text-[#315747] font-semibold text-xs flex items-center justify-center shrink-0">
              {selectedCustomer.firstName[0]}
              {selectedCustomer.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[#242522]">
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </span>
                <span className="font-mono text-xs text-[#777970]">
                  ({selectedCustomer.customerCode})
                </span>
                <StatusBadge status={selectedCustomer.journeyStage} size="sm" />
              </div>
              <div className="text-xs text-[#555750] mt-0.5">
                {calculateAge(selectedCustomer.dateOfBirth)} yrs • {selectedCustomer.city} • {selectedCustomer.highestEducation} • {selectedCustomer.diet.replace("_", " ")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href={`/customers/${selectedCustomer.id}`}
              className="text-[#315747] hover:underline font-medium flex items-center gap-1"
            >
              <span>View Full Dossier</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Filter and Sensitivity Controls */}
      <div className="p-3.5 bg-[#FAF9F6] border border-[#E6E3DC] rounded flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#777970]" />
            <span className="font-semibold text-[#3A3C36]">Min Compatibility:</span>
            <select
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value, 10))}
              className="px-2 py-1 bg-[#FFFFFF] border border-[#E6E3DC] rounded text-xs"
            >
              <option value="0">Show All (0%+)</option>
              <option value="50">50%+ Threshold</option>
              <option value="60">60%+ (Viable)</option>
              <option value="75">75%+ (High Match)</option>
              <option value="85">85%+ (Top Tier)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#3A3C36]">Location:</span>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="px-2 py-1 bg-[#FFFFFF] border border-[#E6E3DC] rounded text-xs"
            >
              <option value="ALL">All Locations</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Delhi">Delhi</option>
              <option value="Pune">Pune</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              className="rounded border-[#E6E3DC] text-[#315747] focus:ring-[#315747]"
            />
            <span className="text-[#3A3C36]">Verified Only</span>
          </label>
        </div>

        <div className="text-[#777970] text-[11px]">
          Showing {recommendations.length} eligible candidates
        </div>
      </div>

      {/* Recommendations Feed / Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#777970]">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#315747]" />
          Evaluating candidate pool across 6 compatibility dimensions...
        </div>
      ) : recommendations.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#777970] bg-[#FFFFFF] border border-[#E6E3DC] rounded">
          No candidates met the active compatibility threshold ({minScore}%) for this client.
          Try adjusting the minimum score or location filters.
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const cand = rec.candidate;
            const comp = rec.compatibility;
            const candAge = calculateAge(cand.dateOfBirth);

            return (
              <div
                key={cand.id}
                className="p-5 bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs hover:border-[#D0CCC2] transition-colors text-xs card-hover animate-fade-in"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-3 border-b border-[#E6E3DC]">
                  {/* Candidate Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EAE7DF] text-[#315747] font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {cand.firstName[0]}
                      {cand.lastName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#242522]">
                          {cand.firstName} {cand.lastName}
                        </span>
                        <span className="font-mono text-[11px] text-[#777970]">
                          ({cand.customerCode})
                        </span>
                        {cand.isVerified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-[#315747] font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[#555750] mt-0.5">
                        {candAge} yrs • {formatHeight(cand.heightCm)} • {cand.city}, {cand.state} • {cand.highestEducation} ({cand.degree || "Degree"})
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Score Banner */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-semibold text-[#777970]">
                        Deterministic Match
                      </div>
                      <div className="text-xl font-bold text-[#242522]">
                        {comp.compatibilityScore}%
                      </div>
                    </div>
                    <StatusBadge status={comp.tier} size="sm" />
                  </div>
                </div>

                {/* Grounded Explanation & Factors */}
                <div className="py-3 space-y-2">
                  <p className="text-[#3A3C36] leading-relaxed">
                    <span className="font-semibold text-[#242522]">Match Assessment: </span>
                    {comp.shortExplanation}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="text-[#315747] flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{comp.topPositiveFactors[0] || "Aligned mutual preferences"}</span>
                    </div>
                    {comp.potentialConcerns[0] &&
                      !comp.potentialConcerns[0].includes("No significant structural") && (
                        <div className="text-[#B76E57] flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{comp.potentialConcerns[0]}</span>
                        </div>
                      )}
                  </div>
                </div>

                {/* Action Buttons Toolbar */}
                <div className="pt-3 border-t border-[#E6E3DC] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/customers/${cand.id}`}
                      className="px-2.5 py-1 bg-[#FFFFFF] border border-[#E6E3DC] rounded text-[#555750] hover:text-[#242522] hover:bg-[#FAF9F6] transition-colors btn-press"
                    >
                      View Dossier
                    </Link>
                    <button
                      onClick={() =>
                        setCompareCandidate({
                          candidate: cand,
                          compatibility: comp,
                        })
                      }
                      className="px-2.5 py-1 bg-[#FFFFFF] border border-[#E6E3DC] rounded text-[#555750] hover:text-[#242522] hover:bg-[#FAF9F6] transition-colors btn-press cursor-pointer"
                    >
                      Compare Profiles
                    </button>
                    <button
                      onClick={() => handleDismissCandidate(cand.id)}
                      className="px-2 py-1 text-[#777970] hover:text-[#9A4630] transition-colors btn-press cursor-pointer"
                      title="Dismiss from current recommendation queue"
                    >
                      Dismiss
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      setSendMatchCandidate({
                        candidate: cand,
                        compatibility: comp,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-white bg-[#315747] hover:bg-[#254437] rounded transition-colors shadow-xs btn-press cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Match Presentation</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Send Match Modal */}
      {sendMatchCandidate && selectedCustomer && (
        <SendMatchModal
          isOpen={!!sendMatchCandidate}
          onClose={() => setSendMatchCandidate(null)}
          customer={selectedCustomer}
          candidate={sendMatchCandidate.candidate}
          compatibility={sendMatchCandidate.compatibility}
          onSuccess={() => {
            loadRecommendations();
          }}
        />
      )}

      {/* Compare Profiles Modal */}
      {compareCandidate && selectedCustomer && (
        <CompareProfilesModal
          isOpen={!!compareCandidate}
          onClose={() => setCompareCandidate(null)}
          customer={selectedCustomer}
          candidate={compareCandidate.candidate}
          compatibility={compareCandidate.compatibility}
        />
      )}
    </div>
  );
}

export default function RecommendationsWorkspace() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#777970]">
          Loading recommendations workspace...
        </div>
      }
    >
      <RecommendationsWorkspaceInner />
    </Suspense>
  );
}
