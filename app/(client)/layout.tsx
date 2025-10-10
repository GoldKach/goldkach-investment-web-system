

"use client";
import * as React from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import UserSidebar from "@/components/user/user-sidebar";
import UserNav from "@/components/back/user-nav";

export default function DashboardLayout({children}:{children:React.ReactNode}) {

    return (
        <SidebarProvider>
            <UserSidebar/>
            <SidebarInset>
                <div className="md:ml-[220px] lg:ml-[240px]">
                <UserNav/>
                 <div className="">
                 {children}
                 </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}