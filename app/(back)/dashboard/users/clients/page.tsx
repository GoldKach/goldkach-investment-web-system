import { getClientsForAssignmentAction } from "@/actions/staff";
import { CRClientsTable } from "@/app/(cr)/cr/clients/components/cr-clients-table";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const res = await getClientsForAssignmentAction();
  const clients = (res.data ?? []).filter((u: any) => !u.role || u.role === "USER");
  return <CRClientsTable clients={clients} basePath="/dashboard/users/clients" />;
}
