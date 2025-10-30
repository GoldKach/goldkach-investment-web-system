// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Eye, Pencil, Plus, User } from "lucide-react"
// import { DeleteUserPortfolioButton } from "@/components/back/delete-user-portfolio-button"

// // Mock data - replace with actual database query
// const mockUserPortfolios = [
//   {
//     id: "1",
//     userId: "1",
//     portfolioId: "1",
//     userName: "John Doe",
//     userEmail: "john@example.com",
//     portfolioName: "Growth Portfolio",
//     portfolioValue: 125000.0,
//     createdAt: new Date("2024-01-15"),
//     updatedAt: new Date("2024-10-20"),
//   },
//   {
//     id: "2",
//     userId: "2",
//     portfolioId: "2",
//     userName: "Jane Smith",
//     userEmail: "jane@example.com",
//     portfolioName: "Balanced Portfolio",
//     portfolioValue: 87500.0,
//     createdAt: new Date("2024-02-10"),
//     updatedAt: new Date("2024-10-19"),
//   },
//   {
//     id: "3",
//     userId: "1",
//     portfolioId: "3",
//     userName: "John Doe",
//     userEmail: "john@example.com",
//     portfolioName: "Conservative Portfolio",
//     portfolioValue: 65000.0,
//     createdAt: new Date("2024-03-05"),
//     updatedAt: new Date("2024-10-18"),
//   },
// ]

// function formatCurrency(value: number) {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//   }).format(value)
// }

// export default function UserPortfoliosPage() {
//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-4xl font-bold tracking-tight">User Portfolios</h1>
//           <p className="text-muted-foreground mt-2">Manage user portfolio assignments and values</p>
//         </div>
//         <Button asChild>
//           <Link href="/dashboard/user-portfolios/new">
//             <Plus className="mr-2 h-4 w-4" />
//             Add User Portfolio
//           </Link>
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>All User Portfolios</CardTitle>
//           <CardDescription>View and manage all user portfolio assignments</CardDescription>
//         </CardHeader>
//         <CardContent>
//         <UserportfolioListing />
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


// app/(dashboard)/user-portfolios/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { listUserPortfolios } from "@/actions/user-portfolios";
import { UserPortfolioListing } from "@/components/user-portfolio-listing";


type Row = {
  id: string;
  userId: string;
  portfolioId: string;
  userName: string;
  userEmail: string;
  portfolioName: string;
  portfolioValue: number;
  createdAt?: string;
  updatedAt?: string;
};

export default async function UserPortfoliosPage() {
  // Ask API to include user & portfolio to get names/emails in one roundtrip
  const res = await listUserPortfolios({ include: { user: true, portfolio: true } });
  const raw = res.success && Array.isArray(res.data) ? res.data : [];

  const rows: Row[] = raw.map((u: any) => ({
    id: u.id,
    userId: u.userId, 
    portfolioId: u.portfolioId,
    userName:
      u.user?.name ??
      (`${u.user?.firstName ?? ""} ${u.user?.lastName ?? ""}`.trim() ||
      "—"),
    userEmail: u.user?.email ?? "—",
    portfolioName: u.portfolio?.name ?? "—",
    portfolioValue: typeof u.portfolioValue === "number" ? u.portfolioValue : 0,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">User Portfolios</h1>
          <p className="text-muted-foreground mt-2">Manage user portfolio assignments and values</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/user-portfolios/new">
            <Plus className="mr-2 h-4 w-4" />
            Add User Portfolio
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All User Portfolios</CardTitle>
          <CardDescription>View and manage all user portfolio assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <UserPortfolioListing rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
}
