"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, LogOut, Settings } from "lucide-react";
import { logoutUser } from "@/actions/auth";
import { AgentProfileCard } from "@/components/agent/agent-profile-card";
import type { StaffMember } from "@/actions/staff";

const navLinks = [
  { title: "Overview", url: "/agent", icon: LayoutDashboard },
  { title: "My Clients", url: "/agent", icon: Users },
  { title: "Settings", url: "/agent/settings", icon: Settings },
];

interface AgentSidebarProps {
  staff: StaffMember;
  activeClientCount: number;
}

export function AgentSidebar({ staff, activeClientCount }: AgentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutUser();
      router.replace("/login");
    });
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200 dark:border-[#2B2F77]/30 bg-white dark:bg-[#0a0d24] [&_[data-sidebar=sidebar]]:bg-white [&_[data-sidebar=sidebar]]:dark:bg-[#0a0d24]"
    >
      {/* Logo */}
      <SidebarHeader className="border-b border-slate-100 dark:border-[#2B2F77]/20 px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="GoldKach" className="hover:bg-transparent active:bg-transparent">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2B2F77] dark:bg-[#3B82F6]/20 border border-[#2B2F77]/20 dark:border-[#3B82F6]/30 shrink-0">
                  <Image
                    src="/logos/GoldKach-Logo-New-3.png"
                    width={28}
                    height={28}
                    alt="GoldKach"
                    className="rounded"
                  />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                    GOLDKACH
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 tracking-wide">
                    Agent Portal
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarMenu className="space-y-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.url || pathname.startsWith(link.url + "/");
              return (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={link.title}
                    className={`h-9 rounded-lg px-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#2B2F77]/10 dark:bg-[#3B82F6]/15 text-[#2B2F77] dark:text-[#3B82F6] font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2B2F77]/20 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Link href={link.url}>
                      <link.icon className="w-4 h-4 shrink-0" />
                      <span>{link.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-slate-100 dark:border-[#2B2F77]/20 px-3 py-3 space-y-2">
        <AgentProfileCard staff={staff} activeClientCount={activeClientCount} />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="h-9 rounded-lg text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-700 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>{isLoggingOut ? "Logging out…" : "Log out"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
