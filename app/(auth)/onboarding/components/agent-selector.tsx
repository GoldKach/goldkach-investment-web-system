// components/onboarding/agent-selector.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown, UserCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getActiveAgentsAction, type StaffMember } from "@/actions/staff";

type Props = {
  value: string;
  onChange: (agentId: string) => void;
};

export function AgentSelector({ value, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [agents, setAgents] = React.useState<StaffMember[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getActiveAgentsAction().then((res) => {
      setAgents(res.data ?? []);
      setLoading(false);
    });
  }, []);

  const selected = agents.find((a) => a.staffProfile?.id === value);

  return (
    <div className="space-y-2">
      <Label>
        Agent{" "}
        <span className="text-muted-foreground text-xs font-normal">
          (Optional)
        </span>
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal h-10"
          >
            {selected ? (
              <span className="flex items-center gap-2 truncate">
                <UserCircle className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate">{selected.name}</span>
                {selected.staffProfile?.position && (
                  <span className="text-xs text-muted-foreground shrink-0">
                    — {selected.staffProfile.position}
                  </span>
                )}
              </span>
            ) : (
              <span className="text-muted-foreground">
                {loading ? "Loading agents…" : "Select an agent (optional)"}
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search by name, email or position…" />
            <CommandList>
              <CommandEmpty>
                {loading ? "Loading agents…" : "No agents found."}
              </CommandEmpty>
              <CommandGroup>
                {/* Clear selection */}
                {value && (
                  <CommandItem
                    value="__clear__"
                    onSelect={() => {
                      onChange("");
                      setOpen(false);
                    }}
                    className="text-muted-foreground italic"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear selection
                  </CommandItem>
                )}

                {agents.map((agent) => {
                  const profileId = agent.staffProfile?.id ?? "";
                  return (
                    <CommandItem
                      key={agent.id}
                      value={`${agent.name} ${agent.email} ${agent.staffProfile?.position ?? ""}`}
                      onSelect={() => {
                        onChange(profileId);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          value === profileId ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {agent.imageUrl ? (
                          <img
                            src={agent.imageUrl}
                            alt={agent.name}
                            className="h-7 w-7 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <UserCircle className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-sm truncate">
                            {agent.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {agent.staffProfile?.position
                              ? `${agent.staffProfile.position} · `
                              : ""}
                            {agent.email}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected && (
        <p className="text-xs text-muted-foreground">
          Your account will be managed by{" "}
          <span className="font-medium text-foreground">{selected.name}</span>
          {selected.staffProfile?.department
            ? ` · ${selected.staffProfile.department}`
            : ""}
          .
        </p>
      )}
    </div>
  );
}