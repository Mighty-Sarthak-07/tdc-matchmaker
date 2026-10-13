"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Mail,
  ShieldCheck,
  Check,
} from "lucide-react";

/**
 * Botanical Leaf Icon matching the reference logo in terracotta
 */
function BotanicalBranchIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Central curved stem */}
      <path
        d="M12 40C16 32 23 20 36 10"
        stroke="#B76E57"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Leaves */}
      <path
        d="M36 10C35 15 31 18 26 18C28 13 32 10 36 10Z"
        fill="#B76E57"
      />
      <path
        d="M27 19C24 23 19 25 14 23C17 19 22 18 27 19Z"
        fill="#B76E57"
      />
      <path
        d="M31 15C33 20 31 26 27 28C26 23 28 17 31 15Z"
        fill="#B76E57"
      />
      <path
        d="M22 26C18 29 14 30 10 27C13 24 18 24 22 26Z"
        fill="#B76E57"
      />
      <path
        d="M25 24C27 28 26 34 22 36C21 31 23 26 25 24Z"
        fill="#B76E57"
      />
      <path
        d="M18 33C14 36 11 36 8 33C11 30 15 31 18 33Z"
        fill="#B76E57"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("matchmaker@tdc.com");
  const [password, setPassword] = useState("password123");
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === "signin" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        mode === "signin"
          ? { email, password }
          : { name: name.trim() || "Matchmaker", email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please verify your details.");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutofillDemo = () => {
    setEmail("matchmaker@tdc.com");
    setPassword("password123");
    setMode("signin");
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#FFFFFF] text-[#242522]">
      {/* LEFT SIDE: Editorial Photo & Brand Story */}
      <div className="relative w-full md:w-1/2 lg:w-[52%] min-h-[460px] md:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-[#F7F5F0]">
        {/* Background Image Container */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url('/images/login-hero.jpg')" }}
        />

        {/* Soft Warm Gradient Overlay for Editorial Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/90 via-[#FAF8F5]/65 to-[#FAF8F5]/30 z-0 pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <BotanicalBranchIcon className="w-9 h-9" />
            <div>
              <div className="font-serif font-bold text-lg text-[#242522] tracking-wide leading-tight">
                TDC
              </div>
              <div className="font-serif text-lg text-[#242522] tracking-wide leading-tight">
                Matchmaker
              </div>
            </div>
          </div>

          <div className="text-[10px] sm:text-[11px] font-medium tracking-[0.22em] text-[#7A7C73] uppercase">
            PEOPLE &bull; PERSPECTIVE &bull; POSSIBILITIES
          </div>
        </div>

        {/* Middle / Center Editorial Typography */}
        <div className="relative z-10 max-w-lg my-12 md:my-auto space-y-5">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] leading-[1.18] font-normal text-[#22241F] tracking-tight">
            Meaningful matches. Real conversations.
          </h1>

          <p className="text-sm sm:text-[15px] leading-relaxed text-[#4A4C44] font-normal max-w-md">
            A dedicated workspace for matchmakers to manage clients, discover compatible profiles, and create meaningful connections.
          </p>

          {/* Terracotta Accent Line */}
          <div className="w-14 h-[2px] bg-[#B76E57] rounded-full" />
        </div>

        {/* Bottom subtle credit / spacing */}
        <div className="relative z-10 hidden sm:block text-[11px] text-[#7A7C73]">
          &copy; {new Date().getFullYear()} TDC Matchmaker. Crafted for professional matchmakers.
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Form */}
      <div className="w-full md:w-1/2 lg:w-[48%] flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-[#FFFFFF]">
        <div className="w-full max-w-md space-y-7">
          {/* Header Title */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#777970] mb-2">
              {mode === "signin" ? "WELCOME BACK" : "JOIN THE TEAM"}
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-[#242522] font-normal tracking-tight">
              {mode === "signin"
                ? "Sign in to your matchmaker account"
                : "Create a matchmaker account"}
            </h2>

            <p className="text-xs sm:text-sm text-[#777970] mt-2 leading-relaxed">
              {mode === "signin"
                ? "Access your clients, matches and conversations in one place."
                : "Get onboarded to the matchmaking CRM and candidate decision engine."}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-[#FDF2EE] border border-[#F5DDD5] rounded-md text-xs text-[#9A4630] leading-relaxed">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-medium text-[#3A3C36] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8A8C84] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Priya Nambiar"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#FFFFFF] border border-[#E3E0D8] rounded-md focus:border-[#315747] focus:ring-1 focus:ring-[#315747] placeholder:text-[#9EA098] transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#3A3C36] mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8A8C84] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or username"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#FFFFFF] border border-[#E3E0D8] rounded-md focus:border-[#315747] focus:ring-1 focus:ring-[#315747] placeholder:text-[#9EA098] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#3A3C36] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A8C84] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[#FFFFFF] border border-[#E3E0D8] rounded-md focus:border-[#315747] focus:ring-1 focus:ring-[#315747] placeholder:text-[#9EA098] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8C84] hover:text-[#242522] transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox and Forgot Password Row */}
            <div className="flex items-center justify-between pt-0.5 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setKeepSignedIn(!keepSignedIn)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    keepSignedIn
                      ? "bg-[#315747] border-[#315747] text-white"
                      : "border-[#C5C2BA] bg-white"
                  }`}
                >
                  {keepSignedIn && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-[#4A4C44]">Keep me signed in</span>
              </label>

              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => alert("Please contact your TDC administrator to reset your credentials.")}
                  className="text-[#315747] hover:underline font-medium"
                >
                  Forgot password?
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 text-xs sm:text-sm font-medium text-white bg-[#28493B] hover:bg-[#1E392E] rounded-md transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{mode === "signin" ? "Sign in" : "Create account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EAE7DF]" />
            </div>
            <span className="relative px-3 bg-[#FFFFFF] text-xs text-[#8A8C84]">
              or
            </span>
          </div>

          {/* Bottom Switcher & Admin Contact */}
          <div className="space-y-4 text-center text-xs">
            {mode === "signin" ? (
              <p className="text-[#555750]">
                Need access?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-semibold text-[#242522] hover:text-[#315747] underline underline-offset-2"
                >
                  Contact your administrator or create account.
                </button>
              </p>
            ) : (
              <p className="text-[#555750]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="font-semibold text-[#242522] hover:text-[#315747] underline underline-offset-2"
                >
                  Sign in here.
                </button>
              </p>
            )}

            {/* Quick Demo Pre-fill Pill */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F2EC] hover:bg-[#EAE7DE] text-[#4A4C44] text-[11px] transition-colors border border-[#E0DCD3]"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#315747]" />
                <span>
                  Demo Login: <strong className="text-[#242522]">matchmaker@tdc.com</strong> / <strong className="text-[#242522]">password123</strong>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
