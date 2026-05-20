import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PerformanceReportsLoading() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Bulk Client Reports</h1>
        <p className="text-sm text-slate-400 mt-1">
          Generate and download combined AUM reports and individual performance reports for all clients
        </p>
      </div>

      {/* Combined AUM card skeleton */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="h-5 w-48 bg-muted animate-pulse rounded" />
          <div className="h-3 w-72 bg-muted animate-pulse rounded mt-1" />
        </CardHeader>
      </Card>

      {/* Filter bar skeleton */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-4">
            <div className="h-8 w-56 bg-muted animate-pulse rounded" />
            <div className="h-8 w-44 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>

      {/* Loading indicator */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
          <p className="text-sm">Loading client portfolios…</p>
          <p className="text-xs text-muted-foreground/60">This may take a moment for large client lists</p>
        </CardContent>
      </Card>
    </div>
  );
}
