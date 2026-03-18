

// // app/(dashboard)/user-portfolios/page.tsx
// import { listUserPortfolios } from "@/actions/user-portfolios"
// import { UserPortfolioManagement } from "./components/user-portfolio-management"

// export default async function UserPortfoliosPage() {
//   // Ask API to include user & portfolio to get names/emails in one roundtrip
//   const res = await listUserPortfolios({ 
//     include: { user: true, portfolio: true, userAssets: true } 
//   })
  
//   const userPortfolios = res.success && Array.isArray(res.data) ? res.data : []

//   return (
//     <div className="container mx-auto py-8 px-6">
//       <UserPortfolioManagement initialUserPortfolios={userPortfolios} />
//     </div>
//   )
// }



// app/dashboard/user-portfolios/page.tsx
import { listUserPortfolios } from "@/actions/user-portfolios";
import { getPortfolios } from "@/actions/portfolios";
import { getAllUsers } from "@/actions/auth";
import UserPortfoliosClient from "./components/client";

export default async function UserPortfoliosPage() {
  const [upRes, portfoliosRes, usersRes] = await Promise.all([
    listUserPortfolios({
      include: { user: true, portfolio: true, userAssets: true, wallet: true },
    }),
    getPortfolios({ include: "assets" }),
    getAllUsers(),
  ]);

  return (
    <UserPortfoliosClient
      initialUserPortfolios={upRes.data    ?? []}
      allPortfolios={portfoliosRes.data    ?? []}
      allUsers={usersRes.data              ?? []}
    />
  );
}