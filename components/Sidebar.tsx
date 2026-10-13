"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Heart,
  Send,
  Calendar,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Botanical Leaf Icon matching the reference logo in terracotta
 */
function BotanicalBranchIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 40C16 32 23 20 36 10"
        stroke="#B76E57"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M36 10C35 15 31 18 26 18C28 13 32 10 36 10Z" fill="#B76E57" />
      <path d="M27 19C24 23 19 25 14 23C17 19 22 18 27 19Z" fill="#B76E57" />
      <path d="M31 15C33 20 31 26 27 28C26 23 28 17 31 15Z" fill="#B76E57" />
      <path d="M22 26C18 29 14 30 10 27C13 24 18 24 22 26Z" fill="#B76E57" />
      <path d="M25 24C27 28 26 34 22 36C21 31 23 26 25 24Z" fill="#B76E57" />
      <path d="M18 33C14 36 11 36 8 33C11 30 15 31 18 33Z" fill="#B76E57" />
    </svg>
  );
}

const NAV_ITEMS = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Customers", href: "/customers", icon: User },
  { label: "Match Recommendations", href: "/recommendations", icon: Heart },
  { label: "Sent Matches", href: "/sent-matches", icon: Send },
  { label: "Follow-ups", href: "/follow-ups", icon: Calendar },
  { label: "Activity Log", href: "/activity-log", icon: Clock },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ user }: { user?: { name: string; email: string; role: string } | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  if (pathname === "/login") {
    return null;
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error(e);
      setLoggingOut(false);
    }
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#FAF9F6] border-r border-[#E8E5DE] w-64 select-none justify-between">
      {/* Top Part: Brand + Nav */}
      <div>
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center gap-3">
          <BotanicalBranchIcon className="w-8 h-8 shrink-0" />
          <div className="leading-tight">
            <div className="font-serif font-bold text-base text-[#242522] tracking-wide">
              TDC
            </div>
            <div className="font-serif text-sm text-[#242522] tracking-wide">
              Matchmaker
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="py-2 px-3.5 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/" || pathname === "/overview"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-2.5 text-xs font-medium rounded-lg transition-colors btn-press cursor-pointer",
                  isActive
                    ? "bg-[#EAE5DC] text-[#242522] font-semibold shadow-xs"
                    : "text-[#555750] hover:bg-[#F2EFE8] hover:text-[#242522]"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive ? "text-[#242522]" : "text-[#777970]"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Part: Brand Card & Account Profile */}
      <div className="p-3.5 space-y-3">
        {/* Editorial Decorative Card matching screenshot */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#EAE5DC]/80 via-[#F3EFE8]/90 to-[#EAE5DC]/60 border border-[#DFDAD0] p-4">
          <div className="relative z-10 space-y-2">
            <div className="w-6 h-6 rounded-full bg-[#D8CFBF] flex items-center justify-center text-[#B76E57]">
              <BotanicalBranchIcon className="w-4 h-4" />
            </div>
            <div className="font-serif text-xs font-semibold text-[#242522] leading-snug">
              Building meaningful connections
            </div>
            <div className="text-[10px] text-[#777970] font-medium tracking-wider">
              People &bull; Perspective &bull; Possibilities
            </div>
          </div>
          {/* Subtle floral silhouette background */}
          <div className="absolute right-0 bottom-0 w-24 h-24 opacity-15 pointer-events-none transform translate-x-3 translate-y-3">
            <BotanicalBranchIcon className="w-full h-full" />
          </div>
        </div>

        {/* User Account / Logout row */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#E8E5DE] shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#E5DFD4] text-[#315747] font-semibold text-xs flex items-center justify-center shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "SK"}
            </div>
            <div className="truncate min-w-0">
              <div className="text-xs font-medium text-[#242522] truncate">
                {user?.name || "Sarthak K."}
              </div>
              <div className="text-[10px] text-[#777970] truncate">
                Matchmaker
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title="Sign out"
            className="p-1.5 text-[#777970] hover:text-[#B76E57] hover:bg-[#FAF9F6] rounded transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col shrink-0 fixed inset-y-0 left-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 bg-[#FAF9F6] border-b border-[#E8E5DE] px-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <BotanicalBranchIcon className="w-6 h-6" />
          <span className="font-serif font-bold text-sm text-[#242522]">TDC Matchmaker</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#555750] hover:text-[#242522]"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex animate-fade-in">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50 h-full animate-slide-in shadow-2xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
