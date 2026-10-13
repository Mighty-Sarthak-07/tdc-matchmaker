"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, ShieldCheck, User, Users, Send, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        const res = await fetch("/api/activity-logs");
        const data = await res.json();
        if (data.logs) {
          setLogs(data.logs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 text-[#242522] animate-fade-in">
      {/* Header */}
      <div className="pb-4 border-b border-[#E6E3DC]">
        <div className="text-xs uppercase tracking-wider text-[#777970] font-semibold">
          Audit & Compliance
        </div>
        <h1 className="text-xl font-semibold text-[#242522] tracking-tight mt-0.5">
          Chronological Activity Log
        </h1>
        <p className="text-xs text-[#777970] mt-0.5">
          Comprehensive, immutable audit history of customer consults, match introductions, and operational events.
        </p>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#777970]">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#315747]" />
            Loading system audit logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#777970]">
            No activity logs recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-[#EFECE6]">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-[#FAF9F6] transition-colors text-xs space-y-1 card-hover animate-fade-in">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#242522]">{log.title}</span>
                      <StatusBadge status={log.actionType} size="sm" />
                    </div>
                    {log.details && (
                      <p className="text-[#555750] text-[11px] font-mono leading-relaxed mt-0.5">
                        {log.details}
                      </p>
                    )}
                  </div>

                  <div className="text-right text-[11px] text-[#777970] shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="text-[10px] text-[#888A82] mt-0.5">
                      By {log.user?.name || "System"}
                    </div>
                  </div>
                </div>

                {log.customer && (
                  <div className="text-[11px] text-[#777970] pt-1 flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#315747]" />
                    <Link
                      href={`/customers/${log.customer.id}`}
                      className="hover:text-[#315747] hover:underline"
                    >
                      Client: {log.customer.firstName} {log.customer.lastName} ({log.customer.customerCode})
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
