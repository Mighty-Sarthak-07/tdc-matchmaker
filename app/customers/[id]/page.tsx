"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
  Sparkles,
  ShieldCheck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Home,
  Clock,
  Plus,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { calculateAge, formatHeight, formatCurrencyLakhs } from "@/lib/utils";

export default function CustomerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"biodata" | "preferences" | "notes" | "activity">("biodata");

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New Note state
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("CALL_OUTCOME");
  const [submittingNote, setSubmittingNote] = useState(false);

  // New Follow-up state
  const [newFollowUpTitle, setNewFollowUpTitle] = useState("");
  const [newFollowUpDate, setNewFollowUpDate] = useState("");
  const [newFollowUpPriority, setNewFollowUpPriority] = useState("MEDIUM");
  const [submittingFollowUp, setSubmittingFollowUp] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await fetch(`/api/customers/${id}`);
        const data = await res.json();
        if (data.customer) {
          setCustomer(data.customer);
          setFormData(data.customer);
        }
      } catch (err) {
        console.error("Failed to load customer profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-[#777970]">
        Loading customer dossier...
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-8 text-center text-xs text-[#9A4630]">
        Customer profile not found.
      </div>
    );
  }

  const age = calculateAge(customer.dateOfBirth);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setSaveMessage(null);
      const res = await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setCustomer(data.customer);
      setIsEditing(false);
      setSaveMessage({ type: "success", text: "Profile successfully updated and persisted." });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: any) {
      setSaveMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setSubmittingNote(true);
      const res = await fetch(`/api/customers/${id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote, noteType }),
      });
      const data = await res.json();
      if (data.success && data.note) {
        setCustomer((prev: any) => ({
          ...prev,
          notes: [data.note, ...prev.notes],
        }));
        setNewNote("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleAddFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFollowUpTitle.trim() || !newFollowUpDate) return;

    try {
      setSubmittingFollowUp(true);
      const res = await fetch(`/api/follow-ups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: id,
          title: newFollowUpTitle,
          dueDate: newFollowUpDate,
          priority: newFollowUpPriority,
        }),
      });
      const data = await res.json();
      if (data.success && data.followUp) {
        setCustomer((prev: any) => ({
          ...prev,
          followUps: [data.followUp, ...prev.followUps],
        }));
        setNewFollowUpTitle("");
        setNewFollowUpDate("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingFollowUp(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 text-[#242522]">
      {/* Top Navigation breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E6E3DC]">
        <Link
          href="/customers"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#777970] hover:text-[#242522] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Client Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setFormData(customer);
                  setIsEditing(false);
                }}
                disabled={saving}
                className="px-3 py-1.5 text-xs font-medium text-[#555750] bg-white border border-[#E6E3DC] rounded hover:bg-[#FAF9F6]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#315747] hover:bg-[#254437] rounded transition-colors"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#242522] bg-white border border-[#E6E3DC] rounded hover:bg-[#FAF9F6] transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#555750]" />
                <span>Edit Profile</span>
              </button>
              <Link
                href={`/recommendations?customerId=${customer.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#315747] hover:bg-[#254437] rounded transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Find Matches</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {saveMessage && (
        <div
          className={`p-3 rounded text-xs flex items-center gap-2 ${
            saveMessage.type === "success"
              ? "bg-[#EBF2EE] border border-[#D4E3DB] text-[#244838]"
              : "bg-[#FDF2EE] border border-[#F5DDD5] text-[#9A4630]"
          }`}
        >
          {saveMessage.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* Profile Header Summary */}
      <div className="p-6 bg-[#FFFFFF] border border-[#E6E3DC] rounded shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#E8E4DA] text-[#315747] font-semibold text-lg flex items-center justify-center shrink-0">
            {customer.firstName[0]}
            {customer.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-[#242522] tracking-tight">
                {customer.firstName} {customer.lastName}
              </h1>
              <span className="font-mono text-xs text-[#777970]">
                ({customer.customerCode})
              </span>
              {customer.isVerified && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium bg-[#EBF2EE] text-[#244838] border border-[#D4E3DB] rounded">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#555750] mt-1">
              <span>{age} years old (DOB: {new Date(customer.dateOfBirth).toLocaleDateString()})</span>
              <span>•</span>
              <span>{formatHeight(customer.heightCm)}</span>
              <span>•</span>
              <span>{customer.city}, {customer.state}</span>
              <span>•</span>
              <span className="capitalize">{customer.gender.toLowerCase()}</span>
            </div>
          </div>
        </div>

        {/* Operational Status Box */}
        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <div className="text-[#777970] text-[10px] uppercase font-semibold">
              Current Journey Stage
            </div>
            <div className="mt-0.5">
              <StatusBadge status={customer.journeyStage} size="md" />
            </div>
          </div>
          <div className="pl-3 border-l border-[#E6E3DC] text-right text-xs">
            <div className="text-[#777970] text-[10px] uppercase font-semibold">
              Completeness
            </div>
            <div className="text-base font-semibold text-[#315747]">
              {customer.profileCompleteness}%
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-[#E6E3DC] text-xs font-medium space-x-6">
        <button
          onClick={() => setActiveTab("biodata")}
          className={`pb-2.5 transition-colors ${
            activeTab === "biodata"
              ? "border-b-2 border-[#315747] text-[#315747] font-semibold"
              : "text-[#777970] hover:text-[#242522]"
          }`}
        >
          Personal & Cultural Biodata
        </button>
        <button
          onClick={() => setActiveTab("preferences")}
          className={`pb-2.5 transition-colors ${
            activeTab === "preferences"
              ? "border-b-2 border-[#315747] text-[#315747] font-semibold"
              : "text-[#777970] hover:text-[#242522]"
          }`}
        >
          Partner Preferences
        </button>
        <button
          onClick={() => setActiveTab("notes")}
          className={`pb-2.5 transition-colors ${
            activeTab === "notes"
              ? "border-b-2 border-[#315747] text-[#315747] font-semibold"
              : "text-[#777970] hover:text-[#242522]"
          }`}
        >
          Consultation Notes & Follow-ups ({customer.notes?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`pb-2.5 transition-colors ${
            activeTab === "activity"
              ? "border-b-2 border-[#315747] text-[#315747] font-semibold"
              : "text-[#777970] hover:text-[#242522]"
          }`}
        >
          Sent Matches & Activity Log
        </button>
      </div>

      {/* Tab 1: Personal & Cultural Biodata */}
      {activeTab === "biodata" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section A: Education & Career */}
          <div className="p-5 bg-[#FFFFFF] border border-[#E6E3DC] rounded space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E6E3DC]">
              <GraduationCap className="w-4 h-4 text-[#315747]" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#777970]">
                Education & Career
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] text-[#777970] font-semibold uppercase">
                  Highest Education
                </label>
                {isEditing ? (
                  <select
                    value={formData.highestEducation || ""}
                    onChange={(e) => setFormData({ ...formData, highestEducation: e.target.value })}
                    className="w-full mt-1 px-2 py-1 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-xs"
                  >
                    <option value="DOCTORATE">Doctorate</option>
                    <option value="MASTERS">Masters</option>
                    <option value="BACHELORS">Bachelors</option>
                    <option value="OTHER">Other</option>
                  </select>
                ) : (
                  <div className="font-medium text-[#242522] mt-0.5">
                    {customer.highestEducation}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] text-[#777970] font-semibold uppercase">
                  Degree / Specialization
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.degree || ""}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full mt-1 px-2 py-1 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-xs"
                  />
                ) : (
                  <div className="font-medium text-[#242522] mt-0.5">
                    {customer.degree || "Not specified"}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] text-[#777970] font-semibold uppercase">
                  Alma Mater
                </label>
                <div className="font-medium text-[#242522] mt-0.5">
                  {customer.undergraduateCollege || "Not specified"}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#777970] font-semibold uppercase">
                  Annual Compensation
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.annualIncome || ""}
                    onChange={(e) => setFormData({ ...formData, annualIncome: parseFloat(e.target.value) })}
                    className="w-full mt-1 px-2 py-1 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-xs"
                  />
                ) : (
                  <div className="font-medium text-[#242522] mt-0.5">
                    {formatCurrencyLakhs(customer.annualIncome)}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] text-[#777970] font-semibold uppercase">
                  Designation
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.designation || ""}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full mt-1 px-2 py-1 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-xs"
                  />
                ) : (
                  <div className="font-medium text-[#242522] mt-0.5">
                    {customer.designation || "Not disclosed"}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] text-[#777970] font-semibold uppercase">
                  Current Organization
                </label>
                <div className="font-medium text-[#242522] mt-0.5">
                  {customer.currentCompany || "Confidential"}
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Family & Cultural Background */}
          <div className="p-5 bg-[#FFFFFF] border border-[#E6E3DC] rounded space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E6E3DC]">
              <Home className="w-4 h-4 text-[#315747]" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#777970]">
                Family & Cultural Background
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] text-[#777970] font-semibold uppercase">
                  Religion & Community
                </label>
                <div className="font-medium text-[#242522] mt-0.5">
                  {customer.religion} {customer.caste ? `• ${customer.caste}` : ""}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#777970] font-semibold uppercase">
                  Mother Tongue
                </label>
                <div className="font-medium text-[#242522] mt-0.5">
                  {customer.motherTongue}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#777970] font-semibold uppercase">
                  Family Values
                </label>
                {isEditing ? (
                  <select
                    value={formData.familyValues || "MODERATE"}
                    onChange={(e) => setFormData({ ...formData, familyValues: e.target.value })}
                    className="w-full mt-1 px-2 py-1 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-xs"
                  >
                    <option value="TRADITIONAL">Traditional</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="LIBERAL">Liberal</option>
                  </select>
                ) : (
                  <div className="font-medium text-[#242522] mt-0.5">
                    {customer.familyValues || "Moderate"}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] text-[#777970] font-semibold uppercase">
                  Family Structure
                </label>
                <div className="font-medium text-[#242522] mt-0.5">
                  {customer.familyType || "Nuclear"}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#777970] font-semibold uppercase">
                  Father's Occupation
                </label>
                <div className="font-medium text-[#242522] mt-0.5">
                  {customer.fatherOccupation || "Not specified"}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#777970] font-semibold uppercase">
                  Siblings
                </label>
                <div className="font-medium text-[#242522] mt-0.5">
                  {customer.siblingsCount} sibling(s)
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Lifestyle & Goals */}
          <div className="p-5 bg-[#FFFFFF] border border-[#E6E3DC] rounded space-y-4 md:col-span-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E6E3DC]">
              <Heart className="w-4 h-4 text-[#315747]" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#777970]">
                Lifestyle & Relationship Goals
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-[10px] text-[#777970] font-semibold uppercase">
                  Want Children
                </label>
                {isEditing ? (
                  <select
                    value={formData.wantChildren || "YES"}
                    onChange={(e) => setFormData({ ...formData, wantChildren: e.target.value })}
                    className="w-full mt-1 px-2 py-1 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-xs"
                  >
                    <option value="YES">Yes</option>
                    <option value="MAYBE">Maybe</option>
                    <option value="NO">No</option>
                  </select>
                ) : (
                  <div className="font-medium text-[#242522] mt-0.5">
                    {customer.wantChildren}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] text-[#777970] font-semibold uppercase">
                  Open to Relocate
                </label>
                {isEditing ? (
                  <select
                    value={formData.openToRelocate || "YES"}
                    onChange={(e) => setFormData({ ...formData, openToRelocate: e.target.value })}
                    className="w-full mt-1 px-2 py-1 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-xs"
                  >
                    <option value="YES">Yes</option>
                    <option value="MAYBE">Maybe</option>
                    <option value="NO">No</option>
                  </select>
                ) : (
                  <div className="font-medium text-[#242522] mt-0.5">
                    {customer.openToRelocate}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] text-[#777970] font-semibold uppercase">
                  Diet Preference
                </label>
                {isEditing ? (
                  <select
                    value={formData.diet || "VEGETARIAN"}
                    onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                    className="w-full mt-1 px-2 py-1 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-xs"
                  >
                    <option value="VEGETARIAN">Vegetarian</option>
                    <option value="EGGETARIAN">Eggetarian</option>
                    <option value="NON_VEGETARIAN">Non-Vegetarian</option>
                    <option value="VEGAN">Vegan</option>
                    <option value="JAIN">Jain</option>
                  </select>
                ) : (
                  <div className="font-medium text-[#242522] mt-0.5">
                    {customer.diet.replace("_", " ")}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] text-[#777970] font-semibold uppercase">
                  Marriage Timeline
                </label>
                <div className="font-medium text-[#242522] mt-0.5">
                  {customer.marriageTimeline ? customer.marriageTimeline.replace(/_/g, " ") : "6 to 12 Months"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Partner Preferences */}
      {activeTab === "preferences" && (
        <div className="p-6 bg-[#FFFFFF] border border-[#E6E3DC] rounded space-y-6">
          <div className="pb-3 border-b border-[#E6E3DC] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#242522]">
                Mandated Partner Criteria & Dealbreakers
              </h2>
              <p className="text-xs text-[#777970] mt-0.5">
                Stated client preferences utilized in Phase A (Eligibility) and Phase B (Reciprocal Scoring).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 bg-[#FAF9F6] border border-[#E6E3DC] rounded space-y-3">
              <div className="text-[11px] font-semibold uppercase text-[#777970]">
                Demographics & Age Window
              </div>
              <div>
                <span className="text-[#555750]">Acceptable Age: </span>
                <span className="font-semibold text-[#242522]">
                  {customer.partnerPreference?.minAge || 24} – {customer.partnerPreference?.maxAge || 34} years
                </span>
              </div>
              <div>
                <span className="text-[#555750]">Height Tolerance: </span>
                <span className="font-semibold text-[#242522]">
                  {customer.partnerPreference?.minHeightCm || 155} cm – {customer.partnerPreference?.maxHeightCm || 185} cm
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#FAF9F6] border border-[#E6E3DC] rounded space-y-3">
              <div className="text-[11px] font-semibold uppercase text-[#777970]">
                Location & Education Scope
              </div>
              <div>
                <span className="text-[#555750]">Preferred Cities: </span>
                <span className="font-semibold text-[#242522]">
                  {customer.partnerPreference?.preferredCities || customer.city}
                </span>
              </div>
              <div>
                <span className="text-[#555750]">Education Standard: </span>
                <span className="font-semibold text-[#242522]">
                  {customer.partnerPreference?.preferredEducation || "Bachelors / Masters"}
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#FAF9F6] border border-[#E6E3DC] rounded space-y-3">
              <div className="text-[11px] font-semibold uppercase text-[#9A4630]">
                Strict Dealbreakers
              </div>
              <div className="text-[#555750]">
                Candidates violating these hard requirements are excluded in Phase A:
              </div>
              <div className="font-semibold text-[#242522]">
                {customer.partnerPreference?.dealbreakers || "None specified"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Consultation Notes & Follow-ups */}
      {activeTab === "notes" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Internal Notes Section */}
          <div className="p-5 bg-[#FFFFFF] border border-[#E6E3DC] rounded space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#777970]">
              Internal Matchmaker Notes ({customer.notes?.length || 0})
            </h2>

            {/* Note creation form */}
            <form onSubmit={handleAddNote} className="space-y-2.5">
              <textarea
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log call outcome, client sentiment, or preference update..."
                className="w-full p-2.5 text-xs bg-[#FAF9F6] border border-[#E6E3DC] rounded focus:border-[#315747] focus:ring-1 focus:ring-[#315747]"
              />
              <div className="flex items-center justify-between">
                <select
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value)}
                  className="px-2 py-1 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-xs"
                >
                  <option value="CALL_OUTCOME">Call Outcome</option>
                  <option value="MEETING_SUMMARY">Meeting Summary</option>
                  <option value="PREFERENCE_UPDATE">Preference Update</option>
                  <option value="GENERAL">General Note</option>
                </select>
                <button
                  type="submit"
                  disabled={submittingNote || !newNote.trim()}
                  className="px-3 py-1 text-xs font-medium text-white bg-[#315747] hover:bg-[#254437] rounded transition-colors disabled:opacity-50"
                >
                  {submittingNote ? "Adding..." : "Log Note"}
                </button>
              </div>
            </form>

            {/* Notes List */}
            <div className="divide-y divide-[#EFECE6] pt-2">
              {customer.notes?.length === 0 ? (
                <div className="py-4 text-center text-xs text-[#777970]">
                  No consultation notes logged yet.
                </div>
              ) : (
                customer.notes?.map((n: any) => (
                  <div key={n.id} className="py-3 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[#777970]">
                      <span className="font-semibold text-[#315747]">
                        {n.author?.name || "Matchmaker"} • {n.noteType.replace("_", " ")}
                      </span>
                      <span className="text-[10px]">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[#242522] leading-relaxed">{n.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Follow-up Tasks Section */}
          <div className="p-5 bg-[#FFFFFF] border border-[#E6E3DC] rounded space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#777970]">
              Scheduled Follow-up Tasks ({customer.followUps?.length || 0})
            </h2>

            {/* Schedule Follow-up Form */}
            <form onSubmit={handleAddFollowUp} className="space-y-2.5">
              <input
                type="text"
                value={newFollowUpTitle}
                onChange={(e) => setNewFollowUpTitle(e.target.value)}
                placeholder="Follow-up title (e.g. Discuss shortlist feedback)..."
                className="w-full px-2.5 py-1.5 text-xs bg-[#FAF9F6] border border-[#E6E3DC] rounded focus:border-[#315747]"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={newFollowUpDate}
                  onChange={(e) => setNewFollowUpDate(e.target.value)}
                  className="px-2 py-1 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-xs"
                />
                <select
                  value={newFollowUpPriority}
                  onChange={(e) => setNewFollowUpPriority(e.target.value)}
                  className="px-2 py-1 bg-[#FAF9F6] border border-[#E6E3DC] rounded text-xs"
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  disabled={submittingFollowUp || !newFollowUpTitle.trim() || !newFollowUpDate}
                  className="px-3 py-1 text-xs font-medium text-white bg-[#315747] hover:bg-[#254437] rounded transition-colors disabled:opacity-50"
                >
                  {submittingFollowUp ? "Scheduling..." : "Schedule Follow-up"}
                </button>
              </div>
            </form>

            {/* Follow-up items */}
            <div className="divide-y divide-[#EFECE6] pt-2">
              {customer.followUps?.length === 0 ? (
                <div className="py-4 text-center text-xs text-[#777970]">
                  No pending follow-ups for this customer.
                </div>
              ) : (
                customer.followUps?.map((fu: any) => (
                  <div key={fu.id} className="py-2.5 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-medium text-[#242522]">{fu.title}</div>
                      <div className="text-[10px] text-[#777970]">
                        Due: {new Date(fu.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <StatusBadge status={fu.priority} size="sm" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Sent Matches & Activity Log */}
      {activeTab === "activity" && (
        <div className="p-6 bg-[#FFFFFF] border border-[#E6E3DC] rounded space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#777970]">
            Chronological Audit History & Sent Match Interactions
          </h2>

          <div className="divide-y divide-[#EFECE6]">
            {customer.activityLogs?.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#777970]">
                No operational activity recorded for this profile yet.
              </div>
            ) : (
              customer.activityLogs?.map((log: any) => (
                <div key={log.id} className="py-3 text-xs flex items-start justify-between">
                  <div>
                    <div className="font-medium text-[#242522]">{log.title}</div>
                    {log.details && (
                      <div className="text-[11px] text-[#555750] mt-0.5">{log.details}</div>
                    )}
                  </div>
                  <div className="text-[10px] text-[#888A82]">
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
