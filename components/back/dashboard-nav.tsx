

"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  TrendingUp, BadgeCheck, Bell, Wallet, ChevronsUpDown, Building2,
  CreditCard, PieChart, Settings2, Crown, LayoutDashboard, LineChart,
  Briefcase, FileText, LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "../front-end/theme-toggle";
import { logoutUser } from "@/actions/auth";
// ⬇️ server action

const DashboardNav = ({ user }: { user: any }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggingOut, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutUser();          // clears HttpOnly cookies on the server
      router.replace("/login");    // send user to login
    });
  };

  const avatarSrc = user?.imageUrl || "/avatars/placeholder.png";
  const initials =
    (user?.firstName?.[0] || user?.name?.[0] || "U") +
    (user?.lastName?.[0] || "");

  return (
    <div className="flex h-16 items-center gap-4 border-b px-4">
      <SidebarTrigger />
      <div className="flex-1">
        <Input
          placeholder="Search investments, stocks, reports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <ThemeToggle />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    {/* You can switch to AvatarImage if you prefer */}
                    <Image width={30} height={30} src={avatarSrc} alt={user?.name || "User"} />
                    <AvatarFallback className="rounded-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <Image width={30} height={30} src={avatarSrc} alt={user?.name || "User"} />
                      <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name}</span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />


                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault(); // prevent menu default behavior
                    if (!isLoggingOut) handleLogout();
                  }}
                  disabled={isLoggingOut}
                >
                  <LogOut />
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </div>
  );
};

export default DashboardNav;
