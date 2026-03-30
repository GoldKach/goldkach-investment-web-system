"use client";

import * as React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AgentSidebar } from "@/components/agent/agent-sidebar";
import { ThemeToggle } from "@/components/front-end/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { StaffMember } from "@/actions/staff";

interface AgentShellProps {
  staff: StaffMember;
  activeClientCount: number;
  children: React.ReactNode;
}

export default function AgentShell({ staff, activeClientCount, children }: AgentShellProps) {
  return (
    <SidebarProvider>
      <AgentSidebar staff={staff} activeClientCount={activeClientCount} />
      <SidebarInset>
        <div className="md:ml-[210px] lg:ml-[260px]">
          <header className="sticky top-0 z-10 flex h-14 items-center border-b border-slate-200 dark:border-[#2B2F77]/30 bg-white dark:bg-[#0a0d24] px-4 gap-3">
            <SidebarTrigger />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex-1">
              Agent Portal
            </span>
            <ThemeToggle />
          </header>
          <div className="p-6">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
