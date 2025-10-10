

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function UserSidebar() {
  const user = {
    name: "John Investor",
    email: "john@investment.com",
    avatar: "/avatars/user.jpg",
  }

  const sidebarLinks = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Performance",
          url: "/dashboard/performance",
        },
      ],
    },
    {
      title: "Portfolio Management",
      url: "/portfolio",
      icon: Briefcase,
      items: [
        {
          title: "My Portfolios",
          url: "/portfolio/my-portfolios",
        },
        {
          title: "Assets",
          url: "/portfolio/assets",
        },
        {
          title: "Allocations",
          url: "/portfolio/allocations",
        },
        {
          title: "Portfolio Summary",
          url: "/portfolio/summary",
        },
      ],
    },
    {
      title: "Wallet & Transactions",
      url: "/wallet",
      icon: Wallet,
      items: [
        {
          title: "My Wallet",
          url: "/wallet",
        },
        {
          title: "Deposits",
          url: "/wallet/deposits",
        },
        {
          title: "Withdrawals",
          url: "/wallet/withdrawals",
        },
        {
          title: "Transaction History",
          url: "/wallet/history",
        },
      ],
    },
    {
      title: "Investments",
      url: "/investments",
      icon: TrendingUp,
      items: [
        {
          title: "Available Portfolios",
          url: "/investments/portfolios",
        },
        {
          title: "Asset Explorer",
          url: "/investments/assets",
        },
        {
          title: "Market Overview",
          url: "/investments/market",
        },
        {
          title: "Risk Analysis",
          url: "/investments/risk",
        },
      ],
    },
    {
      title: "Onboarding & KYC",
      url: "/onboarding",
      icon: FileText,
      items: [
        {
          title: "Entity Onboarding",
          url: "/onboarding/entity",
        },
        {
          title: "KYC Verification",
          url: "/onboarding/kyc",
        },
        {
          title: "Document Upload",
          url: "/onboarding/documents",
        },
        {
          title: "Approval Status",
          url: "/onboarding/status",
        },
      ],
    },
    {
      title: "User Management",
      url: "/users",
      icon: Users,
      items: [
        {
          title: "All Users",
          url: "/users",
        },
        {
          title: "Roles & Permissions",
          url: "/users/roles",
        },
        {
          title: "Pending Approvals",
          url: "/users/approvals",
        },
        {
          title: "Active Sessions",
          url: "/users/sessions",
        },
      ],
    },
    {
      title: "Reports & Analytics",
      url: "/reports",
      icon: PieChart,
      items: [
        {
          title: "Financial Reports",
          url: "/reports/financial",
        },
        {
          title: "Activity Logs",
          url: "/reports/activity",
        },
        {
          title: "User Analytics",
          url: "/reports/users",
        },
        {
          title: "Custom Reports",
          url: "/reports/custom",
        },
      ],
    },
    {
      title: "Activity History",
      url: "/activity",
      icon: History,
      items: [
        {
          title: "Recent Activity",
          url: "/activity/recent",
        },
        {
          title: "Audit Trail",
          url: "/activity/audit",
        },
        {
          title: "System Logs",
          url: "/activity/system",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "Account Settings",
          url: "/settings/account",
        },
        {
          title: "Security",
          url: "/settings/security",
        },
        {
          title: "Notifications",
          url: "/settings/notifications",
        },
        {
          title: "System Configuration",
          url: "/settings/system",
        },
      ],
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Investment Platform">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                  <Image src="/logos/GoldKach-Logo-New-3.png" width={40} height={40} alt="goldkach"/>
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
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="rounded-lg">JI</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
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
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="rounded-lg">JI</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user.name}</span>
                      <span className="truncate text-xs">{user.email}</span>
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
                <DropdownMenuItem>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
