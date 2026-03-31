"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub,
  SidebarMenuSubButton, SidebarMenuSubItem, SidebarRail,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRight, ChevronsUpDown, Users, Wallet, CheckSquare,
  LayoutDashboard, LogOut, ArrowDownCircle, ArrowUpCircle,
} from "lucide-react";
import { logoutUser } from "@/actions/auth";

const navLinks = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    items: [{ title: "Dashboard", url: "/cr" }],
  },
  {
    title: "Clients",
    icon: Users,
    items: [
      { title: "All Clients", url: "/cr/clients" },
      { title: "Onboarding Approvals", url: "/cr/approvals" },
    ],
  },
  {
    title: "Wallets",
    icon: Wallet,
    items: [
      { title: "Master Wallets", url: "/cr/master-wallets" },
      { title: "Portfolio Wallets", url: "/cr/portfolio-wallets" },
    ],
  },
  {
    title: "Transactions",
    icon: ArrowDownCircle,
    items: [
      { title: "Deposits", url: "/cr/deposits" },
      { title: "Withdrawals", url: "/cr/withdrawals" },
    ],
  },
];

export function CRSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutUser();
      router.replace("/login");
    });
  };

  const initials =
    (user?.firstName?.[0] || user?.name?.[0] || "C").toUpperCase() +
    (user?.lastName?.[0] || "").toUpperCase();
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.name || "CR Staff";

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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2B2F77] shrink-0">
                  <Image src="/logos/GoldKach-Logo-New-3.png" width={28} height={28} alt="GoldKach" className="rounded" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">GOLDKACH</span>
                  <span className="text-[10px] text-slate-400 tracking-wide">Client Relations</span>
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
            {navLinks.map((section) => {
              const isActive = section.items.some(
                (sub) => pathname === sub.url || pathname.startsWith(sub.url + "/")
              );
              return (
                <Collapsible key={section.title} asChild defaultOpen={isActive} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={section.title}
                        className="h-9 rounded-lg px-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2B2F77]/20 hover:text-slate-900 dark:hover:text-white data-[state=open]:text-[#2B2F77] dark:data-[state=open]:text-[#3B82F6] transition-colors"
                      >
                        <section.icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{section.title}</span>
                        <ChevronRight className="ml-auto w-3.5 h-3.5 shrink-0 text-slate-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-3 border-l border-slate-200 dark:border-[#2B2F77]/30 pl-3 mt-0.5 space-y-0.5">
                        {section.items.map((sub) => {
                          const isSubActive = pathname === sub.url || (sub.url !== "/cr" && pathname.startsWith(sub.url + "/"));
                          return (
                            <SidebarMenuSubItem key={sub.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={`h-8 rounded-lg text-xs font-medium transition-colors ${
                                  isSubActive
                                    ? "bg-[#2B2F77]/10 dark:bg-[#3B82F6]/15 text-[#2B2F77] dark:text-[#3B82F6] font-semibold"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2B2F77]/15"
                                }`}
                              >
                                <Link href={sub.url}>
                                  {isSubActive && <span className="w-1 h-1 rounded-full bg-[#2B2F77] dark:bg-[#3B82F6] shrink-0 mr-1" />}
                                  <span>{sub.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-slate-100 dark:border-[#2B2F77]/20 px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="h-11 rounded-xl px-2.5 bg-slate-50 dark:bg-[#2B2F77]/15 border border-slate-200 dark:border-[#2B2F77]/30 hover:bg-slate-100 transition-colors">
                  <Avatar className="h-7 w-7 rounded-lg shrink-0">
                    <AvatarImage src={user?.imageUrl || ""} alt={displayName} className="rounded-lg object-cover" />
                    <AvatarFallback className="rounded-lg bg-[#2B2F77] text-white text-xs font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                    <span className="truncate text-xs font-semibold text-slate-800 dark:text-white">{displayName}</span>
                    <span className="truncate text-[10px] text-slate-400">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto w-3.5 h-3.5 shrink-0 text-slate-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-56 rounded-xl bg-white dark:bg-[#0f1135] border border-slate-200 dark:border-[#2B2F77]/50 shadow-xl" side="top" align="end" sideOffset={8}>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2.5 px-3 py-2.5">
                    <Avatar className="h-8 w-8 rounded-lg shrink-0">
                      <AvatarImage src={user?.imageUrl || ""} alt={displayName} className="rounded-lg object-cover" />
                      <AvatarFallback className="rounded-lg bg-[#2B2F77] text-white text-xs font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                      <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">{displayName}</span>
                      <span className="truncate text-xs text-slate-400">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => { e.preventDefault(); if (!isLoggingOut) handleLogout(); }}
                  disabled={isLoggingOut}
                  className="mx-1 mb-1 rounded-lg text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  {isLoggingOut ? "Logging out…" : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
