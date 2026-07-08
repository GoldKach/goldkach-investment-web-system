"use client";

import * as React from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OOSidebar } from "@/components/onboarding-officer/oo-sidebar";
import { ThemeToggle } from "@/components/front-end/theme-toggle";

export default function OOShell({ user, children }: { user: any; children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <OOSidebar user={user} />
      <SidebarInset>
        <div className="md:ml-[210px] lg:ml-[260px]">
          <header className="sticky top-0 z-10 flex h-14 items-center border-b border-slate-200 dark:border-[#193388]/30 bg-white dark:bg-[#0a0d24] px-4 gap-3">
            <SidebarTrigger />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex-1">
              Onboarding Officer Portal
            </span>
            <ThemeToggle />
          </header>
          <div>{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
