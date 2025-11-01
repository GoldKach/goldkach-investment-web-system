

// // "use client";
// // import * as React from "react";

// // import { useEffect, useState } from "react";
// // import { useRouter } from "next/navigation";
// // import AppSidebar from "@/components/back/app-sidebar";
// // import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// // import DashboardNav from "@/components/back/dashboard-nav";

// // export default function DashboardLayout({children}:{children:React.ReactNode}) {

// //     return (
// //         <SidebarProvider>
// //             <AppSidebar/>
// //             <SidebarInset>
// //                 <div className="md:ml-[220px] lg:ml-[225px]">
// //                 <DashboardNav/>
// //                  <div className="">
// //                  {children}
// //                  </div>
// //                 </div>
// //             </SidebarInset>
// //         </SidebarProvider>
// //     )
// // }





// // app/dashboard/layout.tsx  (SERVER COMPONENT)
// import { ReactNode } from "react";
// import { redirect } from "next/navigation";
// import DashboardShell from "@/components/back/dashboard-shell"; // client shell
// import { fetchMe, getSession } from "@/actions/auth";
// import UserDashboardShell from "@/components/back/user-dashboard-shell";

// export default async function DashboardLayout({ children }: { children: ReactNode }) {
//   const session = await getSession();
//   if (!session) redirect("/login");



//   // Optional: confirm/refresh user from backend /me
//   const me = await fetchMe(); // returns { data: user } or null
//   const user = me?.data ?? session.user;

//   console.log(user);



//   return <UserDashboardShell user={user}>{children}</UserDashboardShell>;
// }


// app/dashboard/layout.tsx  (SERVER COMPONENT)
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import UserDashboardShell from "@/components/back/user-dashboard-shell";
import { fetchMe, getSession } from "@/actions/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // 1) Must be logged in
  const session = await getSession();
  if (!session) redirect("/login?returnTo=/dashboard");

  // 2) Get the freshest user (or fall back to session)
  const me = await fetchMe(); // your server action that calls /me
  const user = me?.data ?? session.user;

  // 3) Authorize by role
  // If your app sometimes uses array roles, this handles both string and array.
  const hasUserRole =
    (typeof user?.role === "string" && user.role === "USER") ||
    (Array.isArray(user?.roles) && user.roles.some((r: any) => r?.roleName === "USER" || r === "USER"));

  if (!hasUserRole) {
    // You can redirect or render an Unauthorized UI.
    // Redirect keeps the URL clean:
    redirect("/unauthorized?reason=role");
  }

  console.log(user);

  return <UserDashboardShell user={user}>{children}</UserDashboardShell>;
}
