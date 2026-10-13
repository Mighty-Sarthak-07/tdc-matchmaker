"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, UserPlus } from "lucide-react";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddCustomerModal({ isOpen, onClose, onSuccess }: AddCustomerModalProps) {
  const [mounted, setMounted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("FEMALE");
  const [dateOfBirth, setDateOfBirth] = useState("1998-05-12");
  const [heightCm, setHeightCm] = useState(165);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 98765 00000");
  const [city, setCity] = useState("Mumbai");
  const [maritalStatus, setMaritalStatus] = useState("NEVER_MARRIED");
  const [highestEducation, setHighestEducation] = useState("MASTERS");
  const [designation, setDesignation] = useState("Product Manager");
  const [annualIncome, setAnnualIncome] = useState(25);
  const [diet, setDiet] = useState("VEGETARIAN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        firstName,
        lastName,
        gender,
        dateOfBirth,
        heightCm,
        email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone,
        city,
        state: city === "Mumbai" || city === "Pune" ? "Maharashtra" : city === "Bengaluru" ? "Karnataka" : "Delhi",
        maritalStatus,
        highestEducation,
        designation,
        annualIncome,
        religion: "HINDU",
        motherTongue: "Hindi",
        wantChildren: "YES",
        openToRelocate: "YES",
        openToPets: "YES",
        diet,
      };

      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create client profile.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add client profile.");
    } finally {
      setLoading(false);
    }
  };

  const modalElement = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-[#E8E5DE] rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden text-[#242522] animate-modal-scale" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-[#E8E5DE] flex items-center justify-between bg-[#FAF9F6] shrink-0">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#315747]" />
            <h2 className="text-sm font-semibold text-[#242522]">Add New Matrimonial Client</h2>
          </div>
          <button onClick={onClose} className="p-1 text-[#777970] hover:text-[#242522] rounded btn-press">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-2.5 bg-[#FDF2EE] border border-[#F5DDD5] rounded text-xs text-[#9A4630] shrink-0">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#555750] font-medium mb-1">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Riya"
                className="w-full px-2.5 py-1.5 border border-[#E8E5DE] rounded focus:border-[#315747]"
              />
            </div>
            <div>
              <label className="block text-[#555750] font-medium mb-1">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Mehta"
                className="w-full px-2.5 py-1.5 border border-[#E8E5DE] rounded focus:border-[#315747]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[#555750] font-medium mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-2 py-1.5 border border-[#E8E5DE] rounded"
              >
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
              </select>
            </div>
            <div>
              <label className="block text-[#555750] font-medium mb-1">Date of Birth</label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-2 py-1.5 border border-[#E8E5DE] rounded"
              />
            </div>
            <div>
              <label className="block text-[#555750] font-medium mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-2 py-1.5 border border-[#E8E5DE] rounded"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Delhi">Delhi</option>
                <option value="Pune">Pune</option>
                <option value="Gurgaon">Gurgaon</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#555750] font-medium mb-1">Profession / Title</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-[#E8E5DE] rounded"
              />
            </div>
            <div>
              <label className="block text-[#555750] font-medium mb-1">Education</label>
              <select
                value={highestEducation}
                onChange={(e) => setHighestEducation(e.target.value)}
                className="w-full px-2 py-1.5 border border-[#E8E5DE] rounded"
              >
                <option value="MASTERS">Masters</option>
                <option value="BACHELORS">Bachelors</option>
                <option value="DOCTORATE">Doctorate</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#E8E5DE] shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3.5 py-1.5 border border-[#E8E5DE] rounded text-[#555750] hover:bg-[#FAF9F6] btn-press cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !firstName || !lastName}
              className="px-4 py-1.5 bg-[#2A4D3E] hover:bg-[#203D31] text-white rounded font-medium flex items-center gap-1.5 disabled:opacity-50 btn-press cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Client</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalElement, document.body);
}
