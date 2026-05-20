import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { listAuditLogs } from "@/actions/audit-logs";
import { AuditLogsContent } from "./components/audit-logs-content";

export const dynamic = "force-dynamic";

export default async function CMAauditLogsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const result = await listAuditLogs({ page: 1, pageSize: 50 });

  return (
    <AuditLogsContent
      initialRows={result.data?.rows ?? []}
      initialTotal={result.data?.total ?? 0}
      initialTotalPages={result.data?.totalPages ?? 1}
      initialError={result.error}
    />
  );
}
