import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { StaffListingShell } from "./components/staff-listing-shell";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <StaffListingShell />
    </div>
  );
}
