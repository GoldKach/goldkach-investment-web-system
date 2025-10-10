"use client"
import React from "react"
import { Input } from "@/components/ui/input"
import {
  TrendingUp,
  BadgeCheck,
  Bell,
  Wallet,
  ChevronsUpDown,
  Building2,
  CreditCard,
  PieChart,
  Plus,
  Settings2,
  Crown,
  LayoutDashboard,
  LineChart,
  Briefcase,
  FileText,
  LogOut,
} from "lucide-react"

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

import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "../front-end/theme-toggle"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Personal Portfolio",
      logo: Wallet,
      plan: "Premium",
    },
    {
      name: "Family Trust",
      logo: Building2,
      plan: "Enterprise",
    },
    {
      name: "Retirement Fund",
      logo: TrendingUp,
      plan: "Standard",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "Performance",
          url: "#",
        },
        {
          title: "Analytics",
          url: "#",
        },
      ],
    },
    {
      title: "Investments",
      url: "#",
      icon: TrendingUp,
      items: [
        {
          title: "Stocks",
          url: "#",
        },
        {
          title: "Bonds",
          url: "#",
        },
        {
          title: "ETFs",
          url: "#",
        },
        {
          title: "Crypto",
          url: "#",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "Monthly Summary",
          url: "#",
        },
        {
          title: "Tax Documents",
          url: "#",
        },
        {
          title: "Statements",
          url: "#",
        },
        {
          title: "Transaction History",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "#",
        },
        {
          title: "Security",
          url: "#",
        },
        {
          title: "Preferences",
          url: "#",
        },
        {
          title: "Notifications",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Growth Portfolio",
      url: "#",
      icon: LineChart,
    },
    {
      name: "Dividend Strategy",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Retirement Planning",
      url: "#",
      icon: Briefcase,
    },
  ],
}

const DashboardNav = () => {
  const [searchQuery, setSearchQuery] = React.useState("")
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
      <ThemeToggle/>
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
                    <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{data.user.name}</span>
                    <span className="truncate text-xs">{data.user.email}</span>
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
                      <AvatarImage src={data.user.avatar || "/placeholder.svg"} alt={data.user.name} />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{data.user.name}</span>
                      <span className="truncate text-xs">{data.user.email}</span>
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
    </div>
  )
}

export default DashboardNav
