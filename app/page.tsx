import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { CustomerService } from "@/lib/services/customer.service";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Users,
  ShieldCheck,
  Sparkles,
  Send,
  CalendarCheck,
  CheckCircle,
  Plus,
  ArrowRight,
  Clock,
  ChevronRight,
} from "lucide-react";

export default async function OverviewPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const { metrics, recentCustomers, recentFollowUps, journeyDistribution } =
    await CustomerService.getDashboardMetrics();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 text-[#242522]">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E3DC]">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#777970] font-semibold">
            Operational Dashboard
          </div>
          <h1 className="text-xl font-semibold text-[#242522] tracking-tight mt-0.5">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs text-[#777970] mt-0.5">
            Here is your operational workload, customer portfolio, and pending match actions.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/customers"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#FFFFFF] border border-[#E6E3DC] rounded hover:bg-[#FAF9F6] transition-colors text-[#242522]"
          >
            <Users className="w-3.5 h-3.5 text-[#555750]" />
            <span>Manage Clients</span>
          </Link>
          <Link
            href="/recommendations"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#315747] text-white rounded hover:bg-[#254437] transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Find Matches</span>
          </Link>
        </div>
      </div>

      {/* 6 Key Operational Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs">
          <div className="text-[11px] font-medium text-[#777970] uppercase tracking-wider">
            Total Clients
          </div>
          <div className="text-2xl font-semibold text-[#242522] mt-1">
            {metrics.totalAssigned}
          </div>
          <div className="text-[11px] text-[#777970] mt-0.5">Active in CRM</div>
        </div>

        <div className="p-3.5 bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs">
          <div className="text-[11px] font-medium text-[#777970] uppercase tracking-wider">
            Verified Profiles
          </div>
          <div className="text-2xl font-semibold text-[#315747] mt-1">
            {metrics.verifiedCount}
          </div>
          <div className="text-[11px] text-[#777970] mt-0.5">Aadhaar & degrees</div>
        </div>

        <div className="p-3.5 bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs">
          <div className="text-[11px] font-medium text-[#777970] uppercase tracking-wider">
            Actively Seeking
          </div>
          <div className="text-2xl font-semibold text-[#242522] mt-1">
            {metrics.activeSeeking}
          </div>
          <div className="text-[11px] text-[#777970] mt-0.5">In matching queue</div>
        </div>

        <div className="p-3.5 bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs">
          <div className="text-[11px] font-medium text-[#777970] uppercase tracking-wider">
            Pending Sends
          </div>
          <div className="text-2xl font-semibold text-[#785412] mt-1">
            {metrics.pendingInteractions}
          </div>
          <div className="text-[11px] text-[#777970] mt-0.5">Awaiting feedback</div>
        </div>

        <div className="p-3.5 bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs">
          <div className="text-[11px] font-medium text-[#777970] uppercase tracking-wider">
            Accepted Matches
          </div>
          <div className="text-2xl font-semibold text-[#315747] mt-1">
            {metrics.acceptedInteractions}
          </div>
          <div className="text-[11px] text-[#777970] mt-0.5">Mutual progress</div>
        </div>

        <div className="p-3.5 bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs">
          <div className="text-[11px] font-medium text-[#777970] uppercase tracking-wider">
            Follow-ups Due
          </div>
          <div className="text-2xl font-semibold text-[#9A4630] mt-1">
            {metrics.followUpsDue}
          </div>
          <div className="text-[11px] text-[#777970] mt-0.5">Requiring contact</div>
        </div>
      </div>

      {/* Main Grid: Workload & Client Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Recent Customers & Stage Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recently Added Clients */}
          <div className="bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#E6E3DC] flex items-center justify-between bg-[#FAF9F6]">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#777970]">
                  Client Workload Queue
                </h2>
                <div className="text-sm font-semibold text-[#242522]">
                  Recently Added & Active Profiles
                </div>
              </div>
              <Link
                href="/customers"
                className="text-xs font-medium text-[#315747] hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E6E3DC] bg-[#FAF9F6] text-[#777970] font-medium">
                    <th className="py-2.5 px-4">Client ID</th>
                    <th className="py-2.5 px-4">Name</th>
                    <th className="py-2.5 px-4">City</th>
                    <th className="py-2.5 px-4">Education</th>
                    <th className="py-2.5 px-4">Journey Stage</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6]">
                  {recentCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-[#777970]">
                        {cust.customerCode}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/customers/${cust.id}`}
                          className="font-medium text-[#242522] hover:text-[#315747] hover:underline"
                        >
                          {cust.firstName} {cust.lastName}
                        </Link>
                        {cust.isVerified && (
                          <span className="ml-1.5 text-[10px] text-[#315747] font-semibold">
                            ✓
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#555750]">{cust.city}</td>
                      <td className="py-3 px-4 text-[#555750]">{cust.highestEducation}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={cust.journeyStage} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/recommendations?customerId=${cust.id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#315747] hover:underline"
                        >
                          <span>Match</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Journey Stage Distribution */}
          <div className="bg-[#FFFFFF] border border-[#E6E3DC] rounded p-5 shadow-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#777970] mb-3">
              Journey Stage Pipeline Distribution
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {journeyDistribution.map((item) => (
                <div
                  key={item.stage}
                  className="p-2.5 bg-[#FAF9F6] border border-[#E6E3DC] rounded"
                >
                  <div className="text-[11px] text-[#777970] truncate">
                    {item.stage.replace(/_/g, " ")}
                  </div>
                  <div className="text-lg font-semibold text-[#242522] mt-0.5">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Pending Follow-ups */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#E6E3DC] flex items-center justify-between bg-[#FAF9F6]">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#777970]">
                  Follow-ups
                </h2>
                <div className="text-sm font-semibold text-[#242522]">
                  Upcoming Consultations
                </div>
              </div>
              <Link
                href="/follow-ups"
                className="text-xs font-medium text-[#315747] hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-[#EFECE6] p-2">
              {recentFollowUps.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#777970]">
                  No pending follow-ups due at this time.
                </div>
              ) : (
                recentFollowUps.map((fu) => (
                  <div key={fu.id} className="p-3 hover:bg-[#FAF9F6] rounded transition-colors text-xs space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-[#242522] leading-tight">
                        {fu.title}
                      </span>
                      <StatusBadge status={fu.priority} size="sm" />
                    </div>
                    <div className="text-[11px] text-[#777970] flex items-center gap-1.5">
                      <Users className="w-3 h-3" />
                      <span>
                        {fu.customer.firstName} {fu.customer.lastName} ({fu.customer.customerCode})
                      </span>
                    </div>
                    <div className="text-[10px] text-[#888A82] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Due: {new Date(fu.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
