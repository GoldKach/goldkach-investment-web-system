"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Wallet, TrendingUp, ArrowDownCircle, ArrowUpCircle,
  FileText, Settings, Users, BarChart2, PieChart, CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface MobileBottomNavProps {
  items: NavItem[];
}

export function MobileBottomNav({ items }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-pb">
      <div className={`grid h-16 px-2`} style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* ── Pre-built nav configs per role ── */

export const userBottomNavItems: NavItem[] = [
  { label: "Dashboard",  href: "/user",            icon: LayoutDashboard },
  { label: "Portfolio",  href: "/user/portfolio",  icon: PieChart        },
  { label: "Wallets",    href: "/user/wallets",    icon: Wallet          },
  { label: "Deposits",   href: "/user/deposits",   icon: ArrowDownCircle },
  { label: "Reports",    href: "/user/reports",    icon: FileText        },
];

export const agentBottomNavItems: NavItem[] = [
  { label: "Clients",    href: "/agent",            icon: Users           },
  { label: "Statements", href: "/agent/statements", icon: FileText        },
  { label: "Settings",   href: "/agent/settings",   icon: Settings        },
];

export const adminBottomNavItems: NavItem[] = [
  { label: "Dashboard",  href: "/dashboard",                 icon: LayoutDashboard },
  { label: "Clients",    href: "/dashboard/users/clients",   icon: Users           },
  { label: "Deposits",   href: "/dashboard/deposits",        icon: ArrowDownCircle },
  { label: "Withdrawals",href: "/dashboard/withdrawals",     icon: ArrowUpCircle   },
  { label: "Reports",    href: "/dashboard/performance-reports", icon: BarChart2   },
];
