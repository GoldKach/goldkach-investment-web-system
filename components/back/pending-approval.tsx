// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { Search, MoreVertical, Eye, CheckCircle, XCircle, Clock, Building2, UserIcon } from "lucide-react"
// import Link from "next/link"

// // Mock data based on EntityOnboarding schema
// const mockPendingUsers = [
//   {
//     id: "1",
//     userId: "user1",
//     fullName: "Michael Anderson",
//     email: "michael.anderson@email.com",
//     phone: "+1234567890",
//     entityType: "individual",
//     dateOfBirth: new Date("1985-06-15"),
//     tin: "TIN123456789",
//     avatarUrl: "/professional-businessman.png",
//     homeAddress: "123 Main St, New York, NY 10001",
//     employmentStatus: "Employed",
//     occupation: "Software Engineer",
//     primaryGoal: "Wealth Growth",
//     timeHorizon: "Long-term (10+ years)",
//     riskTolerance: "Moderate",
//     investmentExperience: "Intermediate",
//     expectedInvestment: "$50,000 - $100,000",
//     isPEP: "No",
//     isApproved: false,
//     createdAt: new Date("2024-01-15"),
//   },
//   {
//     id: "2",
//     userId: "user2",
//     fullName: "TechCorp Solutions Ltd",
//     email: "admin@techcorp.com",
//     phone: "+1987654321",
//     entityType: "company",
//     dateOfBirth: new Date("1990-01-01"),
//     tin: "TIN987654321",
//     avatarUrl: null,
//     homeAddress: "456 Business Ave, San Francisco, CA 94102",
//     companyName: "TechCorp Solutions Ltd",
//     registrationNumber: "REG2024001",
//     companyAddress: "456 Business Ave, San Francisco, CA 94102",
//     businessType: "Technology Services",
//     incorporationDate: new Date("2020-03-20"),
//     authorizedRepName: "Jennifer Smith",
//     authorizedRepEmail: "jennifer.smith@techcorp.com",
//     authorizedRepPhone: "+1555123456",
//     authorizedRepPosition: "CEO",
//     primaryGoal: "Capital Preservation",
//     timeHorizon: "Medium-term (5-10 years)",
//     riskTolerance: "Conservative",
//     investmentExperience: "Advanced",
//     expectedInvestment: "$500,000+",
//     isPEP: "No",
//     isApproved: false,
//     createdAt: new Date("2024-01-18"),
//   },
//   {
//     id: "3",
//     userId: "user3",
//     fullName: "Sarah Williams",
//     email: "sarah.williams@email.com",
//     phone: "+1122334455",
//     entityType: "individual",
//     dateOfBirth: new Date("1992-09-22"),
//     tin: "TIN456789123",
//     avatarUrl: "/professional-businesswoman.png",
//     homeAddress: "789 Oak Street, Boston, MA 02101",
//     employmentStatus: "Self-Employed",
//     occupation: "Business Consultant",
//     primaryGoal: "Retirement Planning",
//     timeHorizon: "Long-term (10+ years)",
//     riskTolerance: "Aggressive",
//     investmentExperience: "Beginner",
//     expectedInvestment: "$25,000 - $50,000",
//     isPEP: "No",
//     isApproved: false,
//     createdAt: new Date("2024-01-20"),
//   },
// ]

// export default function PendingApprovals() {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedUser, setSelectedUser] = useState<string | null>(null)
//   const [approvalAction, setApprovalAction] = useState<"approve" | "reject" | null>(null)

//   const filteredUsers = mockPendingUsers.filter(
//     (user) =>
//       user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.tin.toLowerCase().includes(searchQuery.toLowerCase()),
//   )

//   const handleApprove = (userId: string) => {
//     setSelectedUser(userId)
//     setApprovalAction("approve")
//   }

//   const handleReject = (userId: string) => {
//     setSelectedUser(userId)
//     setApprovalAction("reject")
//   }

//   const confirmAction = () => {
//     console.log(`[v0] ${approvalAction} user:`, selectedUser)
//     // Add your approval/rejection logic here
//     setSelectedUser(null)
//     setApprovalAction(null)
//   }

//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2)
//   }

//   const formatDate = (date: Date) => {
//     return new Intl.DateTimeFormat("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     }).format(date)
//   }

//   const getDaysWaiting = (createdAt: Date) => {
//     const now = new Date()
//     const diff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
//     return diff
//   }

//   return (
//     <div className="space-y-6">
//       {/* Statistics Cards */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card className="border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
//             <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{mockPendingUsers.length}</div>
//             <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">Awaiting review</p>
//           </CardContent>
//         </Card>

//         <Card className="border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Individual Accounts</CardTitle>
//             <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
//               {mockPendingUsers.filter((u) => u.entityType === "individual").length}
//             </div>
//             <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">Personal investors</p>
//           </CardContent>
//         </Card>

