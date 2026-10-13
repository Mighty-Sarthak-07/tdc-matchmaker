"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Filter,
  Plus,
  Loader2,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      const url = statusFilter === "ALL" ? "/api/follow-ups" : `/api/follow-ups?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.followUps) {
        setFollowUps(data.followUps);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [statusFilter]);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    try {
      setUpdatingId(id);
      const res = await fetch("/api/follow-ups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        fetchFollowUps();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 text-[#242522]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E3DC]">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#777970] font-semibold">
            Task Management
          </div>
          <h1 className="text-xl font-semibold text-[#242522] tracking-tight mt-0.5">
            Client Follow-up Schedule
          </h1>
          <p className="text-xs text-[#777970] mt-0.5">
            Coordinate upcoming meetings, candidate feedback consultations, and verification touchpoints.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[#777970]">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E6E3DC] rounded text-xs"
          >
            <option value="ALL">All Follow-ups</option>
            <option value="PENDING">Pending Only</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Follow-ups List */}
      <div className="bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#777970]">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#315747]" />
            Loading follow-up schedule...
          </div>
        ) : followUps.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#777970]">
            No follow-ups found for the selected status.
          </div>
        ) : (
          <div className="divide-y divide-[#EFECE6]">
            {followUps.map((fu) => {
              const isOverdue =
                fu.status === "PENDING" && new Date(fu.dueDate) < new Date();

              return (
                <div
                  key={fu.id}
                  className="p-4 hover:bg-[#FAF9F6] transition-colors text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleStatus(fu.id, fu.status)}
                      disabled={updatingId === fu.id}
                      className="mt-0.5 text-[#777970] hover:text-[#315747] transition-colors"
                      title={fu.status === "COMPLETED" ? "Mark Pending" : "Mark Complete"}
                    >
                      {fu.status === "COMPLETED" ? (
                        <CheckCircle2 className="w-4 h-4 text-[#315747]" />
                      ) : (
                        <div className="w-4 h-4 rounded border border-[#C8C5BC] hover:border-[#315747]" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            fu.status === "COMPLETED"
                              ? "line-through text-[#888A82]"
                              : "text-[#242522]"
                          }`}
                        >
                          {fu.title}
                        </span>
                        <StatusBadge status={fu.priority} size="sm" />
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-[#555750] mt-1">
                        <Link
                          href={`/customers/${fu.customer.id}`}
                          className="hover:text-[#315747] hover:underline flex items-center gap-1 font-medium"
                        >
                          <Users className="w-3 h-3 text-[#777970]" />
                          <span>
                            {fu.customer.firstName} {fu.customer.lastName} ({fu.customer.customerCode})
                          </span>
                        </Link>
                        <span>•</span>
                        <span>{fu.customer.city}</span>
                        {fu.customer.phone && (
                          <>
                            <span>•</span>
                            <span>{fu.customer.phone}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right text-[11px]">
                      <div
                        className={`flex items-center gap-1 ${
                          isOverdue ? "text-[#9A4630] font-semibold" : "text-[#777970]"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Due: {new Date(fu.dueDate).toLocaleDateString()}</span>
                      </div>
                      {isOverdue && (
                        <div className="text-[10px] text-[#9A4630]">Requires Attention</div>
                      )}
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
