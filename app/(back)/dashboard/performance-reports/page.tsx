import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { AccountantReportsShell } from "@/components/back/aum-reports-shell";

export const dynamic = "force-dynamic";

export default async function PerformanceReportsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">
          Bulk Client Reports
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Generate and download combined AUM reports and individual performance
          reports for all clients
        </p>
      </div>
      <AccountantReportsShell />
    </div>
  );
}
