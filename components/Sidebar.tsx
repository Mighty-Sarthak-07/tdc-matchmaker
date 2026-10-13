"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  Send,
  CalendarCheck,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Match Recommendations", href: "/recommendations", icon: Sparkles },
  { label: "Sent Matches", href: "/sent-matches", icon: Send },
  { label: "Follow-ups", href: "/follow-ups", icon: CalendarCheck },
  { label: "Activity Log", href: "/activity-log", icon: Clock },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ user }: { user?: { name: string; email: string; role: string } | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // If on login page, hide sidebar completely
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
    <div className="flex flex-col h-full bg-[#FFFFFF] border-r border-[#E6E3DC] w-64 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-[#E6E3DC] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#315747] text-white flex items-center justify-center font-serif font-bold text-xs tracking-wider">
            TDC
          </div>
          <div>
            <div className="font-semibold text-sm text-[#242522] tracking-tight">TDC Matchmaker</div>
            <div className="text-[11px] text-[#777970] font-normal">Executive CRM & Engine</div>
          </div>
        </div>
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        <div className="px-2 pb-2 text-[10px] font-semibold tracking-wider text-[#91948B] uppercase">
          Workspaces
        </div>
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
                "flex items-center gap-3 px-3 py-2 text-xs font-medium rounded transition-colors",
                isActive
                  ? "bg-[#F2EFE9] text-[#242522] font-semibold"
                  : "text-[#555750] hover:bg-[#F8F7F4] hover:text-[#242522]"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  isActive ? "text-[#315747]" : "text-[#777970]"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User & Session Footer */}
      <div className="p-3 border-t border-[#E6E3DC] bg-[#FAF9F6]">
        <div className="flex items-center justify-between p-2 rounded hover:bg-[#F2EFE9] transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#E0DCD3] text-[#315747] font-semibold text-xs flex items-center justify-center shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "MM"}
            </div>
            <div className="truncate min-w-0">
              <div className="text-xs font-medium text-[#242522] truncate">{user?.name || "Matchmaker"}</div>
              <div className="text-[10px] text-[#777970] truncate">{user?.email || "matchmaker@tdc.com"}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title="Sign out"
            className="p-1.5 text-[#777970] hover:text-[#B76E57] hover:bg-[#FFFFFF] rounded transition-colors shrink-0"
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
      <div className="md:hidden fixed top-0 inset-x-0 h-14 bg-[#FFFFFF] border-b border-[#E6E3DC] px-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#315747] text-white flex items-center justify-center font-serif font-bold text-xs">
            TDC
          </div>
          <span className="font-semibold text-sm text-[#242522]">TDC Matchmaker</span>
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
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50">{navContent}</div>
        </div>
      )}
    </>
  );
}
