"use client";

import { useState } from "react";
import { Search, Users, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TransactionLedger } from "@/app/(back)/dashboard/users/clients/[id]/components/transaction-ledger";

export interface LedgerClient {
  id: string;
  name: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  status?: string | null;
}

function initials(c: LedgerClient) {
  const f = c.firstName?.[0] ?? c.name?.[0] ?? "?";
  const l = c.lastName?.[0] ?? "";
  return (f + l).toUpperCase();
}

export function AllClientsLedger({ clients }: { clients: LedgerClient[] }) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.firstName?.toLowerCase().includes(q) ||
      c.lastName?.toLowerCase().includes(q)
    );
  });

  const selected = clients.find((c) => c.id === selectedId);

  return (
    <div className="flex gap-4 min-h-[600px]">
      {/* Client list panel */}
      <div className="w-72 shrink-0 flex flex-col border border-border rounded-xl overflow-hidden bg-card">
        <div className="p-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Clients</span>
            <Badge variant="secondary" className="ml-auto text-xs">{clients.length}</Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search client…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No clients found.</p>
          ) : (
            filtered.map((c) => {
              const isActive = c.id === selectedId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors border-b border-border/50 last:border-0",
                    isActive
                      ? "bg-primary/10 dark:bg-primary/15"
                      : "hover:bg-muted/40"
                  )}
                >
                  <Avatar className="h-8 w-8 rounded-lg shrink-0">
                    {c.imageUrl && <AvatarImage src={c.imageUrl} alt={c.name} className="object-cover rounded-lg" />}
                    <AvatarFallback className="rounded-lg bg-[#2B2F77] text-white text-[10px] font-bold">
                      {initials(c)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate text-foreground">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{c.email}</p>
                  </div>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Ledger panel */}
      <div className="flex-1 min-w-0">
        {selected ? (
          <TransactionLedger userId={selected.id} clientName={selected.name} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] border border-dashed border-border rounded-xl text-muted-foreground gap-3">
            <Users className="h-10 w-10 opacity-20" />
            <p className="text-sm font-medium">Select a client to view their transaction statement</p>
            <p className="text-xs">{clients.length} client{clients.length !== 1 ? "s" : ""} available</p>
          </div>
        )}
      </div>
    </div>
  );
}