//         <Card className="border-purple-200 dark:border-purple-900/50 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Company Accounts</CardTitle>
//             <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
//               {mockPendingUsers.filter((u) => u.entityType === "company").length}
//             </div>
//             <p className="text-xs text-purple-600 dark:text-purple-500 mt-1">Corporate investors</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Table Card */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Pending Approvals</CardTitle>
//               <CardDescription>Review and approve new user onboarding applications</CardDescription>
//             </div>
//           </div>
//           <div className="flex items-center gap-4 mt-4">
//             <div className="relative flex-1 max-w-sm">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 placeholder="Search by name, email, or TIN..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-9"
//               />
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Applicant</TableHead>
//                 <TableHead>Type</TableHead>
//                 <TableHead>Contact</TableHead>
//                 <TableHead>TIN</TableHead>
//                 <TableHead>Risk Profile</TableHead>
//                 <TableHead>Submitted</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredUsers.map((user) => (
//                 <TableRow key={user.id} className="group hover:bg-muted/50">
//                   <TableCell>
//                     <div className="flex items-center gap-3">
//                       <Avatar className="h-10 w-10 border-2 border-primary/20">
//                         <AvatarImage src={user.avatarUrl || undefined} alt={user.fullName} />
//                         <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
//                           {getInitials(user.fullName)}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <div className="font-medium">{user.fullName}</div>
//                         <div className="text-sm text-muted-foreground">
//                           {user.entityType === "company" ? user.companyName : user.occupation}
//                         </div>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant={user.entityType === "individual" ? "default" : "secondary"} className="capitalize">
//                       {user.entityType === "individual" ? (
//                         <UserIcon className="h-3 w-3 mr-1" />
//                       ) : (
//                         <Building2 className="h-3 w-3 mr-1" />
//                       )}
//                       {user.entityType}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <div className="space-y-1">
//                       <div className="text-sm">{user.email}</div>
//                       <div className="text-xs text-muted-foreground">{user.phone}</div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <code className="text-xs bg-muted px-2 py-1 rounded">{user.tin}</code>
//                   </TableCell>
//                   <TableCell>
//                     <Badge
//                       variant="outline"
//                       className={
//                         user.riskTolerance === "Aggressive"
//                           ? "border-red-500 text-red-700 dark:text-red-400"
//                           : user.riskTolerance === "Moderate"
//                             ? "border-amber-500 text-amber-700 dark:text-amber-400"
//                             : "border-green-500 text-green-700 dark:text-green-400"
//                       }
//                     >
//                       {user.riskTolerance}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <div className="text-sm">{formatDate(user.createdAt)}</div>
//                     <div className="text-xs text-muted-foreground">{getDaysWaiting(user.createdAt)} days ago</div>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon" className="h-8 w-8">
//                           <MoreVertical className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end" className="w-48">
//                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem asChild>
//                           <Link href={`/users/${user.userId}/details`} className="cursor-pointer">
//                             <Eye className="h-4 w-4 mr-2" />
//                             View Details
//                           </Link>
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem
//                           onClick={() => handleApprove(user.userId)}
//                           className="text-green-600 dark:text-green-400 cursor-pointer"
//                         >
//                           <CheckCircle className="h-4 w-4 mr-2" />
//                           Approve
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => handleReject(user.userId)}
//                           className="text-red-600 dark:text-red-400 cursor-pointer"
//                         >
//                           <XCircle className="h-4 w-4 mr-2" />
//                           Reject
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           {filteredUsers.length === 0 && (
//             <div className="text-center py-12">
//               <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//               <h3 className="text-lg font-semibold mb-2">No pending approvals</h3>
//               <p className="text-sm text-muted-foreground">All applications have been reviewed</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Approval/Rejection Dialog */}
//       <AlertDialog open={approvalAction !== null} onOpenChange={() => setApprovalAction(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>
//               {approvalAction === "approve" ? "Approve Application" : "Reject Application"}
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               {approvalAction === "approve"
//                 ? "Are you sure you want to approve this user's application? They will gain access to the investment platform."
//                 : "Are you sure you want to reject this user's application? This action can be reversed later."}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={confirmAction}
//               className={
//                 approvalAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
//               }
//             >
//               {approvalAction === "approve" ? "Approve" : "Reject"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   )
// }


"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  User as UserIcon,
} from "lucide-react";
import { updateUserById } from "@/actions/auth";

type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED" | "DEACTIVATED" | "BANNED";

type EntityType = "individual" | "company";

type PendingUser = {
  id: string;
  email?: string;
  phone?: string;
  status?: UserStatus;
  imageUrl?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string | Date;
  entityOnboarding?: {
    fullName?: string;
    entityType?: EntityType;
    tin?: string;
    riskTolerance?: "Aggressive" | "Moderate" | "Conservative" | string;
    isApproved?: boolean;
    companyName?: string;
    occupation?: string;
    createdAt?: string | Date;
  } | null;
};

export default function PendingApprovals({ users }: { users: PendingUser[] }) {
  const [items, setItems] = useState<PendingUser[]>(users ?? []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject" | null>(null);

  const displayName = (u: PendingUser) =>
    u.entityOnboarding?.fullName ||
    u.name ||
    [u.firstName, u.lastName].filter(Boolean).join(" ") ||
    u.email ||
    "Unknown";

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((u) => {
      const name = displayName(u).toLowerCase();
      const email = (u.email ?? "").toLowerCase();
      const tin = (u.entityOnboarding?.tin ?? "").toLowerCase();
      return name.includes(q) || email.includes(q) || tin.includes(q);
    });
  }, [items, searchQuery]);

  const stats = useMemo(() => {
    const individuals = items.filter((u) => u.entityOnboarding?.entityType === "individual").length;
    const companies = items.filter((u) => u.entityOnboarding?.entityType === "company").length;
    return { total: items.length, individuals, companies };
  }, [items]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const asDate = (d?: string | Date) => (d ? new Date(d) : null);
  const formatDate = (d?: string | Date) => {
    const dt = asDate(d);
    if (!dt) return "-";
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(dt);
  };
  const daysAgo = (d?: string | Date) => {
    const dt = asDate(d);
    if (!dt) return "-";
    const diff = Math.floor((Date.now() - dt.getTime()) / (1000 * 60 * 60 * 24));
    return `${diff} days ago`;
  };

  const openApprove = (id: string) => {
    setSelectedUserId(id);
    setApprovalAction("approve");
  };
  const openReject = (id: string) => {
    setSelectedUserId(id);
    setApprovalAction("reject");
  };
  const closeDialog = () => {
    setSelectedUserId(null);
    setApprovalAction(null);
  };

  const confirmAction = async () => {
    if (!selectedUserId || !approvalAction) return;
    // optimistic: remove from pending list (since it will no longer be pending)
    const prev = items;
    setItems((list) => list.filter((u) => u.id !== selectedUserId));
    try {
      const nextStatus: UserStatus = approvalAction === "approve" ? "ACTIVE" : "DEACTIVATED";
      const res = await updateUserById(selectedUserId, { status: nextStatus });
      if (res?.error) throw new Error(res.error);
      toast.success(approvalAction === "approve" ? "Application approved" : "Application rejected");
    } catch (e: any) {
      // revert on error
      setItems(prev);
      toast.error(e?.message || "Failed to update application");
    } finally {
      closeDialog();
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.total}</div>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Individual Accounts</CardTitle>
            <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.individuals}</div>
            <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">Personal investors</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-900/50 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.companies}</div>
            <p className="text-xs text-purple-600 dark:text-purple-500 mt-1">Corporate investors</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Review and approve new user onboarding applications</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or TIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>TIN</TableHead>
                <TableHead>Risk Profile</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => {
                const name = displayName(u);
                const type = u.entityOnboarding?.entityType ?? "individual";
                const risk = u.entityOnboarding?.riskTolerance;
                const submitted = u.entityOnboarding?.createdAt ?? u.createdAt;
                const tin = u.entityOnboarding?.tin;

                return (
                  <TableRow key={u.id} className="group hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarImage src={u.imageUrl || undefined} alt={name} />
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                            {getInitials(name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{name}</div>
                          <div className="text-sm text-muted-foreground">
                            {type === "company" ? u.entityOnboarding?.companyName : u.entityOnboarding?.occupation}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant={type === "individual" ? "default" : "secondary"} className="capitalize">
                        {type === "individual" ? (
                          <UserIcon className="h-3 w-3 mr-1" />
                        ) : (
                          <Building2 className="h-3 w-3 mr-1" />
                        )}
                        {type}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{u.email}</div>
                        <div className="text-xs text-muted-foreground">{u.phone}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{tin || "-"}</code>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          risk === "Aggressive"
                            ? "border-red-500 text-red-700 dark:text-red-400"
                            : risk === "Moderate"
                            ? "border-amber-500 text-amber-700 dark:text-amber-400"
                            : "border-green-500 text-green-700 dark:text-green-400"
                        }
                      >
                        {risk || "—"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm">{formatDate(submitted)}</div>
                      <div className="text-xs text-muted-foreground">{daysAgo(submitted)}</div>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/users/${u.id}`} className="cursor-pointer">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openApprove(u.id)}
                            className="text-green-600 dark:text-green-400 cursor-pointer"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openReject(u.id)}
                            className="text-red-600 dark:text-red-400 cursor-pointer"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No pending approvals</h3>
              <p className="text-sm text-muted-foreground">All applications have been reviewed</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve/Reject Dialog */}
      <AlertDialog open={approvalAction !== null} onOpenChange={closeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {approvalAction === "approve" ? "Approve Application" : "Reject Application"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {approvalAction === "approve"
                ? "Approve this user's application and activate their account."
                : "Reject this user's application. You can change this later if needed."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={approvalAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {approvalAction === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
