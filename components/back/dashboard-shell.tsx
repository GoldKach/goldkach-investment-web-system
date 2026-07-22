// components/back/dashboard-shell.tsx (CLIENT COMPONENT)
"use client";

import * as React from "react";
import AppSidebar from "@/components/back/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardNav from "@/components/back/dashboard-nav";
import Image from "next/image";
import { MobileBottomNav, adminBottomNavItems } from "@/components/shared/mobile-bottom-nav";

type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  phone?: string;
  imageUrl?: string;
};

export default function DashboardShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <DashboardNav user={user} />
        <div className="pb-16 md:pb-0 min-w-0 w-full">{children}</div>
      </SidebarInset>
      <MobileBottomNav items={adminBottomNavItems} />
    </SidebarProvider>
  );
}
