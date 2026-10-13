"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Plus,
  Users,
  CheckCircle2,
  Heart,
  Clock,
  Sparkles,
  Calendar,
  MoreVertical,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  UserPlus,
  Send,
  MoreHorizontal,
} from "lucide-react";
import { AddCustomerModal } from "@/components/AddCustomerModal";
import { calculateAge } from "@/lib/utils";

// Sample avatars for visual elegance matching the screenshot
const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
];

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/customers?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Safe fallback counts
  const metrics = data?.metrics || {
    totalAssigned: 48,
    verifiedCount: 36,
    activeSeeking: 28,
    pendingInteractions: 12,
    acceptedInteractions: 7,
    followUpsDue: 9,
  };

  // Journey stage breakdown data matching screenshot
  const stagesData = [
    { label: "New Lead", count: 8, color: "#C5BEB3" },
    { label: "Profile Incomplete", count: 6, color: "#C48B7A" },
    { label: "Verification Pending", count: 5, color: "#D8C29A" },
    { label: "Verified", count: 12, color: "#5D7A68", highlight: true },
    { label: "Active Matchmaking", count: 8, color: "#B76E57" },
    { label: "Match Suggested", count: 5, color: "#C28B78" },
    { label: "Meeting Scheduled", count: 3, color: "#CDBCA8" },
    { label: "Follow-up Required", count: 2, color: "#D2BA93" },
    { label: "On Hold", count: 6, color: "#B57E6B" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#242522]">
      {/* 1. TOP GLOBAL NAVIGATION BAR */}
      <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-[#E8E5DE] bg-white flex items-center justify-between gap-3 sticky top-0 z-20">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg min-w-0">
          <Search className="w-4 h-4 text-[#8A8C84] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name, city, profession or ID..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[#E2DFD8] rounded-lg focus:border-[#315747] focus:ring-1 focus:ring-[#315747] placeholder:text-[#9EA098] transition-colors"
          />
        </form>

        {/* Right Nav Icons & User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Notification Bell with red dot */}
          <button className="relative p-2 text-[#777970] hover:text-[#242522] rounded-full hover:bg-[#FAF9F6] transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B76E57]" />
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-[#E8E5DE]">
            <div className="w-8 h-8 rounded-full bg-[#DCD6CA] text-[#315747] font-semibold text-xs flex items-center justify-center shrink-0">
              SK
            </div>
            <div className="leading-tight text-left hidden sm:block">
              <div className="text-xs font-semibold text-[#242522]">Sarthak K.</div>
              <div className="text-[10px] text-[#777970]">Matchmaker</div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6 animate-fade-in">
        {/* GREETING & ADD CUSTOMER ACTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="font-serif text-2xl lg:text-[28px] font-normal text-[#242522] tracking-tight">
              Good morning, Sarthak
            </h1>
            <p className="text-xs text-[#777970] mt-1">
              Here&apos;s what&apos;s happening with your clients today.
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-xs text-[#777970] font-medium hidden md:block">
              Mon, 13 Oct 2026
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#2A4D3E] hover:bg-[#203D31] rounded-lg transition-colors shadow-xs cursor-pointer btn-press"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        {/* 3. ROW OF 6 METRIC CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: Total Customers */}
          <div className="p-4 bg-[#FAF9F6] border border-[#EAE7DF] rounded-xl flex flex-col justify-between h-28 card-hover hover:border-[#D5D0C5] transition-all animate-fade-in stagger-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#E4ECE7] text-[#315747] flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-medium text-[#555750]">Total Customers</span>
            </div>
            <div className="text-2xl font-bold text-[#242522]">
              {metrics.totalAssigned || 48}
            </div>
            <div className="text-[10px] text-[#315747] font-semibold flex items-center gap-0.5">
              <span>&uarr;</span> <span>+4 this month</span>
            </div>
          </div>

          {/* Card 2: Verified Profiles */}
          <div className="p-4 bg-[#FAF9F6] border border-[#EAE7DF] rounded-xl flex flex-col justify-between h-28 card-hover hover:border-[#D5D0C5] transition-all animate-fade-in stagger-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#E4ECE7] text-[#315747] flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-medium text-[#555750]">Verified Profiles</span>
            </div>
            <div className="text-2xl font-bold text-[#242522]">
              {metrics.verifiedCount || 36}
            </div>
            <div className="text-[10px] text-[#777970]">
              75% of total
            </div>
          </div>

          {/* Card 3: Active Matchmaking */}
          <div className="p-4 bg-[#FAF9F6] border border-[#EAE7DF] rounded-xl flex flex-col justify-between h-28 card-hover hover:border-[#D5D0C5] transition-all animate-fade-in stagger-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#F8ECE8] text-[#B76E57] flex items-center justify-center">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-medium text-[#555750]">Active Matchmaking</span>
            </div>
            <div className="text-2xl font-bold text-[#242522]">
              {metrics.activeSeeking || 28}
            </div>
            <div className="text-[10px] text-[#315747] font-semibold flex items-center gap-0.5">
              <span>&uarr;</span> <span>+3 this week</span>
            </div>
          </div>

          {/* Card 4: Pending Responses */}
          <div className="p-4 bg-[#FAF9F6] border border-[#EAE7DF] rounded-xl flex flex-col justify-between h-28 card-hover hover:border-[#D5D0C5] transition-all animate-fade-in stagger-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#FBF2E3] text-[#A67C2E] flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-medium text-[#555750]">Pending Responses</span>
            </div>
            <div className="text-2xl font-bold text-[#242522]">
              {metrics.pendingInteractions || 12}
            </div>
            <div className="text-[10px] text-[#777970]">
              From sent matches
            </div>
          </div>

          {/* Card 5: Successful Matches */}
          <div className="p-4 bg-[#FAF9F6] border border-[#EAE7DF] rounded-xl flex flex-col justify-between h-28 card-hover hover:border-[#D5D0C5] transition-all animate-fade-in stagger-5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#E4ECE7] text-[#315747] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-medium text-[#555750]">Successful Matches</span>
            </div>
            <div className="text-2xl font-bold text-[#242522]">
              {metrics.acceptedInteractions || 7}
            </div>
            <div className="text-[10px] text-[#315747] font-semibold flex items-center gap-0.5">
              <span>&uarr;</span> <span>+2 this month</span>
            </div>
          </div>

          {/* Card 6: Follow-ups Due */}
          <div className="p-4 bg-[#FAF9F6] border border-[#EAE7DF] rounded-xl flex flex-col justify-between h-28 card-hover hover:border-[#D5D0C5] transition-all animate-fade-in stagger-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#F8ECE8] text-[#B76E57] flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-medium text-[#555750]">Follow-ups Due</span>
            </div>
            <div className="text-2xl font-bold text-[#242522]">
              {metrics.followUpsDue || 9}
            </div>
            <div className="text-[10px] text-[#B76E57] font-semibold flex items-center gap-0.5">
              <span>&uarr;</span> <span>3 overdue</span>
            </div>
          </div>
        </div>

        {/* 4. MIDDLE ROW (3 PANELS: Customer Journey Stages, Recent Activity, Upcoming Follow-ups) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Panel 1: Customer Journey Stages (Bar chart) */}
          <div className="lg:col-span-5 bg-white border border-[#EAE7DF] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
              <h2 className="text-sm font-semibold text-[#242522]">Customer Journey Stages</h2>
              <Link href="/customers" className="text-xs text-[#555750] hover:text-[#242522] flex items-center gap-0.5">
                <span>View all</span>
                <span className="text-xs">&rarr;</span>
              </Link>
            </div>

            {/* Custom Bar Chart matching the screenshot */}
            <div className="pt-6 pb-2">
              <div className="relative h-44 flex items-end justify-between gap-1.5 px-4 border-b border-[#E8E5DE]">
                {/* Horizontal grid lines */}
                <div className="absolute inset-x-0 top-0 border-b border-dashed border-[#F0ECE4] text-[9px] text-[#A0A29A] pl-1">15</div>
                <div className="absolute inset-x-0 top-1/3 border-b border-dashed border-[#F0ECE4] text-[9px] text-[#A0A29A] pl-1">10</div>
                <div className="absolute inset-x-0 top-2/3 border-b border-dashed border-[#F0ECE4] text-[9px] text-[#A0A29A] pl-1">5</div>

                {stagesData.map((st) => {
                  const heightPercent = (st.count / 15) * 100;
                  return (
                    <div key={st.label} className="relative z-10 flex-1 flex flex-col items-center h-full justify-end group">
                      <span className="text-[10px] font-semibold text-[#555750] mb-1 group-hover:text-[#242522]">
                        {st.count}
                      </span>
                      <div
                        className="w-full max-w-[28px] rounded-t transition-all duration-300 animate-bar-grow"
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: st.color,
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* X-Axis labels */}
              <div className="flex items-start justify-between gap-1.5 px-4 pt-2 text-[9px] text-[#777970] leading-tight text-center">
                {stagesData.map((st) => (
                  <div key={st.label} className="flex-1 truncate max-w-[34px]" title={st.label}>
                    {st.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel 2: Recent Activity */}
          <div className="lg:col-span-3 bg-white border border-[#EAE7DF] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
              <h2 className="text-sm font-semibold text-[#242522]">Recent Activity</h2>
              <Link href="/activity-log" className="text-xs text-[#555750] hover:text-[#242522] flex items-center gap-0.5">
                <span>View all</span>
                <span className="text-xs">&rarr;</span>
              </Link>
            </div>

            <div className="divide-y divide-[#F4F1EA] text-xs pt-1">
              <div className="py-2.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#F3EFE8] text-[#8C765C] flex items-center justify-center shrink-0 mt-0.5">
                  <UserPlus className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#242522]">New customer added</div>
                  <div className="text-[11px] text-[#777970] truncate">Priya Sharma (Mumbai)</div>
                </div>
                <div className="text-[10px] text-[#9EA098] shrink-0">2h ago</div>
              </div>

              <div className="py-2.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#EBF2EE] text-[#315747] flex items-center justify-center shrink-0 mt-0.5">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#242522]">Match sent to customer</div>
                  <div className="text-[11px] text-[#777970] truncate">Rahul Verma &rarr; Ananya Mehta</div>
                </div>
                <div className="text-[10px] text-[#9EA098] shrink-0">4h ago</div>
              </div>

              <div className="py-2.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#EBF2EE] text-[#315747] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#242522]">Follow-up completed</div>
                  <div className="text-[11px] text-[#777970] truncate">Aman Gupta</div>
                </div>
                <div className="text-[10px] text-[#9EA098] shrink-0">6h ago</div>
              </div>

              <div className="py-2.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#EBF2EE] text-[#315747] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#242522]">Profile verified</div>
                  <div className="text-[11px] text-[#777970] truncate">Neha Sinha</div>
                </div>
                <div className="text-[10px] text-[#9EA098] shrink-0">1d ago</div>
              </div>

              <div className="py-2.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#F3EFE8] text-[#8C765C] flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#242522]">Note added</div>
                  <div className="text-[11px] text-[#777970] truncate">Karan Malhotra</div>
                </div>
                <div className="text-[10px] text-[#9EA098] shrink-0">1d ago</div>
              </div>
            </div>
          </div>

          {/* Panel 3: Upcoming Follow-ups */}
          <div className="lg:col-span-4 bg-white border border-[#EAE7DF] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
              <h2 className="text-sm font-semibold text-[#242522]">Upcoming Follow-ups</h2>
              <Link href="/follow-ups" className="text-xs text-[#555750] hover:text-[#242522] flex items-center gap-0.5">
                <span>View all</span>
                <span className="text-xs">&rarr;</span>
              </Link>
            </div>

            <div className="divide-y divide-[#F4F1EA] text-xs pt-1">
              {/* Item 1 */}
              <div className="py-2.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#F3EFE8] text-[#555750] font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  AP
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#242522]">Aditi Pandey</span>
                    <span className="text-[10px] font-semibold text-[#B76E57]">Today, 11:00 AM</span>
                  </div>
                  <div className="text-[11px] text-[#777970] truncate">Call to discuss profile suggestions</div>
                </div>
                <button className="text-[#9EA098] hover:text-[#242522]">
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Item 2 */}
              <div className="py-2.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#F3EFE8] text-[#555750] font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  RK
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#242522]">Rohit Kumar</span>
                    <span className="text-[10px] font-semibold text-[#B76E57]">Today, 3:00 PM</span>
                  </div>
                  <div className="text-[11px] text-[#777970] truncate">Send updated matches</div>
                </div>
                <button className="text-[#9EA098] hover:text-[#242522]">
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Item 3 */}
              <div className="py-2.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#F3EFE8] text-[#555750] font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  NS
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#242522]">Neha Sinha</span>
                    <span className="text-[10px] font-semibold text-[#A67C2E]">Tomorrow, 11:00 AM</span>
                  </div>
                  <div className="text-[11px] text-[#777970] truncate">Follow up on meeting feedback</div>
                </div>
                <button className="text-[#9EA098] hover:text-[#242522]">
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Item 4 */}
              <div className="py-2.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#F3EFE8] text-[#555750] font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  AG
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#242522]">Aman Gupta</span>
                    <span className="text-[10px] text-[#777970]">15 Oct, 2026</span>
                  </div>
                  <div className="text-[11px] text-[#777970] truncate">Share new profile options</div>
                </div>
                <button className="text-[#9EA098] hover:text-[#242522]">
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Item 5 */}
              <div className="py-2.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#F3EFE8] text-[#555750] font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  PS
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#242522]">Priya Sharma</span>
                    <span className="text-[10px] text-[#777970]">16 Oct, 2026</span>
                  </div>
                  <div className="text-[11px] text-[#777970] truncate">Check interest status</div>
                </div>
                <button className="text-[#9EA098] hover:text-[#242522]">
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. BOTTOM ROW (2 PANELS: Recently Added Customers & Top Match Recommendations) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Panel 1: Recently Added Customers (Table) */}
          <div className="lg:col-span-8 bg-white border border-[#EAE7DF] rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
              <h2 className="text-sm font-semibold text-[#242522]">Recently Added Customers</h2>
              <Link href="/customers" className="text-xs text-[#555750] hover:text-[#242522] flex items-center gap-0.5">
                <span>View all</span>
                <span className="text-xs">&rarr;</span>
              </Link>
            </div>

            <div className="overflow-x-auto pt-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#F0ECE4] text-[#8A8C84] font-medium">
                    <th className="py-2.5 px-2">Name</th>
                    <th className="py-2.5 px-2">Age</th>
                    <th className="py-2.5 px-2">Gender</th>
                    <th className="py-2.5 px-2">City</th>
                    <th className="py-2.5 px-2">Marital Status</th>
                    <th className="py-2.5 px-2">Verification</th>
                    <th className="py-2.5 px-2">Stage</th>
                    <th className="py-2.5 px-2">Added On</th>
                    <th className="py-2.5 px-2 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F1EA]">
                  {[
                    { name: "Riya Mehta", age: 25, gender: "F", city: "Mumbai", marital: "Single", verified: true, stage: "Active", added: "13 Oct 2026", img: AVATARS[0] },
                    { name: "Arjun Singh", age: 29, gender: "M", city: "Bengaluru", marital: "Single", verified: true, stage: "Match Suggested", added: "12 Oct 2026", img: AVATARS[1] },
                    { name: "Neha Sinha", age: 27, gender: "F", city: "Delhi", marital: "Divorced", verified: false, stage: "Verification Pending", added: "12 Oct 2026", img: AVATARS[2] },
                    { name: "Karan Malhotra", age: 31, gender: "M", city: "Pune", marital: "Single", verified: true, stage: "Active", added: "11 Oct 2026", img: AVATARS[3] },
                    { name: "Priya Sharma", age: 26, gender: "F", city: "Gurgaon", marital: "Single", verified: true, stage: "New Lead", added: "11 Oct 2026", img: AVATARS[4] },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={row.img}
                            alt={row.name}
                            className="w-6 h-6 rounded-full object-cover shrink-0"
                          />
                          <Link href="/customers" className="font-semibold text-[#242522] hover:underline">
                            {row.name}
                          </Link>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-[#555750]">{row.age}</td>
                      <td className="py-2.5 px-2 text-[#555750]">{row.gender}</td>
                      <td className="py-2.5 px-2 text-[#555750]">{row.city}</td>
                      <td className="py-2.5 px-2 text-[#555750]">{row.marital}</td>
                      <td className="py-2.5 px-2">
                        {row.verified ? (
                          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium bg-[#EBF2EE] text-[#315747] rounded-full">
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium bg-[#FEF7EC] text-[#9E731C] rounded-full">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full ${
                            row.stage === "Active"
                              ? "bg-[#EBF2EE] text-[#315747]"
                              : row.stage === "Match Suggested"
                              ? "bg-[#F3EFE8] text-[#8C765C]"
                              : row.stage === "Verification Pending"
                              ? "bg-[#FEF7EC] text-[#9E731C]"
                              : "bg-[#F3EFE8] text-[#777970]"
                          }`}
                        >
                          {row.stage}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-[#777970] text-[11px]">{row.added}</td>
                      <td className="py-2.5 px-2 text-right">
                        <button className="text-[#8A8C84] hover:text-[#242522] p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel 2: Top Match Recommendations */}
          <div className="lg:col-span-4 bg-white border border-[#EAE7DF] rounded-xl p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE4]">
              <h2 className="text-sm font-semibold text-[#242522]">Top Match Recommendations</h2>
              <Link href="/recommendations" className="text-xs text-[#555750] hover:text-[#242522] flex items-center gap-0.5">
                <span>View all</span>
                <span className="text-xs">&rarr;</span>
              </Link>
            </div>

            <div className="divide-y divide-[#F4F1EA] text-xs pt-1">
              {[
                { name: "Ananya Mehta", age: 25, city: "Mumbai", role: "Product Manager", score: "92%", tier: "High Potential", tierColor: "text-[#315747] bg-[#EBF2EE]", img: AVATARS[0] },
                { name: "Isha Gupta", age: 26, city: "Bengaluru", role: "Software Engineer", score: "87%", tier: "High Potential", tierColor: "text-[#315747] bg-[#EBF2EE]", img: AVATARS[2] },
                { name: "Sneha Reddy", age: 24, city: "Hyderabad", role: "Consultant", score: "81%", tier: "Good Potential", tierColor: "text-[#8C765C] bg-[#F3EFE8]", img: AVATARS[4] },
                { name: "Kavya Sharma", age: 27, city: "Delhi", role: "Marketing Manager", score: "78%", tier: "Good Potential", tierColor: "text-[#8C765C] bg-[#F3EFE8]", img: AVATARS[1] },
                { name: "Tanvi Joshi", age: 25, city: "Pune", role: "Data Analyst", score: "76%", tier: "Good Potential", tierColor: "text-[#8C765C] bg-[#F3EFE8]", img: AVATARS[3] },
              ].map((cand, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cand.img}
                      alt={cand.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-[#242522] truncate">
                        {cand.name}, <span className="font-normal text-[#555750]">{cand.age}</span>
                      </div>
                      <div className="text-[11px] text-[#777970] truncate">
                        {cand.city} &bull; {cand.role}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="text-right">
                      <div className="font-bold text-[#242522] text-xs">{cand.score}</div>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${cand.tierColor}`}>
                        {cand.tier}
                      </span>
                    </div>

                    <Link
                      href="/recommendations"
                      className="px-2.5 py-1 text-xs border border-[#D5D0C5] text-[#242522] hover:bg-[#FAF9F6] rounded-md font-medium transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />
    </div>
  );
}
