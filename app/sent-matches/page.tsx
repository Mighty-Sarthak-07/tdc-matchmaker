"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Send,
  Clock,
  UserCheck,
  CheckCircle,
  XCircle,
  Calendar,
  AlertCircle,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

export default function SentMatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchSentMatches = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/matches/sent");
      const data = await res.json();
      if (data.matches) {
        setMatches(data.matches);
      }
    } catch (e) {
      console.error("Failed to load sent matches:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentMatches();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      const res = await fetch("/api/matches/sent", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: newStatus,
          note: `Matchmaker marked interaction as ${newStatus}`,
        }),
      });
      if (res.ok) {
        fetchSentMatches();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 text-[#242522] animate-fade-in">
      {/* Header */}
      <div className="pb-4 border-b border-[#E6E3DC]">
        <div className="text-xs uppercase tracking-wider text-[#777970] font-semibold">
          Operational Outbox
        </div>
        <h1 className="text-xl font-semibold text-[#242522] tracking-tight mt-0.5">
          Sent Match Presentations
        </h1>
        <p className="text-xs text-[#777970] mt-0.5">
          Track customer responses, update feedback states, and monitor interaction lifecycles.
        </p>
      </div>

      {/* Sent Matches Table / Feed */}
      <div className="bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#777970]">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#315747]" />
            Loading dispatched match presentations...
          </div>
        ) : matches.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#777970]">
            No match presentations have been dispatched yet. Find candidates in Match Recommendations to send introductions.
          </div>
        ) : (
          <div className="divide-y divide-[#EFECE6]">
            {matches.map((item) => {
              let history: any[] = [];
              try {
                history = JSON.parse(item.statusHistory);
              } catch {
                history = [];
              }

              return (
                <div key={item.id} className="p-4 sm:p-5 hover:bg-[#FAF9F6] transition-colors text-xs space-y-3 card-hover animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 font-medium text-sm text-[#242522]">
                        <Link
                          href={`/customers/${item.customerA.id}`}
                          className="hover:text-[#315747] hover:underline"
                        >
                          {item.customerA.firstName} {item.customerA.lastName}
                        </Link>
                        <span className="text-[#888A82]">⇄</span>
                        <Link
                          href={`/customers/${item.customerB.id}`}
                          className="hover:text-[#315747] hover:underline"
                        >
                          {item.customerB.firstName} {item.customerB.lastName}
                        </Link>
                      </div>
                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    <div className="text-[11px] text-[#777970] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Sent on {new Date(item.sentAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Subject & Summary */}
                  <div className="bg-[#FAF9F6] p-3 rounded border border-[#E6E3DC]">
                    <div className="font-semibold text-[#242522] mb-1">{item.subject}</div>
                    <p className="text-[#555750] whitespace-pre-line font-mono text-[11px] leading-relaxed line-clamp-3">
                      {item.introductionMessage}
                    </p>
                  </div>

                  {/* Lifecycle History Trail & Status Update */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 text-[11px]">
                    <div className="flex items-center gap-2 text-[#777970]">
                      <span className="font-semibold text-[#3A3C36]">Lifecycle History:</span>
                      <span>{history.length} event(s) recorded</span>
                      {history[history.length - 1]?.note && (
                        <span className="text-[#888A82] truncate max-w-md">
                          ({history[history.length - 1].note})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[#777970]">Update Client Response:</span>
                      <select
                        value={item.status}
                        disabled={updatingId === item.id}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                        className="px-2 py-1 bg-[#FFFFFF] border border-[#E6E3DC] rounded text-xs font-medium"
                      >
                        <option value="SENT">Sent (Awaiting Feedback)</option>
                        <option value="VIEWED">Viewed by Client</option>
                        <option value="INTERESTED">Mutual Interest Expressed</option>
                        <option value="DECLINED">Declined by Client</option>
                        <option value="MEETING_SCHEDULED">Meeting Scheduled</option>
                        <option value="COMPLETED">Matched / Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
