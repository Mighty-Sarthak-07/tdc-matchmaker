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
  const [demoCopied, setDemoCopied] = useState(false);

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
    setDemoCopied(true);
    setTimeout(() => setDemoCopied(false), 2200);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#FFFFFF] text-[#242522] overflow-x-hidden">
      {/* LEFT SIDE: Editorial Photo & Brand Story */}
      <div className="relative w-full md:w-1/2 lg:w-[52%] min-h-[480px] md:min-h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-[#F7F5F0]">
        {/* Background Image Container with Ken Burns Reveal */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 animate-hero-zoom transition-transform duration-1000 ease-out"
          style={{ backgroundImage: "url('/images/login-hero.jpg')" }}
        />

        {/* Soft Warm Editorial Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/92 via-[#FAF8F5]/70 to-[#FAF8F5]/35 z-0 pointer-events-none" />

        {/* Top Branding (Staggered Reveal 1) */}
        <div className="relative z-10 space-y-3.5 animate-reveal-up stagger-1">
          <div className="flex items-center gap-3">
            <div className="transition-transform duration-300 hover:rotate-6">
              <BotanicalBranchIcon className="w-9 h-9" />
            </div>
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

        {/* Middle / Center Editorial Typography (Staggered Reveal 2 & 3) */}
        <div className="relative z-10 max-w-lg my-10 md:my-auto space-y-5">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] leading-[1.18] font-normal text-[#22241F] tracking-tight animate-reveal-up stagger-2">
            Meaningful matches. Real conversations.
          </h1>

          <p className="text-sm sm:text-[15px] leading-relaxed text-[#4A4C44] font-normal max-w-md animate-reveal-up stagger-3">
            A dedicated workspace for matchmakers to manage clients, discover compatible profiles, and create meaningful connections.
          </p>

          {/* Terracotta Accent Line with Smooth Expansion */}
          <div className="h-[2px] bg-[#B76E57] rounded-full animate-line-expand" />

          {/* Subtle Value Prop Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-2 animate-reveal-up stagger-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-xs text-[11px] text-[#4A4C44] border border-[#E0DCD3]/70 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#315747]" />
              125+ Seeded Profiles
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-xs text-[11px] text-[#4A4C44] border border-[#E0DCD3]/70 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B76E57]" />
              Explainable Compatibility
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-xs text-[11px] text-[#4A4C44] border border-[#E0DCD3]/70 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#28493B]" />
              Gemini AI Reasoning
            </span>
          </div>
        </div>

        {/* Bottom Editorial Credit (Staggered Reveal 4) */}
        <div className="relative z-10 hidden sm:flex items-center justify-between text-[11px] text-[#7A7C73] animate-reveal-up stagger-4">
          <span>&copy; {new Date().getFullYear()} TDC Matchmaker. Crafted for relationship architects.</span>
          <span className="font-mono text-[10px] tracking-wider uppercase text-[#8A8C84]">v1.0 &bull; Private Beta</span>
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Form */}
      <div className="w-full md:w-1/2 lg:w-[48%] flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-[#FFFFFF]">
        <div className="w-full max-w-md space-y-6">
          {/* Segmented Mode Switcher (Sign In vs Create Account) */}
          <div className="animate-reveal-up stagger-1">
            <div className="relative p-1 bg-[#F5F3EC] rounded-lg border border-[#E7E4DC] flex items-center">
              <button
                type="button"
                onClick={() => { setMode("signin"); setError(null); }}
                className={`relative z-10 flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-200 text-center cursor-pointer ${
                  mode === "signin"
                    ? "text-[#242522] font-semibold shadow-xs"
                    : "text-[#777970] hover:text-[#242522]"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode("signup"); setError(null); }}
                className={`relative z-10 flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-200 text-center cursor-pointer ${
                  mode === "signup"
                    ? "text-[#242522] font-semibold shadow-xs"
                    : "text-[#777970] hover:text-[#242522]"
                }`}
              >
                Create Account
              </button>
              {/* Sliding Active Pill Indicator */}
              <div
                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md transition-transform duration-250 ease-out shadow-2xs pointer-events-none"
                style={{
                  transform: mode === "signin" ? "translateX(0)" : "translateX(calc(100% + 0px))",
                }}
              />
            </div>
          </div>

          {/* Header Title with Reveal */}
          <div className="animate-reveal-up stagger-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#777970] mb-1.5">
              {mode === "signin" ? "WELCOME BACK" : "JOIN THE TEAM"}
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-[#242522] font-normal tracking-tight">
              {mode === "signin"
                ? "Sign in to your matchmaker account"
                : "Create a matchmaker account"}
            </h2>

            <p className="text-xs sm:text-sm text-[#777970] mt-1.5 leading-relaxed">
              {mode === "signin"
                ? "Access your clients, matches and conversations in one place."
                : "Get onboarded to the matchmaking CRM and candidate decision engine."}
            </p>
          </div>

          {/* Error Message with Fade In */}
          {error && (
            <div className="p-3 bg-[#FDF2EE] border border-[#F5DDD5] rounded-md text-xs text-[#9A4630] leading-relaxed animate-fade-in flex items-start gap-2">
              <span className="font-bold text-sm leading-none">&bull;</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form with Staggered Reveal */}
          <form onSubmit={handleSubmit} className="space-y-4 animate-reveal-up stagger-3">
            {/* Full Name Field (Smooth expand/collapse transition on mode toggle) */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                mode === "signup" ? "max-h-24 opacity-100 mb-4" : "max-h-0 opacity-0 mb-0 pointer-events-none"
              }`}
            >
              <label className="block text-xs font-medium text-[#3A3C36] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8A8C84] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required={mode === "signup"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Priya Nambiar"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#FFFFFF] border border-[#E3E0D8] rounded-md focus:border-[#315747] focus:ring-2 focus:ring-[#315747]/15 placeholder:text-[#9EA098] transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#3A3C36] mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A8C84] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or username"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#FFFFFF] border border-[#E3E0D8] rounded-md focus:border-[#315747] focus:ring-2 focus:ring-[#315747]/15 placeholder:text-[#9EA098] transition-all outline-none"
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
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[#FFFFFF] border border-[#E3E0D8] rounded-md focus:border-[#315747] focus:ring-2 focus:ring-[#315747]/15 placeholder:text-[#9EA098] transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8C84] hover:text-[#242522] transition-colors p-0.5"
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
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    keepSignedIn
                      ? "bg-[#315747] border-[#315747] text-white"
                      : "border-[#C5C2BA] bg-white hover:border-[#8A8C84]"
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
                  className="text-[#315747] hover:underline font-medium transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>

            {/* Submit Button with Tactile Press & Hover Arrow Slide */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full mt-2 py-3 px-4 text-xs sm:text-sm font-medium text-white bg-[#28493B] hover:bg-[#1E392E] rounded-md transition-all duration-200 flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 cursor-pointer btn-press"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{mode === "signin" ? "Sign in" : "Create account"}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5 text-center animate-reveal-up stagger-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EAE7DF]" />
            </div>
            <span className="relative px-3 bg-[#FFFFFF] text-xs text-[#8A8C84]">
              or quick evaluation
            </span>
          </div>

          {/* Bottom Switcher & Quick Demo Pill */}
          <div className="space-y-3.5 text-center text-xs animate-reveal-up stagger-5">
            {/* Quick Demo Pre-fill Pill with Animated Copied State */}
            <div>
              <button
                type="button"
                onClick={handleAutofillDemo}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[11px] transition-all duration-200 border cursor-pointer ${
                  demoCopied
                    ? "bg-[#EDF5F0] border-[#B7D8C4] text-[#1E392E] scale-[1.02]"
                    : "bg-[#F7F5EE] hover:bg-[#ECE8DD] text-[#4A4C44] border-[#DFDBD0]"
                }`}
              >
                {demoCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#315747]" />
                    <span className="font-medium text-[#1E392E]">Credentials Applied! Click Sign In</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#315747]" />
                    <span>
                      Demo Login: <strong className="text-[#242522]">matchmaker@tdc.com</strong> / <strong className="text-[#242522]">password123</strong>
                    </span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[#555750] text-[11px]">
              {mode === "signin" ? (
                <>
                  Need administrator setup?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="font-medium text-[#242522] hover:text-[#315747] underline underline-offset-2 transition-colors"
                  >
                    Create account here.
                  </button>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="font-medium text-[#242522] hover:text-[#315747] underline underline-offset-2 transition-colors"
                  >
                    Sign in to your account.
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
