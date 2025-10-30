// import React from 'react'
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Eye, Pencil, Plus, User } from "lucide-react"
// import { DeleteUserPortfolioButton } from "@/components/back/delete-user-portfolio-button"


// export default function UserportfolioListing() {
//   return (
//     <div>
//         <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>User</TableHead>
//                   <TableHead>Portfolio</TableHead>
//                   <TableHead className="text-right">Portfolio Value</TableHead>
//                   <TableHead>Created</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {mockUserPortfolios.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
//                       No user portfolios found. Assign portfolios to users to get started.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   mockUserPortfolios.map((userPortfolio) => (
//                     <TableRow key={userPortfolio.id}>
//                       <TableCell>
//                         <div>
//                           <div className="font-semibold">{userPortfolio.userName}</div>
//                           <div className="text-sm text-muted-foreground">{userPortfolio.userEmail}</div>
//                         </div>
//                       </TableCell>
//                       <TableCell className="font-semibold">{userPortfolio.portfolioName}</TableCell>
//                       <TableCell className="text-right">
//                         <Badge variant="secondary" className="font-mono">
//                           {formatCurrency(userPortfolio.portfolioValue)}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>{userPortfolio.createdAt.toLocaleDateString()}</TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex items-center justify-end gap-2">
//                           <Button variant="ghost" size="icon" asChild title="View details">
//                             <Link href={`dashboard/user-portfolios/${userPortfolio.id}`}>
//                               <Eye className="h-4 w-4" />
//                             </Link>
//                           </Button>
//                           <Button variant="ghost" size="icon" asChild title="Edit user portfolio">
//                             <Link href={`dashboard/user-portfolios/${userPortfolio.id}/edit`}>
//                               <Pencil className="h-4 w-4" />
//                             </Link>
//                           </Button>
//                           <DeleteUserPortfolioButton
//                             userPortfolioId={userPortfolio.id}
//                             userName={userPortfolio.userName}
//                             portfolioName={userPortfolio.portfolioName}
//                           />
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//     </div>
//   )
// }




// components/back/user-portfolio-listing.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil } from "lucide-react";
import { DeleteUserPortfolioButton } from "@/components/back/delete-user-portfolio-button";

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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number.isFinite(value) ? value : 0);
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
}

export function UserPortfolioListing({ rows }: { rows: Row[] }) {
  const items = Array.isArray(rows) ? rows : [];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Portfolio</TableHead>
            <TableHead className="text-right">Portfolio Value</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No user portfolios found. Assign portfolios to users to get started.
              </TableCell>
            </TableRow>
          ) : (
            items.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div>
                    <div className="font-semibold">{row.userName}</div>
                    <div className="text-sm text-muted-foreground">{row.userEmail}</div>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{row.portfolioName}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="font-mono">
                    {formatCurrency(row.portfolioValue)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild title="View details">
                      <Link href={`/dashboard/user-portfolios/${row.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild title="Edit user portfolio">
                      <Link href={`/dashboard/user-portfolios/${row.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <DeleteUserPortfolioButton
                      userPortfolioId={row.id}
                      userName={row.userName}
                      portfolioName={row.portfolioName}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

