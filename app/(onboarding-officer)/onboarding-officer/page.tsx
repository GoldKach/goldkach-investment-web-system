import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { OOAllClientsShell } from "@/components/onboarding-officer/oo-all-clients-shell";

export const dynamic = "force-dynamic";

export default async function OODashboardPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Client Onboarding</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          All registered clients — review onboarding information and approve applications
        </p>
      </div>
      <OOAllClientsShell />
    </div>
  );
}
