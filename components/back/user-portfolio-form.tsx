// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // Mock data - replace with actual database queries
// const mockUsers = [
//   { id: "1", name: "John Doe", email: "john@example.com" },
//   { id: "2", name: "Jane Smith", email: "jane@example.com" },
//   { id: "3", name: "Bob Johnson", email: "bob@example.com" },
// ]

// const mockPortfolios = [
//   { id: "1", name: "Growth Portfolio" },
//   { id: "2", name: "Balanced Portfolio" },
//   { id: "3", name: "Conservative Portfolio" },
// ]

// interface UserPortfolioFormProps {
//   userPortfolio?: {
//     id: string
//     userId: string
//     portfolioId: string
//     portfolioValue: number
//   }
// }

// export function UserPortfolioForm({ userPortfolio }: UserPortfolioFormProps) {
//   const router = useRouter()
//   const [userId, setUserId] = useState(userPortfolio?.userId || "")
//   const [portfolioId, setPortfolioId] = useState(userPortfolio?.portfolioId || "")
//   const [portfolioValue, setPortfolioValue] = useState(userPortfolio?.portfolioValue.toString() || "0")

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     // TODO: Replace with actual API call to create/update user portfolio
//     console.log("Submitting user portfolio:", {
//       userId,
//       portfolioId,
//       portfolioValue: Number.parseFloat(portfolioValue),
//     })

//     // Redirect back to user portfolios list
//     router.push("/dashboard/user-portfolios")
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="space-y-2">
//         <Label htmlFor="userId">User *</Label>
//         <Select value={userId} onValueChange={setUserId} disabled={!!userPortfolio} required>
//           <SelectTrigger id="userId">
//             <SelectValue placeholder="Select a user" />
//           </SelectTrigger>
//           <SelectContent>
//             {mockUsers.map((user) => (
//               <SelectItem key={user.id} value={user.id}>
//                 {user.name} ({user.email})
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {userPortfolio && <p className="text-sm text-muted-foreground">User cannot be changed after creation</p>}
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="portfolioId">Portfolio *</Label>
//         <Select value={portfolioId} onValueChange={setPortfolioId} disabled={!!userPortfolio} required>
//           <SelectTrigger id="portfolioId">
//             <SelectValue placeholder="Select a portfolio" />
//           </SelectTrigger>
//           <SelectContent>
//             {mockPortfolios.map((portfolio) => (
//               <SelectItem key={portfolio.id} value={portfolio.id}>
//                 {portfolio.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {userPortfolio && <p className="text-sm text-muted-foreground">Portfolio cannot be changed after creation</p>}
//       </div>
//       <div className="flex gap-4">
//         <Button type="submit" className="flex-1">
//           {userPortfolio ? "Update User Portfolio" : "Create User Portfolio"}
//         </Button>
//         <Button type="button" variant="outline" onClick={() => router.back()}>
//           Cancel
//         </Button>
//       </div>
//     </form>
//   )
// }


// components/back/user-portfolio-form.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createUserPortfolio } from "@/actions/user-portfolios";

type UserOption = { id: string; name?: string | null; firstName?: string | null; lastName?: string | null; email: string };
type PortfolioOption = { id: string; name: string };

interface UserPortfolioFormProps {
  users: any;
  portfolios: any;
  userPortfolio?: {
    id: string;
    userId: string;
    portfolioId: string;
    portfolioValue: number;
  };
}

export function UserPortfolioForm({ users, portfolios, userPortfolio }: UserPortfolioFormProps) {
  const router = useRouter();
  const [userId, setUserId] = useState(userPortfolio?.userId || "");
  const [portfolioId, setPortfolioId] = useState(userPortfolio?.portfolioId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fullName = (u: UserOption) =>
    (u.name && u.name.trim()) ||
    [u.firstName, u.lastName].filter(Boolean).join(" ").trim() ||
    u.email;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !portfolioId) {
      toast.error("Please select both user and portfolio.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (userPortfolio) {
        // (Optional) Add an update action if you support editing later
        toast.info("Editing existing user portfolio is not enabled yet.");
      } else {
        const res = await createUserPortfolio({
          userId,
          portfolioId,
          include: { user: true, portfolio: true, userAssets: true },
        });

        if (!res.success) {
          toast.error(res.error ?? "Failed to create user portfolio.");
          setIsSubmitting(false);
          return;
        }

        toast.success("User portfolio created!");
        router.push("/dashboard/user-portfolios");
        router.refresh();
      }
    } catch (err: any) {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="userId">User *</Label>
        <Select value={userId} onValueChange={setUserId} disabled={!!userPortfolio} required>
          <SelectTrigger id="userId">
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {users.map((u:any) => (
              <SelectItem key={u.id} value={u.id}>
                {fullName(u)}{u.email ? ` (${u.email})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {userPortfolio && <p className="text-sm text-muted-foreground">User cannot be changed after creation</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="portfolioId">Portfolio *</Label>
        <Select value={portfolioId} onValueChange={setPortfolioId} disabled={!!userPortfolio} required>
          <SelectTrigger id="portfolioId">
            <SelectValue placeholder="Select a portfolio" />
          </SelectTrigger>
          <SelectContent>
            {portfolios.map((p:any) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {userPortfolio && <p className="text-sm text-muted-foreground">Portfolio cannot be changed after creation</p>}
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : userPortfolio ? "Update User Portfolio" : "Create User Portfolio"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
