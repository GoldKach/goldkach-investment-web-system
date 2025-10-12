
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
//   SidebarRail,
// } from "@/components/ui/sidebar"

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// import {
//   BadgeCheck,
//   Bell,
//   Briefcase,
//   ChevronRight,
//   ChevronsUpDown,
//   CreditCard,
//   Crown,
//   FileText,
//   History,
//   LayoutDashboard,
//   LogOut,
//   PieChart,
//   Settings,
//   TrendingUp,
//   Users,
//   Wallet,
// } from "lucide-react"
// import Link from "next/link"
// import Image from "next/image"

// export default function AppSidebar({user}:{user:any}) {

//   const sidebarLinks = [
//     {
//       title: "Dashboard",
//       url: "/dashboard",
//       icon: LayoutDashboard,
//       isActive: true,
//       items: [
//         {
//           title: "Overview",
//           url: "/dashboard",
//         },
//         {
//           title: "Analytics",
//           url: "/dashboard/analytics",
//         },
//         {
//           title: "Performance",
//           url: "/dashboard/performance",
//         },
//       ],
//     },
//     {
//       title: "User Management",
//       url: "/dashboard/users",
//       icon: Users,
//       items: [
//         {
//           title: "All Users",
//           url: "/dashboard/users",
//         },
//         {
//           title: "On BoardingApprovals",
//           url: "/dashboard/approvals",
//         },
//         {
//           title: "Active Sessions",
//           url: "/dashboard/active-sessions",
//         },
//       ],
//     },
//     {
//       title: "Portfolio Management",
//       url: "/portfolio",
//       icon: Briefcase,
//       items: [
//         {
//           title: "My Portfolios",
//           url: "/portfolio/my-portfolios",
//         },
//         {
//           title: "Assets",
//           url: "/portfolio/assets",
//         },
//         {
//           title: "Allocations",
//           url: "/portfolio/allocations",
//         },
//         {
//           title: "Portfolio Summary",
//           url: "/portfolio/summary",
//         },
//       ],
//     },
//     {
//       title: "Wallet & Transactions",
//       url: "/wallet",
//       icon: Wallet,
//       items: [
//         {
//           title: "My Wallet",
//           url: "/wallet",
//         },
//         {
//           title: "Deposits",
//           url: "/wallet/deposits",
//         },
//         {
//           title: "Withdrawals",
//           url: "/wallet/withdrawals",
//         },
//         {
//           title: "Transaction History",
//           url: "/wallet/history",
//         },
//       ],
//     },
//     {
//       title: "Investments",
//       url: "/investments",
//       icon: TrendingUp,
//       items: [
//         {
//           title: "Available Portfolios",
//           url: "/investments/portfolios",
//         },
//         {
//           title: "Asset Explorer",
//           url: "/investments/assets",
//         },
//         {
//           title: "Market Overview",
//           url: "/investments/market",
//         },
//         {
//           title: "Risk Analysis",
//           url: "/investments/risk",
//         },
//       ],
//     },
//     {
//       title: "Onboarding & KYC",
//       url: "/onboarding",
//       icon: FileText,
//       items: [
//         {
//           title: "Entity Onboarding",
//           url: "/onboarding/entity",
//         },
//         {
//           title: "KYC Verification",
//           url: "/onboarding/kyc",
//         },
//         {
//           title: "Document Upload",
//           url: "/onboarding/documents",
//         },
//         {
//           title: "Approval Status",
//           url: "/onboarding/status",
//         },
//       ],
//     },
    
