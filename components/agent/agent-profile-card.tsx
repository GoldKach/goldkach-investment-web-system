import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import type { StaffMember } from "@/actions/staff";

interface AgentProfileCardProps {
  staff: StaffMember;
  activeClientCount: number;
}

export function AgentProfileCard({ staff, activeClientCount }: AgentProfileCardProps) {
  const displayName =
    staff.firstName && staff.lastName
      ? `${staff.firstName} ${staff.lastName}`
      : staff.name || "Agent";

  const initials =
    (staff.firstName?.[0] || staff.name?.[0] || "A").toUpperCase() +
    (staff.lastName?.[0] || "").toUpperCase();

  return (
    <div className="flex flex-col gap-3 px-3 py-3 rounded-xl bg-slate-50 dark:bg-[#2B2F77]/15 border border-slate-200 dark:border-[#2B2F77]/30">
      <div className="flex items-center gap-2.5">
        <Avatar className="h-8 w-8 rounded-lg shrink-0">
          <AvatarImage src={staff.imageUrl || ""} alt={displayName} className="rounded-lg object-cover" />
          <AvatarFallback className="rounded-lg bg-[#2B2F77] dark:bg-[#3B82F6] text-white text-xs font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="truncate text-xs font-semibold text-slate-800 dark:text-white">
            {displayName}
          </span>
          <span className="truncate text-[10px] text-slate-400 dark:text-slate-500">
            {staff.email}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 border-[#2B2F77]/30 text-[#2B2F77] dark:text-[#3B82F6] dark:border-[#3B82F6]/30"
        >
          {staff.role}
        </Badge>
        {staff.staffProfile?.department && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-slate-500">
            {staff.staffProfile.department}
          </Badge>
        )}
        {staff.staffProfile?.position && (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-slate-500">
            {staff.staffProfile.position}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Users className="h-3.5 w-3.5 shrink-0" />
        <span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {activeClientCount}
          </span>{" "}
          active {activeClientCount === 1 ? "client" : "clients"}
        </span>
      </div>
    </div>
  );
}
