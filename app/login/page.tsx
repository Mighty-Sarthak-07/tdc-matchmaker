"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("matchmaker@tdc.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed. Please check your credentials.");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-center items-center px-4 py-12 text-[#242522]">
      {/* Brand Header */}
      <div className="w-full max-w-sm mb-6 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded bg-[#315747] text-white font-serif font-bold text-sm tracking-widest shadow-sm mb-3">
          TDC
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-[#242522]">
          TDC Matchmaker
        </h1>
        <p className="text-xs text-[#777970] mt-1">
          Professional Matrimonial CRM & Decision Engine
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm bg-[#FFFFFF] border border-[#E6E3DC] rounded-lg shadow-sm p-6 sm:p-7">
        <div className="mb-5 pb-3 border-b border-[#E6E3DC]">
          <h2 className="text-sm font-semibold text-[#242522]">Matchmaker Authentication</h2>
          <p className="text-[11px] text-[#777970] mt-0.5">
            Sign in to access your assigned client portfolios and recommendations.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-[#FDF2EE] border border-[#F5DDD5] rounded text-xs text-[#9A4630]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#3A3C36] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-[#777970] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="matchmaker@tdc.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#FFFFFF] border border-[#E6E3DC] rounded focus:border-[#315747] focus:ring-1 focus:ring-[#315747] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-[#3A3C36]">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-[#777970] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2 text-xs bg-[#FFFFFF] border border-[#E6E3DC] rounded focus:border-[#315747] focus:ring-1 focus:ring-[#315747] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777970] hover:text-[#242522]"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-medium text-white bg-[#315747] hover:bg-[#254437] rounded transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span>Sign in to CRM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Seed Credentials Hint */}
        <div className="mt-5 pt-4 border-t border-[#E6E3DC] bg-[#FAF9F6] -mx-6 -mb-6 p-4 rounded-b-lg">
          <div className="flex items-start gap-2 text-[11px] text-[#555750]">
            <ShieldCheck className="w-4 h-4 text-[#315747] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#242522]">Seeded Matchmaker Account:</span>
              <div className="mt-0.5 font-mono text-[10px] text-[#777970]">
                Email: matchmaker@tdc.com<br />
                Password: password123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