//     {
//       title: "Reports & Analytics",
//       url: "/reports",
//       icon: PieChart,
//       items: [
//         {
//           title: "Financial Reports",
//           url: "/reports/financial",
//         },
//         {
//           title: "Activity Logs",
//           url: "/reports/activity",
//         },
//         {
//           title: "User Analytics",
//           url: "/reports/users",
//         },
//         {
//           title: "Custom Reports",
//           url: "/reports/custom",
//         },
//       ],
//     },
//     {
//       title: "Activity History",
//       url: "/activity",
//       icon: History,
//       items: [
//         {
//           title: "Recent Activity",
//           url: "/activity/recent",
//         },
//         {
//           title: "Audit Trail",
//           url: "/activity/audit",
//         },
//         {
//           title: "System Logs",
//           url: "/activity/system",
//         },
//       ],
//     },
//     {
//       title: "Settings",
//       url: "/settings",
//       icon: Settings,
//       items: [
//         {
//           title: "Account Settings",
//           url: "/settings/account",
//         },
//         {
//           title: "Security",
//           url: "/settings/security",
//         },
//         {
//           title: "Notifications",
//           url: "/settings/notifications",
//         },
//         {
//           title: "System Configuration",
//           url: "/settings/system",
//         },
//       ],
//     },
//   ]

//   return (
//     <Sidebar collapsible="icon">
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton tooltip="Investment Platform">
//               <div className="flex items-center gap-2">
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg">
//                   <Image src="/logos/GoldKach-Logo-New-3.png" width={40} height={40} alt="goldkach"/>
//                 </div>
//                 <span className="font-semibold">GOLDKACH</span>
//               </div>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarMenu>
//             {sidebarLinks.map((item) => (
//               <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
//                 <SidebarMenuItem>
//                   <CollapsibleTrigger asChild>
//                     <SidebarMenuButton tooltip={item.title}>
//                       {item.icon && <item.icon />}
//                       <span>{item.title}</span>
//                       <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//                     </SidebarMenuButton>
//                   </CollapsibleTrigger>
//                   <CollapsibleContent>
//                     <SidebarMenuSub>
//                       {item.items?.map((subItem) => (
//                         <SidebarMenuSubItem key={subItem.title}>
//                           <SidebarMenuSubButton asChild>
//                             <Link href={subItem.url}>
//                               <span>{subItem.title}</span>
//                             </Link>
//                           </SidebarMenuSubButton>
//                         </SidebarMenuSubItem>
//                       ))}
//                     </SidebarMenuSub>
//                   </CollapsibleContent>
//                 </SidebarMenuItem>
//               </Collapsible>
//             ))}
//           </SidebarMenu>
//         </SidebarGroup>
//       </SidebarContent>
//       <SidebarFooter>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <SidebarMenuButton
//                   size="lg"
//                   className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//                 >
//                   <Avatar className="h-8 w-8 rounded-lg">
//                                          <Image width={60} height={60} alt={user.name} src={user.imageUrl} />

//                   </Avatar>
//                   <div className="grid flex-1 text-left text-sm leading-tight">
//                     <span className="truncate font-semibold">{user.name}</span>
//                     <span className="truncate text-xs">{user.email}</span>
//                   </div>
//                   <ChevronsUpDown className="ml-auto size-4" />
//                 </SidebarMenuButton>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent
//                 className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
//                 side="bottom"
//                 align="end"
//                 sideOffset={4}
//               >
//                 <DropdownMenuLabel className="p-0 font-normal">
//                   <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                     <Avatar className="h-8 w-8 rounded-lg">
//                       <Image width={60} height={60} alt={user.name} src={user.imageUrl} />
//                     </Avatar>
//                     <div className="grid flex-1 text-left text-sm leading-tight">
//                       <span className="truncate font-semibold">{user.name}</span>
//                       <span className="truncate text-xs">{user.email}</span>
//                     </div>
//                   </div>
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuGroup>
//                   <DropdownMenuItem>
//                     <Crown />
//                     Upgrade to Premium
//                   </DropdownMenuItem>
//                 </DropdownMenuGroup>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuGroup>
//                   <DropdownMenuItem>
//                     <BadgeCheck />
//                     Account
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <CreditCard />
//                     Billing
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Bell />
//                     Notifications
//                   </DropdownMenuItem>
//                 </DropdownMenuGroup>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>
//                   <LogOut />
//                   Log out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//       <SidebarRail />
//     </Sidebar>
//   )
// }


