

// "use client";
// import * as React from "react";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import AppSidebar from "@/components/back/app-sidebar";
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import DashboardNav from "@/components/back/dashboard-nav";

// export default function DashboardLayout({children}:{children:React.ReactNode}) {

//     return (
//         <SidebarProvider>
//             <AppSidebar/>
//             <SidebarInset>
//                 <div className="md:ml-[220px] lg:ml-[225px]">
//                 <DashboardNav/>
//                  <div className="">
//                  {children}
//                  </div>
//                 </div>
//             </SidebarInset>
//         </SidebarProvider>
//     )
// }





// app/dashboard/layout.tsx  (SERVER COMPONENT)
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/back/dashboard-shell"; // client shell
import { fetchMe, getSession } from "@/actions/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const me = await fetchMe(); // returns { data: user } or null
  const user = me?.data ?? session.user;


  return <DashboardShell user={user}>{children}</DashboardShell>;
}
