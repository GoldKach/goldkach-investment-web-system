// components/back/dashboard-shell.tsx (CLIENT COMPONENT)
"use client";

import * as React from "react";
import AppSidebar from "@/components/back/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardNav from "@/components/back/dashboard-nav";
import Image from "next/image";
import UserSidebar from "../user/user-sidebar";
import { MobileBottomNav, userBottomNavItems } from "@/components/shared/mobile-bottom-nav";

type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  phone?: string;
  imageUrl?: string;
};

export default function UserDashboardShell({
  user,
  isAlsoAgent,
  children,
}: {
  user: User;
  isAlsoAgent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <UserSidebar user={user} isAlsoAgent={isAlsoAgent} />
      <SidebarInset>
        <div className="md:ml-[220px] lg:ml-[225px]">
          <DashboardNav user={user} />
          <div className="pb-16 md:pb-0">{children}</div>
        </div>
      </SidebarInset>
      <MobileBottomNav items={userBottomNavItems} />
    </SidebarProvider>
  );
}