"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  BadgeCheck,
  Bell,
  Briefcase,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  Crown,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  PieChart,
  Settings,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { logoutUser } from "@/actions/auth";


export default function AppSidebar({ user }: { user: any }) {
  const router = useRouter();
  const [isLoggingOut, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutUser();           // clears HttpOnly cookies on server
      router.replace("/login");     // send user to login
    });
  };

  const avatarSrc = user?.imageUrl || "/avatars/placeholder.png";
  const initials =
    (user?.firstName?.[0] || user?.name?.[0] || "U") +
    (user?.lastName?.[0] || "");

  const sidebarLinks = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        { title: "Overview", url: "/dashboard" },
        { title: "Analytics", url: "/dashboard/analytics" },
        { title: "Performance", url: "/dashboard/performance" },
      ],
    },
    {
      title: "User Management",
      url: "/dashboard/users",
      icon: Users,
      items: [
        { title: "All Users", url: "/dashboard/users" },
        { title: "On BoardingApprovals", url: "/dashboard/approvals" },
        { title: "Active Sessions", url: "/dashboard/active-sessions" },
      ],
    },
    {
      title: "Portfolio Management",
      url: "/portfolio",
      icon: Briefcase,
      items: [
        { title: "My Portfolios", url: "/portfolio/my-portfolios" },
        { title: "Assets", url: "/portfolio/assets" },
        { title: "Allocations", url: "/portfolio/allocations" },
        { title: "Portfolio Summary", url: "/portfolio/summary" },
      ],
    },
    {
      title: "Wallet & Transactions",
      url: "/wallet",
      icon: Wallet,
      items: [
        { title: "My Wallet", url: "/wallet" },
        { title: "Deposits", url: "/wallet/deposits" },
        { title: "Withdrawals", url: "/wallet/withdrawals" },
        { title: "Transaction History", url: "/wallet/history" },
      ],
    },
    {
      title: "Investments",
      url: "/investments",
      icon: TrendingUp,
      items: [
        { title: "Available Portfolios", url: "/investments/portfolios" },
        { title: "Asset Explorer", url: "/investments/assets" },
        { title: "Market Overview", url: "/investments/market" },
        { title: "Risk Analysis", url: "/investments/risk" },
      ],
    },
    {
      title: "Onboarding & KYC",
      url: "/onboarding",
      icon: FileText,
      items: [
        { title: "Entity Onboarding", url: "/onboarding/entity" },
        { title: "KYC Verification", url: "/onboarding/kyc" },
        { title: "Document Upload", url: "/onboarding/documents" },
        { title: "Approval Status", url: "/onboarding/status" },
      ],
    },
    {
      title: "Reports & Analytics",
      url: "/reports",
      icon: PieChart,
      items: [
        { title: "Financial Reports", url: "/reports/financial" },
        { title: "Activity Logs", url: "/reports/activity" },
        { title: "User Analytics", url: "/reports/users" },
        { title: "Custom Reports", url: "/reports/custom" },
      ],
    },
    {
      title: "Activity History",
      url: "/activity",
      icon: History,
      items: [
        { title: "Recent Activity", url: "/activity/recent" },
        { title: "Audit Trail", url: "/activity/audit" },
        { title: "System Logs", url: "/activity/system" },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        { title: "Account Settings", url: "/settings/account" },
        { title: "Security", url: "/settings/security" },
        { title: "Notifications", url: "/settings/notifications" },
        { title: "System Configuration", url: "/settings/system" },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Investment Platform">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                  <Image src="/logos/GoldKach-Logo-New-3.png" width={40} height={40} alt="goldkach" />
                </div>
                <span className="font-semibold">GOLDKACH</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarLinks.map((item) => (
              <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

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
                    <Image width={60} height={60} alt={user?.name || "User"} src={avatarSrc} />
                    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
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
                      <Image width={60} height={60} alt={user?.name || "User"} src={avatarSrc} />
                      <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name}</span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Crown />
                    Upgrade to Premium
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
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

      <SidebarRail />
    </Sidebar>
  );
}
