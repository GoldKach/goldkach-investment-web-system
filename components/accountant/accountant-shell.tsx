"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader,
  SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarRail, SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut, BarChart2, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/front-end/theme-toggle";
import { logoutUser } from "@/actions/auth";

const navLinks = [
  { title: "Portfolio Summary",   url: "/accountant",           icon: LayoutDashboard },
  { title: "Financial Analytics", url: "/accountant/analytics", icon: BarChart2 },
  { title: "Reports",             url: "/accountant/reports",   icon: FileText },
];

function AccountantSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, startTransition] = useTransition();

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.name || "Accountant";
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutUser();
      router.replace("/login");
    });
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200 dark:border-[#1e2d5a] bg-white dark:bg-[#0a0d24] [&_[data-sidebar=sidebar]]:bg-white [&_[data-sidebar=sidebar]]:dark:bg-[#0a0d24]">
      <SidebarHeader className="border-b border-slate-100 dark:border-[#1e2d5a] px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="GoldKach" className="hover:bg-transparent active:bg-transparent">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2B2F77] shrink-0">
                  <Image src="/logos/GoldKach-Logo-New-3.png" width={28} height={28} alt="GoldKach" className="rounded" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">GOLDKACH</span>
                  <span className="text-[10px] text-slate-400 tracking-wide">Accountant Portal</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarMenu className="space-y-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.url;
              return (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton asChild tooltip={link.title} className={`h-9 rounded-lg px-3 text-sm font-medium transition-colors ${isActive ? "bg-[#2B2F77]/10 dark:bg-[#3B82F6]/15 text-[#2B2F77] dark:text-[#3B82F6] font-semibold" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2B2F77]/20"}`}>
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

      <SidebarFooter className="border-t border-slate-100 dark:border-[#1e2d5a] px-3 py-3 space-y-2">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-slate-50 dark:bg-[#2B2F77]/15 border border-slate-200 dark:border-[#1e2d5a]">
          <Avatar className="h-7 w-7 rounded-lg shrink-0">
            <AvatarImage src={user?.imageUrl || ""} alt={displayName} className="rounded-lg object-cover" />
            <AvatarFallback className="rounded-lg bg-[#2B2F77] text-white text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{displayName}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} disabled={isLoggingOut} className="h-9 rounded-lg text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors disabled:opacity-50">
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

export default function AccountantShell({ user, children }: { user: any; children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AccountantSidebar user={user} />
      <SidebarInset>
        <div className="md:ml-[210px] lg:ml-[260px]">
          <header className="sticky top-0 z-10 flex h-14 items-center border-b border-slate-200 dark:border-[#1e2d5a] bg-white dark:bg-[#0a0d24] px-4 gap-3">
            <SidebarTrigger />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex-1">Accountant Portal</span>
            <ThemeToggle />
          </header>
          <div className="p-6">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
