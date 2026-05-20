import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { CRClientsTableShell } from "@/components/back/cr-clients-table-shell";

export const dynamic = "force-dynamic";

export default async function CRClientsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");
  return <CRClientsTableShell />;
}
