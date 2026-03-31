import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import { listDeposits } from "@/actions/deposits";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminDepositsContent } from "@/app/(back)/dashboard/deposits/components/admin-deposits-content";

export const dynamic = "force-dynamic";

export default async function CRDepositsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const result = await listDeposits({ sortBy: "createdAt", order: "desc" });

  if (!result.success || !result.data) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Deposits</CardTitle>
            <CardDescription>{result.error || "Unable to load deposit data."}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <AdminDepositsContent
      deposits={result.data}
      adminId={session.user.id}
      adminName={session.user.name || session.user.email || "CR Staff"}
    />
  );
}
