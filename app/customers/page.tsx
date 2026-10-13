"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  RotateCcw,
  UserCheck,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { calculateAge } from "@/lib/utils";

const JOURNEY_STAGES = [
  "ALL",
  "NEW_LEAD",
  "PROFILE_INCOMPLETE",
  "VERIFICATION_PENDING",
  "VERIFIED",
  "ACTIVE_MATCHMAKING",
  "MATCH_SUGGESTED",
  "MEETING_SCHEDULED",
  "FOLLOW_UP_REQUIRED",
  "SUCCESSFULLY_MATCHED",
  "ON_HOLD",
];

const CITIES = [
  "ALL",
  "Mumbai",
  "Bengaluru",
  "Delhi",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Jaipur",
  "Ahmedabad",
  "Chandigarh",
  "Gurgaon",
  "Kochi",
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 15,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("ALL");
  const [city, setCity] = useState("ALL");
  const [maritalStatus, setMaritalStatus] = useState("ALL");
  const [journeyStage, setJourneyStage] = useState("ALL");
  const [isVerified, setIsVerified] = useState("ALL");
  const [sortBy, setSortBy] = useState<string>("lastContacted");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchCustomers = useCallback(
    async (pageToLoad = 1) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search.trim()) queryParams.set("search", search.trim());
        if (gender !== "ALL") queryParams.set("gender", gender);
        if (city !== "ALL") queryParams.set("city", city);
        if (maritalStatus !== "ALL") queryParams.set("maritalStatus", maritalStatus);
        if (journeyStage !== "ALL") queryParams.set("journeyStage", journeyStage);
        if (isVerified !== "ALL") queryParams.set("isVerified", isVerified);
        queryParams.set("page", pageToLoad.toString());
        queryParams.set("pageSize", "15");
        queryParams.set("sortBy", sortBy);
        queryParams.set("sortOrder", sortOrder);

        const res = await fetch(`/api/customers?${queryParams.toString()}`);
        const data = await res.json();
        if (data.customers) {
          setCustomers(data.customers);
          setPagination(data.pagination);
        }
      } catch (err) {
        console.error("Failed to load customers:", err);
      } finally {
        setLoading(false);
      }
    },
    [search, gender, city, maritalStatus, journeyStage, isVerified, sortBy, sortOrder]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchCustomers]);

  const resetFilters = () => {
    setSearch("");
    setGender("ALL");
    setCity("ALL");
    setMaritalStatus("ALL");
    setJourneyStage("ALL");
    setIsVerified("ALL");
    setSortBy("lastContacted");
    setSortOrder("desc");
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 text-[#242522]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E3DC]">
        <div>
          <div className="text-xs uppercase tracking-wider text-[#777970] font-semibold">
            Directory & Portfolios
          </div>
          <h1 className="text-xl font-semibold text-[#242522] tracking-tight mt-0.5">
            Client Management
          </h1>
          <p className="text-xs text-[#777970] mt-0.5">
            Search, filter, and review verified matrimonial biodata profiles ({pagination.total} total).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#777970] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, city, profession, or ID (e.g. TDC-M101)..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#FFFFFF] border border-[#E6E3DC] rounded focus:border-[#315747] focus:ring-1 focus:ring-[#315747]"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
          <div>
            <label className="block text-[10px] font-semibold uppercase text-[#777970] mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-2 py-1.5 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-xs"
            >
              <option value="ALL">All Genders</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-[#777970] mb-1">
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-2 py-1.5 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-xs"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c === "ALL" ? "All Cities" : c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-[#777970] mb-1">
              Journey Stage
            </label>
            <select
              value={journeyStage}
              onChange={(e) => setJourneyStage(e.target.value)}
              className="w-full px-2 py-1.5 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-xs"
            >
              {JOURNEY_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s === "ALL" ? "All Stages" : s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-[#777970] mb-1">
              Verification
            </label>
            <select
              value={isVerified}
              onChange={(e) => setIsVerified(e.target.value)}
              className="w-full px-2 py-1.5 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-xs"
            >
              <option value="ALL">All Status</option>
              <option value="true">Verified Only</option>
              <option value="false">Unverified</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase text-[#777970] mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2 py-1.5 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-xs"
            >
              <option value="lastContacted">Last Contacted</option>
              <option value="name">Name</option>
              <option value="age">Age</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full px-2 py-1.5 bg-[#FFFFFF] border border-[#E6E3DC] rounded text-xs text-[#555750] hover:bg-[#FAF9F6] flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-[#777970]" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customers Data Table */}
      <div className="bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E6E3DC] bg-[#FAF9F6] text-[#777970] font-medium select-none">
                <th className="py-2.5 px-4">Client ID</th>
                <th
                  onClick={() => toggleSort("name")}
                  className="py-2.5 px-4 cursor-pointer hover:text-[#242522]"
                >
                  <div className="flex items-center gap-1">
                    <span>Full Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("age")}
                  className="py-2.5 px-3 cursor-pointer hover:text-[#242522]"
                >
                  <div className="flex items-center gap-1">
                    <span>Age</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-3">City</th>
                <th className="py-2.5 px-4">Profession & Education</th>
                <th className="py-2.5 px-3">Verification</th>
                <th className="py-2.5 px-3">Journey Stage</th>
                <th
                  onClick={() => toggleSort("lastContacted")}
                  className="py-2.5 px-3 cursor-pointer hover:text-[#242522]"
                >
                  <div className="flex items-center gap-1">
                    <span>Last Contact</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE6]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#777970]">
                    Loading client profiles...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#777970]">
                    No clients match the current filter criteria.
                  </td>
                </tr>
              ) : (
                customers.map((cust) => {
                  const age = calculateAge(cust.dateOfBirth);
                  const lastContact = cust.lastContactedAt
                    ? new Date(cust.lastContactedAt).toLocaleDateString()
                    : "Not recorded";

                  return (
                    <tr key={cust.id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-[#777970]">
                        {cust.customerCode}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#EAE7DF] text-[#315747] font-semibold text-[10px] flex items-center justify-center shrink-0">
                            {cust.firstName[0]}
                            {cust.lastName[0]}
                          </div>
                          <div>
                            <Link
                              href={`/customers/${cust.id}`}
                              className="font-medium text-[#242522] hover:text-[#315747] hover:underline"
                            >
                              {cust.firstName} {cust.lastName}
                            </Link>
                            <div className="text-[10px] text-[#888A82]">{cust.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#3A3C36]">{age} yrs</td>
                      <td className="py-3 px-3 text-[#555750]">{cust.city}</td>
                      <td className="py-3 px-4">
                        <div className="text-[#242522] font-medium truncate max-w-[160px]">
                          {cust.designation || cust.highestEducation}
                        </div>
                        <div className="text-[10px] text-[#777970] truncate max-w-[160px]">
                          {cust.degree || cust.highestEducation}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {cust.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#315747] font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#888A82]">Pending</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={cust.journeyStage} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-[#777970] text-[11px]">{lastContact}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          href={`/customers/${cust.id}`}
                          className="text-[11px] font-medium text-[#555750] hover:text-[#242522] hover:underline"
                        >
                          Profile
                        </Link>
                        <Link
                          href={`/recommendations?customerId=${cust.id}`}
                          className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#315747] hover:underline"
                        >
                          <span>Matches</span>
                          <Sparkles className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-[#FAF9F6] border-t border-[#E6E3DC] flex items-center justify-between text-xs text-[#777970]">
          <div>
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
            {pagination.total} profiles
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchCustomers(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1 border border-[#E6E3DC] rounded bg-white hover:bg-[#FAF9F6] disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchCustomers(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1 border border-[#E6E3DC] rounded bg-white hover:bg-[#FAF9F6] disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
