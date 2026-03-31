import { getClientsForAssignmentAction } from "@/actions/staff";
import { CRClientsTable } from "./components/cr-clients-table";

export const dynamic = "force-dynamic";

export default async function CRClientsPage() {
  const res = await getClientsForAssignmentAction();
  // Ensure only USER role accounts are shown — filter out any staff that may slip through
  const clients = (res.data ?? []).filter((u: any) => !u.role || u.role === "USER");
  return <CRClientsTable clients={clients} />;
}
