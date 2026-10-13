"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

interface AppShellProps {
  user: { name: string; email: string; role: string } | null;
  children: React.ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return (
      <main className="min-h-screen w-full flex flex-col bg-white">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-full flex flex-col bg-[#F8F7F4] text-[#242522]">
      <Sidebar user={user} />
      <main className="flex-1 md:pl-64 flex flex-col min-w-0 pt-14 md:pt-0 transition-all duration-300">
        <div className="w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
