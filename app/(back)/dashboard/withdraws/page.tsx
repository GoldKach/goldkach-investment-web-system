// // app/admin/withdrawals/page.tsx
// import { getSession } from "@/actions/auth";
// import { listWithdrawals } from "@/actions/withdraws";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { redirect } from "next/navigation";
// import { AdminWithdrawalsContent } from "./components/admin-deposits-content";

// export default async function AdminWithdrawalsPage() {
//   const session = await getSession();

//   if (!session?.user) {
//     redirect("/login");
//   }

//   // Allow only admins/managers
//   if (
//     session.user.role !== "ADMIN" &&
//     session.user.role !== "SUPER_ADMIN" &&
//     session.user.role !== "MANAGER"
//   ) {
//     redirect("/user/withdrawals");
//   }

//   // Fetch all withdrawals with user & wallet info
//   const result = await listWithdrawals({
//     sortBy: "createdAt",
//     order: "desc",
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
//             <CardContent />
//           </CardHeader>
//         </Card>
//       </div>
//     );
//   }

//   console.log(result.data);

//   return (
//     <AdminWithdrawalsContent
//       withdrawals={result.data}
//       adminId={session.user.id}
//       adminName={session.user.name || session.user.email || "Admin"}
//     />
//   );
// }



// app/admin/withdrawals/page.tsx
import { getSession } from "@/actions/auth";
import { listWithdrawals } from "@/actions/withdraws";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { AdminWithdrawalsContent } from "./components/adminwithdrawcontent";

export default async function AdminWithdrawalsPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  // Allow only admins/managers
  if (
    session.user.role !== "ADMIN" &&
    session.user.role !== "SUPER_ADMIN" &&
    session.user.role !== "MANAGER"
  ) {
    redirect("/user/withdrawals");
  }

  // Fetch all withdrawals with user & wallet info
  const result = await listWithdrawals({
    sortBy: "createdAt",
    order: "desc",
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
          <CardContent />
        </Card>
      </div>
    );
  }

  return (
    <AdminWithdrawalsContent
      withdrawals={result.data}
      adminId={session.user.id}
      adminName={session.user.name || session.user.email || "Admin"}
    />
  );
}
