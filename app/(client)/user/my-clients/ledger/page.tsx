import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { getAgentClientsAction } from "@/actions/staff";
import { AllClientsLedger, type LedgerClient } from "@/app/(back)/dashboard/users/clients/ledger/all-clients-ledger";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MyClientsLedgerPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const clientsRes = await getAgentClientsAction(session.user.id);

  const assignments = clientsRes.success ? (clientsRes.data ?? []) : [];
  const clients: LedgerClient[] = assignments.map((a: any) => {
    const u = a.client ?? a;
    return {
      id: u.id,
      name: u.name || [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email,
      email: u.email,
      firstName: u.firstName ?? null,
      lastName: u.lastName ?? null,
      imageUrl: u.imageUrl ?? null,
      status: u.status ?? null,
    };
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Client Transaction Statements</h1>
          <p className="text-sm text-muted-foreground">
            Select a client to view and download their full transaction ledger
          </p>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground gap-2">
          <FileText className="h-8 w-8 opacity-20" />
          <p className="text-sm">No clients assigned to you yet.</p>
        </div>
      ) : (
        <AllClientsLedger clients={clients} />
      )}
    </div>
  );
}
