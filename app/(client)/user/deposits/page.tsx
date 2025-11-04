

// app/user/deposits/page.tsx (or wherever your deposits page is)
import { getAllUsers, getSession } from "@/actions/auth";
import { getUserDeposits } from "@/actions/deposits";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { DepositsPageContent } from "./components/deposit-content";

export default async function DepositsPage() {
  // Get session and handle authentication
  const session = await getSession();
  const r = await getAllUsers();
    const users = r.data;
  
  const user = users?.find((u:any) => u.id === session?.user?.id);  
  const walletId= user?.wallet.id;

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;


  // Fetch user's deposits
  const result = await getUserDeposits(userId);

  // Handle errors
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

  return <DepositsPageContent walletId={walletId} user={user} deposits={result.data} userId={userId} />;
}