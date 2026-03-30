import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { getAllStaffAction, getClientsForAssignmentAction } from "@/actions/staff";
import { ContactsTable } from "./components/contacts-table";

export const dynamic = "force-dynamic";

export default async function CommunicationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [clientsRes, staffRes] = await Promise.allSettled([
    getClientsForAssignmentAction(),
    getAllStaffAction(),
  ]);

  const allClients = clientsRes.status === "fulfilled" ? (clientsRes.value?.data ?? []) : [];
  const allStaff = staffRes.status === "fulfilled" ? (staffRes.value?.data ?? []) : [];

  const clients = allClients.map((u: any) => ({
    id: u.id,
    name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email,
    email: u.email,
    phone: u.phone || "",
    status: u.status || "USER",
  }));

  const agents = allStaff
    .filter((s: any) => s.role === "AGENT")
    .map((s: any) => ({
      id: s.id,
      name: [s.firstName, s.lastName].filter(Boolean).join(" ") || s.email,
      email: s.email,
      phone: s.phone || "",
      role: s.role,
    }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Communications</h1>
        <p className="text-sm text-slate-400 mt-1">
          View contacts, send bulk emails, and export lists
        </p>
      </div>
      <ContactsTable clients={clients} agents={agents} />
    </div>
  );
}
