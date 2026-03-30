import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground",
        className
      )}
    >
      <Inbox className="h-12 w-12 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
