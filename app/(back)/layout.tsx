

"use client";
import * as React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/back/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardNav from "@/components/back/dashboard-nav";

export default function DashboardLayout({children}:{children:React.ReactNode}) {

    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <div className="md:ml-[220px] lg:ml-[225px]">
                <DashboardNav/>
                 <div className="">
                 {children}
                 </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}