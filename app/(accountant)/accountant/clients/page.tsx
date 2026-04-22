import { getClientsForAssignmentAction } from "@/actions/staff";
import { AccountantClientsTable } from "./components/accountant-clients-table";

export const dynamic = "force-dynamic";

export default async function AccountantClientsPage() {
  const res = await getClientsForAssignmentAction();
  const clients = (res.data ?? []).filter((u: any) => !u.role || u.role === "USER");
  return <AccountantClientsTable clients={clients} />;
}
