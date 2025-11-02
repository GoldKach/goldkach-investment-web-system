// app/admin/deposits/page.tsx
import { getSession } from "@/actions/auth";
import { listDeposits } from "@/actions/deposits";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { AdminDepositsContent } from "./components/admin-deposits-content";

export default async function AdminDepositsPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/login");
  }

  // Check if user is admin (adjust role check based on your schema)
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN" && session.user.role !== "MANAGER") {
    redirect("/user/deposits");
  }

  // Fetch all deposits with user and wallet info
  const result = await listDeposits({
    sortBy: "createdAt",
    order: "desc",
  });

  if (!result.success || !result.data) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Deposits</CardTitle>
            <CardDescription>
              {result.error || "Unable to load deposit data. Please try again later."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  console.log(result.data);

  return (
    <AdminDepositsContent 
      deposits={result.data} 
      adminId={session.user.id}
      adminName={session.user.name || session.user.email || "Admin"}
    />
  );
}