import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { getAgentClientsAction } from "@/actions/staff";
import { ClientList } from "@/components/agent/client-list";
import { ErrorSection } from "@/components/agent/error-section";

export const dynamic = "force-dynamic";

export default async function MyClientsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const clientsRes = await getAgentClientsAction(session.user.id);

  if (!clientsRes.success) {
    return (
      <div className="p-6">
        <ErrorSection message={clientsRes.error || "Failed to load your clients."} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">My Clients</h1>
        <p className="text-sm text-slate-400 mt-1">
          {clientsRes.data?.length ?? 0} active{" "}
          {(clientsRes.data?.length ?? 0) === 1 ? "client" : "clients"} assigned to you
        </p>
      </div>
      <ClientList
        assignments={clientsRes.data ?? []}
        basePath="/user/my-clients"
      />
    </div>
  );
}
