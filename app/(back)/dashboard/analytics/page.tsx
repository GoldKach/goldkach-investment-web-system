import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { AnalyticsShell } from "./components/analytics-shell";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return <AnalyticsShell />;
}
