"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Check, ArrowLeftRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface SwitcherAccount {
  id: string;
  name: string;
  email: string;
  badge: string;
  href: string;
  /** Longest-prefix wins — more specific paths override shorter ones */
  matchPrefix: string;
  imageUrl?: string;
}

function initials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function activeAccount(accounts: SwitcherAccount[], pathname: string): SwitcherAccount {
  return (
    accounts
      .filter((a) => pathname.startsWith(a.matchPrefix))
      .sort((a, b) => b.matchPrefix.length - a.matchPrefix.length)[0] ?? accounts[0]
  );
}

interface Props {
  accounts: SwitcherAccount[];
}

export function AccountSwitcher({ accounts }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  if (accounts.length < 2) return null;

  const current = activeAccount(accounts, pathname);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-[#2B2F77]/20 transition-colors text-left group"
          aria-label="Switch account"
        >
          <Avatar className="h-7 w-7 rounded-lg shrink-0">
            {current.imageUrl && (
              <AvatarImage src={current.imageUrl} alt={current.name} className="rounded-lg object-cover" />
            )}
            <AvatarFallback className="rounded-lg bg-[#2B2F77] dark:bg-[#3B82F6] text-white text-[10px] font-bold">
              {initials(current.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 dark:text-white truncate leading-none mb-0.5">
              {current.name}
            </p>
            <p className="text-[10px] text-slate-400 truncate leading-none">{current.badge}</p>
          </div>

          <ArrowLeftRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0 transition-colors" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="top"
        sideOffset={6}
        className="w-64 p-1.5 shadow-xl"
      >
        <p className="px-2 pb-1.5 pt-0.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Switch account
        </p>

        <div className="space-y-0.5">
          {accounts.map((account) => {
            const isActive =
              activeAccount(accounts, pathname).matchPrefix === account.matchPrefix;

            return (
              <button
                key={account.id}
                onClick={() => {
                  setOpen(false);
                  router.push(account.href);
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-colors",
                  isActive
                    ? "bg-slate-100 dark:bg-[#2B2F77]/25 cursor-default"
                    : "hover:bg-slate-50 dark:hover:bg-[#2B2F77]/15 cursor-pointer"
                )}
              >
                <Avatar className="h-9 w-9 rounded-xl shrink-0">
                  {account.imageUrl && (
                    <AvatarImage src={account.imageUrl} alt={account.name} className="rounded-xl object-cover" />
                  )}
                  <AvatarFallback
                    className={cn(
                      "rounded-xl text-white text-xs font-bold",
                      isActive
                        ? "bg-[#2B2F77] dark:bg-[#3B82F6]"
                        : "bg-slate-400 dark:bg-slate-600"
                    )}
                  >
                    {initials(account.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate leading-none mb-0.5">
                    {account.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate leading-none">
                    {account.badge}
                  </p>
                </div>

                {isActive && (
                  <Check className="h-4 w-4 text-[#2B2F77] dark:text-[#3B82F6] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
