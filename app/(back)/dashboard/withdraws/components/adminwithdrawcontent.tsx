// // app/admin/withdrawals/components/admin-withdrawals-content.tsx
// "use client";

// import { useState, useMemo } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Search, Filter, Download, RefreshCw, Eye } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { Withdrawal } from "@/actions/withdraws";
// import { WithdrawalDetailsModal } from "./deposit-details-modal";

// interface AdminWithdrawalsContentProps {
//   withdrawals: Withdrawal[];
//   adminId: string;
//   adminName: string;
// }

// export function AdminWithdrawalsContent({
//   withdrawals,
//   adminId,
//   adminName,
// }: AdminWithdrawalsContentProps) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const router = useRouter();

//   // Filter & search withdrawals
//   const filteredWithdrawals = useMemo(() => {
//     const q = searchQuery.toLowerCase();
//     return withdrawals.filter((w) => {
//       const matchesSearch =
//         w.transactionId?.toLowerCase().includes(q) ||
//         w.user?.name?.toLowerCase().includes(q) ||
//         w.user?.email?.toLowerCase().includes(q) ||
//         w.id.toLowerCase().includes(q);

//       const matchesStatus = statusFilter === "all" || w.transactionStatus === statusFilter;

//       return matchesSearch && matchesStatus;
//     });
//   }, [withdrawals, searchQuery, statusFilter]);

//   // Stats
//   const stats = useMemo(() => {
//     const pending = withdrawals.filter((d) => d.transactionStatus === "PENDING");
//     const approved = withdrawals.filter((d) => d.transactionStatus === "APPROVED");
//     const rejected = withdrawals.filter((d) => d.transactionStatus === "REJECTED");

//     return {
//       total: withdrawals.length,
//       pending: pending.length,
//       approved: approved.length,
//       rejected: rejected.length,
//       totalAmount: withdrawals.reduce((sum, d) => sum + d.amount, 0),
//       approvedAmount: approved.reduce((sum, d) => sum + d.amount, 0),
//       pendingAmount: pending.reduce((sum, d) => sum + d.amount, 0),
//     };
//   }, [withdrawals]);

//   const handleViewDetails = (withdrawal: Withdrawal) => {
//     setSelectedWithdrawal(withdrawal);
//     setIsModalOpen(true);
//   };

//   const handleRefresh = () => {
//     router.refresh();
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "PENDING":
//         return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
//       case "APPROVED":
//         return "bg-green-500/20 text-green-400 border-green-500/30";
//       case "REJECTED":
//         return "bg-red-500/20 text-red-400 border-red-500/30";
//       default:
//         return "bg-slate-500/20 text-slate-400 border-slate-500/30";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-8">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-4xl font-bold text-white mb-2">Withdrawal Management</h1>
//             <p className="text-slate-400">Review and manage all withdrawal requests</p>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={handleRefresh}
//               className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
//             >
//               <RefreshCw className="h-4 w-4 mr-2" />
//               Refresh
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
//             >
//               <Download className="h-4 w-4 mr-2" />
//               Export
//             </Button>
//           </div>
//         </div>

//         {/* Statistics */}
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <Card className="bg-slate-900/50 border-slate-700">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-slate-400">Total Withdrawals</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-white">{stats.total}</div>
//               <p className="text-xs text-slate-500 mt-1">${stats.totalAmount.toLocaleString()}</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-slate-900/50 border-slate-700">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-slate-400">Pending</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
//               <p className="text-xs text-slate-500 mt-1">${stats.pendingAmount.toLocaleString()}</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-slate-900/50 border-slate-700">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-slate-400">Approved</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
//               <p className="text-xs text-slate-500 mt-1">${stats.approvedAmount.toLocaleString()}</p>
//             </CardContent>
//           </Card>

