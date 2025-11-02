

// // app/user/withdraws/page.tsx
// import { getAllUsers, getSession } from "@/actions/auth";
// import { listWithdrawals } from "@/actions/withdraws";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { redirect } from "next/navigation";
// import { WithdrawalsPageContent } from "./components/withdraw-page-content";

// export default async function WithdrawalsPage() {
//   const session = await getSession();
  
//   if (!session?.user) {
//     redirect("/login");
//   }

//   const users=await getAllUsers();
//   const user = users.data?.find((u:any) => u.id === session?.user?.id);  
//   const walletId= user?.wallet.id; 
//   const userId = session.user.id;
//   const wallet =user.wallet

// console.log(wallet);

//   const result = await listWithdrawals({
//     userId: userId,
//     include: ["user", "wallet"],
//   });

//   if (!result.success || !result.data) {
//     return (
//       <div className="p-6 flex items-center justify-center min-h-screen">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle>Error Loading Withdrawals</CardTitle>
//             <CardDescription>
//               {result.error || "Unable to load withdrawal data. Please try again later."}
//             </CardDescription>
//           </CardHeader>
//         </Card>
//       </div>
//     );
//   }


//   return <WithdrawalsPageContent withdrawals={result.data} user={user} />;
// }



// app/user/withdraws/page.tsx
import { getAllUsers, getSession } from "@/actions/auth";
import { listWithdrawals } from "@/actions/withdraws";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { WithdrawalsPageContent } from "./components/withdraw-page-content";

export default async function WithdrawalsPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/login");
  }

  const users = await getAllUsers();
  const user = users.data?.find((u: any) => u.id === session?.user?.id);  
  
  if (!user || !user.wallet) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Wallet Not Found</CardTitle>
            <CardDescription>
              No wallet found for your account. Please contact support.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const userId = session.user.id;
  const wallet = user.wallet;

  console.log("Wallet data:", wallet);

  const result = await listWithdrawals({
    userId: userId,
    include: ["user", "wallet"],
  });

  if (!result.success || !result.data) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Withdrawals</CardTitle>
            <CardDescription>
              {result.error || "Unable to load withdrawal data. Please try again later."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const userData = {
    id: userId,
    walletId: wallet.id,
    accountNumber: wallet.accountNumber,
    availableBalance: wallet.netAssetValue || 0,
    totalBalance: wallet.balance || 0,
  };

  return <WithdrawalsPageContent withdrawals={result.data} user={userData} />;
}