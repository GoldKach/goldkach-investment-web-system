// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { ArrowLeft } from "lucide-react"
// import { UserPortfolioForm } from "@/components/back/user-portfolio-form"

// export default function NewUserPortfolioPage() {
//   return (
//     <div className="container mx-auto py-8 px-4 max-w-2xl">
//       <Button variant="ghost" asChild className="mb-4">
//         <Link href="/dashboard/user-portfolios">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to User Portfolios
//         </Link>
//       </Button>

//       <Card>
//         <CardHeader>
//           <CardTitle>Create User Portfolio</CardTitle>
//           <CardDescription>Assign a portfolio to a user</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <UserPortfolioForm />
//         </CardContent>
//       </Card>
//     </div>
//   )
// }




// app/(dashboard)/user-portfolios/new/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { UserPortfolioForm } from "@/components/back/user-portfolio-form";
import { listUserPortfolios } from "@/actions/user-portfolios";
import { getPortfolios } from "@/actions/portfolios";
import { getAllUsers } from "@/actions/auth";

export default async function NewUserPortfolioPage() {
  const [usersRes, portfoliosRes] = await Promise.all([getAllUsers(), getPortfolios()]);

  const users = usersRes.data
  const portfolios = portfoliosRes.success ? portfoliosRes.data : [];

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/dashboard/user-portfolios">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to User Portfolios
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create User Portfolio</CardTitle>
          <CardDescription>Assign a portfolio to a user</CardDescription>
        </CardHeader>
        <CardContent>
          <UserPortfolioForm users={users} portfolios={portfolios} />
        </CardContent>
      </Card>
    </div>
  );
}