//           <Card className="bg-slate-900/50 border-slate-700">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm font-medium text-slate-400">Rejected</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
//               <p className="text-xs text-slate-500 mt-1">{stats.rejected} requests</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Filters */}
//         <Card className="bg-slate-900/50 border-slate-700">
//           <CardContent className="pt-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//                 <Input
//                   placeholder="Search by transaction ID, user name, or email..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10 bg-slate-800 border-slate-700 text-white"
//                 />
//               </div>
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700 text-white">
//                   <Filter className="h-4 w-4 mr-2" />
//                   <SelectValue placeholder="Filter by status" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-slate-800 border-slate-700">
//                   <SelectItem value="all">All Status</SelectItem>
//                   <SelectItem value="PENDING">Pending</SelectItem>
//                   <SelectItem value="APPROVED">Approved</SelectItem>
//                   <SelectItem value="REJECTED">Rejected</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Withdrawals Table */}
//         <Card className="bg-slate-900/50 border-slate-700">
//           <CardHeader>
//             <CardTitle className="text-white">Withdrawals ({filteredWithdrawals.length})</CardTitle>
//             <CardDescription className="text-slate-400">
//               Click on any withdrawal to view details and take action
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               {filteredWithdrawals.length === 0 ? (
//                 <div className="text-center py-12 text-slate-400">
//                   <p>No withdrawals found</p>
//                 </div>
//               ) : (
//                 filteredWithdrawals.map((w) => (
//                   <div
//                     key={w.id}
//                     className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer"
//                     onClick={() => handleViewDetails(w)}
//                   >
//                     <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
//                       <div>
//                         <p className="text-xs text-slate-500">User</p>
//                         <p className="text-white font-medium">{w.user?.name || "N/A"}</p>
//                         <p className="text-xs text-slate-400">{w.user?.email || ""}</p>
//                       </div>

//                       <div>
//                         <p className="text-xs text-slate-500">Amount</p>
//                         <p className="text-white font-bold text-lg">${w.amount.toLocaleString()}</p>
//                       </div>

//                       <div>
//                         <p className="text-xs text-slate-500">Method</p>
//                         <p className="text-white">{w.method || "N/A"}</p>
//                       </div>

//                       <div>
//                         <p className="text-xs text-slate-500">Transaction ID</p>
//                         <code className="text-white text-xs font-mono">{w.transactionId || "N/A"}</code>
//                       </div>

//                       <div>
//                         <p className="text-xs text-slate-500 mb-1">Status</p>
//                         <Badge variant="outline" className={getStatusColor(w.transactionStatus)}>
//                           {w.transactionStatus}
//                         </Badge>
//                       </div>
//                     </div>

//                     <Button variant="ghost" size="sm" className="ml-4 text-slate-400 hover:text-white">
//                       <Eye className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 ))
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Details Modal */}
//       {selectedWithdrawal && (
//         <WithdrawalDetailsModal
//           withdrawal={selectedWithdrawal}
//           isOpen={isModalOpen}
//           onClose={() => {
//             setIsModalOpen(false);
//             setSelectedWithdrawal(null);
//           }}
//           adminId={adminId}
//           adminName={adminName}
//           onSuccess={handleRefresh}
//         />
//       )}
//     </div>
//   );
// }





// app/admin/withdrawals/components/admin-withdrawals-content.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, RefreshCw, Eye } from "lucide-react";
import { Withdrawal } from "@/actions/withdraws";
import { WithdrawalDetailsModal } from "./withdraw-details-model";

interface AdminWithdrawalsContentProps {
  withdrawals: Withdrawal[];
  adminId: string;
  adminName: string;
}

export function AdminWithdrawalsContent({
  withdrawals,
  adminId,
  adminName,
}: AdminWithdrawalsContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // Filter & search withdrawals
  const filteredWithdrawals = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return withdrawals.filter((w) => {
      const matchesSearch =
        (w.transactionId?.toLowerCase().includes(q) ?? false) ||
        (w.user?.name?.toLowerCase().includes(q) ?? false) ||
        (w.user?.email?.toLowerCase().includes(q) ?? false) ||
        w.id.toLowerCase().includes(q) ||
        (w.referenceNo?.toLowerCase().includes(q) ?? false);

      const matchesStatus = statusFilter === "all" || w.transactionStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [withdrawals, searchQuery, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const pending = withdrawals.filter((d) => d.transactionStatus === "PENDING");
    const approved = withdrawals.filter((d) => d.transactionStatus === "APPROVED");
    const rejected = withdrawals.filter((d) => d.transactionStatus === "REJECTED");

    return {
      total: withdrawals.length,
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length,
      totalAmount: withdrawals.reduce((sum, d) => sum + d.amount, 0),
      approvedAmount: approved.reduce((sum, d) => sum + d.amount, 0),
      pendingAmount: pending.reduce((sum, d) => sum + d.amount, 0),
    };
  }, [withdrawals]);

  const handleViewDetails = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    router.refresh();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "APPROVED":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "REJECTED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Withdrawal Management</h1>
            <p className="text-slate-400">Review and manage all withdrawal requests</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <p className="text-xs text-slate-500 mt-1">${stats.totalAmount.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
              <p className="text-xs text-slate-500 mt-1">${stats.pendingAmount.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
              <p className="text-xs text-slate-500 mt-1">${stats.approvedAmount.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
              <p className="text-xs text-slate-500 mt-1">{stats.rejected} requests</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by transaction ID, reference, user name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-700 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawals Table */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Withdrawals ({filteredWithdrawals.length})
            </CardTitle>
            <CardDescription className="text-slate-400">
              Click on any withdrawal to view details and take action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredWithdrawals.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p>No withdrawals found</p>
                </div>
              ) : (
                filteredWithdrawals.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(w)}
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-slate-500">User</p>
                        <p className="text-white font-medium">{w.user?.name || "N/A"}</p>
                        <p className="text-xs text-slate-400">{w.user?.email || ""}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Amount</p>
                        <p className="text-white font-bold text-lg">
                          ${w.amount.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Method</p>
                        <p className="text-white">{w.method || "N/A"}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Reference</p>
                        <code className="text-white text-xs font-mono">
                          {w.referenceNo || "N/A"}
                        </code>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 mb-1">Status</p>
                        <Badge variant="outline" className={getStatusColor(w.transactionStatus)}>
                          {w.transactionStatus}
                        </Badge>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" className="ml-4 text-slate-400 hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Modal */}
      {selectedWithdrawal && (
        <WithdrawalDetailsModal
          withdrawal={selectedWithdrawal}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedWithdrawal(null);
          }}
          adminId={adminId}
          adminName={adminName}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}
