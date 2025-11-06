

// // // app/admin/withdrawals/components/withdrawal-details-modal.tsx
// // "use client";

// // import { useState } from "react";
// // import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { Separator } from "@/components/ui/separator";
// // import {
// //   CheckCircle,
// //   XCircle,
// //   Clock,
// //   User,
// //   Wallet,
// //   CreditCard,
// //   FileText,
// //   AlertCircle,
// // } from "lucide-react";
// // import { toast } from "sonner";
// // import { useRouter } from "next/navigation";
// // import { approveWithdrawal, rejectWithdrawal, Withdrawal } from "@/actions/withdraws";

// // interface WithdrawalDetailsModalProps {
// //   withdrawal: Withdrawal;
// //   isOpen: boolean;
// //   onClose: () => void;
// //   adminId: string;
// //   adminName: string;
// //   onSuccess: () => void;
// // }

// // export function WithdrawalDetailsModal({
// //   withdrawal,
// //   isOpen,
// //   onClose,
// //   adminId,
// //   adminName,
// //   onSuccess,
// // }: WithdrawalDetailsModalProps) {
// //   const [isApproving, setIsApproving] = useState(false);
// //   const [isRejecting, setIsRejecting] = useState(false);
// //   const router = useRouter();

// //   const handleApprove = async () => {
// //     if (
// //       !confirm(
// //         `Approve withdrawal of $${withdrawal.amount.toLocaleString()} for ${
// //           withdrawal.user?.name || "this user"
// //         }?`
// //       )
// //     ) {
// //       return;
// //     }

// //     setIsApproving(true);
// //     try {
// //       const result = await approveWithdrawal(withdrawal.id, {
// //         approvedById: adminId,
// //         approvedByName: adminName,
// //       });
// //       if (result.success) {
// //         toast.success("Withdrawal approved successfully!");
// //         onSuccess();
// //         onClose();
// //       } else {
// //         toast.error(result.error || "Failed to approve withdrawal");
// //       }
// //     } catch (error) {
// //       console.error("Error approving withdrawal:", error);
// //       toast.error("An unexpected error occurred");
// //     } finally {
// //       setIsApproving(false);
// //     }
// //   };

// //   const handleReject = async () => {
// //     const reason =
// //       prompt(
// //         `Provide a reason for rejecting the withdrawal of $${withdrawal.amount.toLocaleString()} for ${
// //           withdrawal.user?.name || "this user"
// //         } (optional):`
// //       ) ?? "";

// //     if (!confirm("Confirm rejection?")) return;

// //     setIsRejecting(true);
// //     try {
// //       const result = await rejectWithdrawal(withdrawal.id, {
// //         reason,
// //         rejectedById: adminId,
// //         rejectedByName: adminName,
// //       });
// //       if (result.success) {
// //         toast.success("Withdrawal rejected");
// //         onSuccess();
// //         onClose();
// //       } else {
// //         toast.error(result.error || "Failed to reject withdrawal");
// //       }
// //     } catch (error) {
// //       console.error("Error rejecting withdrawal:", error);
// //       toast.error("An unexpected error occurred");
// //     } finally {
// //       setIsRejecting(false);
// //     }
// //   };

// //   const getStatusIcon = () => {
// //     switch (withdrawal.transactionStatus) {
// //       case "PENDING":
// //         return <Clock className="h-5 w-5 text-yellow-400" />;
// //       case "APPROVED":
// //         return <CheckCircle className="h-5 w-5 text-green-400" />;
// //       case "REJECTED":
// //         return <XCircle className="h-5 w-5 text-red-400" />;
// //     }
// //   };

// //   const getStatusColor = () => {
// //     switch (withdrawal.transactionStatus) {
// //       case "PENDING":
// //         return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
// //       case "APPROVED":
// //         return "bg-green-500/20 text-green-400 border-green-500/30";
// //       case "REJECTED":
// //         return "bg-red-500/20 text-red-400 border-red-500/30";
// //     }
// //   };

// //   return (
// //     <Dialog open={isOpen} onOpenChange={onClose}>
// //       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-800">
// //         <DialogHeader>
// //           <DialogTitle className="text-white text-xl flex items-center gap-2">
// //             {getStatusIcon()}
// //             Withdrawal Details
// //           </DialogTitle>
// //         </DialogHeader>

// //         <div className="space-y-6 mt-4">
// //           {/* Status */}
// //           <div className="flex items-center justify-between">
// //             <Badge variant="outline" className={`text-sm px-3 py-1 ${getStatusColor()}`}>
// //               {withdrawal.transactionStatus}
// //             </Badge>
// //             <p className="text-slate-400 text-sm">
// //               ID: <code className="text-slate-300 font-mono">{withdrawal.id.slice(0, 8)}</code>
// //             </p>
// //           </div>

// //           {/* Amount */}
// //           <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
// //             <p className="text-slate-400 text-sm mb-2">Amount</p>
// //             <p className="text-4xl font-bold text-white">${withdrawal.amount.toLocaleString()}</p>
// //           </div>

// //           {/* User */}
// //           <div>
// //             <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
// //               <User className="h-4 w-4" />
// //               User Information
// //             </h3>
// //             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
// //               <div className="flex justify-between">
// //                 <span className="text-slate-400">Name:</span>
// //                 <span className="text-white">{withdrawal.user?.name || "N/A"}</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-400">Email:</span>
// //                 <span className="text-white">{withdrawal.user?.email || "N/A"}</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-400">User ID:</span>
// //                 <code className="text-white font-mono text-sm">{withdrawal.userId}</code>
// //               </div>
// //             </div>
// //           </div>

// //           <Separator className="bg-slate-700" />

// //           {/* Transaction */}
// //           <div>
// //             <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
// //               <CreditCard className="h-4 w-4" />
// //               Transaction Details
// //             </h3>
// //             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
// //               <div className="flex justify-between">
// //                 <span className="text-slate-400">Transaction ID:</span>
// //                 <code className="text-white font-mono text-sm">
// //                   {withdrawal.transactionId || "N/A"}
// //                 </code>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-400">Reference No:</span>
// //                 <code className="text-white font-mono text-sm">
// //                   {withdrawal.referenceNo || "N/A"}
// //                 </code>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-400">Method:</span>
// //                 <span className="text-white">{withdrawal.method || "N/A"}</span>
// //               </div>
// //             </div>
// //           </div>

// //           <Separator className="bg-slate-700" />

// //           {/* Bank Details */}
// //           <div>
// //             <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
// //               <CreditCard className="h-4 w-4" />
// //               Bank Details
// //             </h3>
// //             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
// //               <div className="flex justify-between">
// //                 <span className="text-slate-400">Bank Name:</span>
// //                 <span className="text-white">{withdrawal.bankName || "N/A"}</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-400">Bank Account Name:</span>
// //                 <span className="text-white">{withdrawal.bankAccountName || "N/A"}</span>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-400">Bank Branch:</span>
// //                 <span className="text-white">{withdrawal.bankBranch || "N/A"}</span>
// //               </div>
// //               {"AccountName" in withdrawal && (
// //                 <div className="flex justify-between">
// //                   <span className="text-slate-400">Beneficiary Account Name:</span>
// //                   <span className="text-white">{(withdrawal as any).AccountName || "N/A"}</span>
// //                 </div>
// //               )}
// //               {"AccountNo" in withdrawal && (
// //                 <div className="flex justify-between">
// //                   <span className="text-slate-400">Account No:</span>
// //                   <span className="text-white">{(withdrawal as any).AccountNo || "N/A"}</span>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           <Separator className="bg-slate-700" />

// //           {/* Wallet */}
// //           <div>
// //             <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
// //               <Wallet className="h-4 w-4" />
// //               Wallet Information
// //             </h3>
// //             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
// //               <div className="flex justify-between">
// //                 <span className="text-slate-400">Wallet ID:</span>
// //                 <code className="text-white font-mono text-sm">{withdrawal.walletId}</code>
// //               </div>
// //               <div className="flex justify-between">
// //                 <span className="text-slate-400">Net Asset Value:</span>
// //                 <span className="text-white">
// //                   {withdrawal.wallet?.netAssetValue != null
// //                     ? `$${Number(withdrawal.wallet.netAssetValue).toLocaleString()}`
// //                     : "N/A"}
// //                 </span>
// //               </div>
// //             </div>
// //           </div>

// //           <Separator className="bg-slate-700" />

// //           {/* Additional / Audit */}
// //           <div>
// //             <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
// //               <FileText className="h-4 w-4" />
// //               Additional Information
// //             </h3>
// //             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
// //               <div className="flex justify-between">
// //                 <span className="text-slate-400">Created At:</span>
// //                 <span className="text-white">
// //                   {new Date(withdrawal.createdAt).toLocaleString()}
// //                 </span>
// //               </div>

// //               {/* approval audit */}
// //               {withdrawal.approvedByName && (
// //                 <div className="flex justify-between">
// //                   <span className="text-slate-400">Approved By:</span>
// //                   <span className="text-white">{withdrawal.approvedByName}</span>
// //                 </div>
// //               )}
// //               {withdrawal.approvedById && (
// //                 <div className="flex justify-between">
// //                   <span className="text-slate-400">Approved By (ID):</span>
// //                   <code className="text-white font-mono text-sm">{withdrawal.approvedById}</code>
// //                 </div>
// //               )}
// //               {withdrawal.approvedAt && (
// //                 <div className="flex justify-between">
// //                   <span className="text-slate-400">Approved At:</span>
// //                   <span className="text-white">
// //                     {new Date(withdrawal.approvedAt).toLocaleString()}
// //                   </span>
// //                 </div>
// //               )}

// //               {/* rejection audit */}
// //               {withdrawal.rejectedByName && (
// //                 <div className="flex justify-between">
// //                   <span className="text-slate-400">Rejected By:</span>
// //                   <span className="text-white">{withdrawal.rejectedByName}</span>
// //                 </div>
// //               )}
// //               {withdrawal.rejectedById && (
// //                 <div className="flex justify-between">
// //                   <span className="text-slate-400">Rejected By (ID):</span>
// //                   <code className="text-white font-mono text-sm">{withdrawal.rejectedById}</code>
// //                 </div>
// //               )}
// //               {withdrawal.rejectReason && (
// //                 <div className="flex justify-between">
// //                   <span className="text-slate-400">Reject Reason:</span>
// //                   <span className="text-white">{withdrawal.rejectReason}</span>
// //                 </div>
// //               )}
// //               {withdrawal.rejectedAt && (
// //                 <div className="flex justify-between">
// //                   <span className="text-slate-400">Rejected At:</span>
// //                   <span className="text-white">
// //                     {new Date(withdrawal.rejectedAt).toLocaleString()}
// //                   </span>
// //                 </div>
// //               )}

// //               {withdrawal.description && (
// //                 <div>
// //                   <span className="text-slate-400">Description:</span>
// //                   <p className="text-white mt-1">{withdrawal.description}</p>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Actions */}
// //           {withdrawal.transactionStatus === "PENDING" ? (
// //             <div className="flex gap-3 pt-4">
// //               <Button
// //                 onClick={handleApprove}
// //                 disabled={isApproving || isRejecting}
// //                 className="flex-1 bg-green-600 hover:bg-green-700 text-white"
// //               >
// //                 <CheckCircle className="h-4 w-4 mr-2" />
// //                 {isApproving ? "Approving..." : "Approve Withdrawal"}
// //               </Button>
// //               <Button
// //                 onClick={handleReject}
// //                 disabled={isApproving || isRejecting}
// //                 variant="destructive"
// //                 className="flex-1"
// //               >
// //                 <XCircle className="h-4 w-4 mr-2" />
// //                 {isRejecting ? "Rejecting..." : "Reject Withdrawal"}
// //               </Button>
// //             </div>
// //           ) : (
// //             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex items-center gap-2">
// //               <AlertCircle className="h-4 w-4 text-slate-400" />
// //               <p className="text-slate-400 text-sm">
// //                 This withdrawal has already been {withdrawal.transactionStatus.toLowerCase()} and
// //                 cannot be modified.
// //               </p>
// //             </div>
// //           )}
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }



// // app/admin/withdrawals/components/withdrawal-details-modal.tsx
// "use client";

// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import {
//   CheckCircle,
//   XCircle,
//   Clock,
//   User,
//   Wallet,
//   CreditCard,
//   FileText,
//   AlertCircle,
// } from "lucide-react";
// import { toast } from "sonner";
// import { approveWithdrawal, rejectWithdrawal, Withdrawal } from "@/actions/withdraws";

// interface WithdrawalDetailsModalProps {
//   withdrawal: Withdrawal;
//   isOpen: boolean;
//   onClose: () => void;
//   adminId: string;
//   adminName: string;
//   onSuccess: () => void;
// }

// export function WithdrawalDetailsModal({
//   withdrawal,
//   isOpen,
//   onClose,
//   adminId,
//   adminName,
//   onSuccess,
// }: WithdrawalDetailsModalProps) {
//   const [isApproving, setIsApproving] = useState(false);
//   const [isRejecting, setIsRejecting] = useState(false);

//   // New: transaction id field for approval
//   const [approvalTxId, setApprovalTxId] = useState<string>(withdrawal.transactionId || "");

//   const handleApprove = async () => {
//     if (
//       !confirm(
//         `Approve withdrawal of $${withdrawal.amount.toLocaleString()} for ${
//           withdrawal.user?.name || "this user"
//         }?`
//       )
//     ) {
//       return;
//     }

//     // If you want to require TX id, uncomment the guard below:
//     // if (!approvalTxId.trim()) {
//     //   toast.error("Please provide a transaction ID before approving.");
//     //   return;
//     // }

//     setIsApproving(true);
//     try {
//       const result = await approveWithdrawal(withdrawal.id, {
//         approvedById: adminId,
//         approvedByName: adminName,
//         transactionId: approvalTxId.trim() || null,
//       });
//       if (result.success) {
//         toast.success("Withdrawal approved successfully!");
//         onSuccess();
//         onClose();
//       } else {
//         toast.error(result.error || "Failed to approve withdrawal");
//       }
//     } catch (error) {
//       console.error("Error approving withdrawal:", error);
//       toast.error("An unexpected error occurred");
//     } finally {
//       setIsApproving(false);
//     }
//   };

//   const handleReject = async () => {
//     const reason =
//       prompt(
//         `Provide a reason for rejecting the withdrawal of $${withdrawal.amount.toLocaleString()} for ${
//           withdrawal.user?.name || "this user"
//         } (optional):`
//       ) ?? "";

//     if (!confirm("Confirm rejection?")) return;

//     setIsRejecting(true);
//     try {
//       const result = await rejectWithdrawal(withdrawal.id, {
//         reason,
//         rejectedById: adminId,
//         rejectedByName: adminName,
//       });
//       if (result.success) {
//         toast.success("Withdrawal rejected");
//         onSuccess();
//         onClose();
//       } else {
//         toast.error(result.error || "Failed to reject withdrawal");
//       }
//     } catch (error) {
//       console.error("Error rejecting withdrawal:", error);
//       toast.error("An unexpected error occurred");
//     } finally {
//       setIsRejecting(false);
//     }
//   };

//   const getStatusIcon = () => {
//     switch (withdrawal.transactionStatus) {
//       case "PENDING":
//         return <Clock className="h-5 w-5 text-yellow-400" />;
//       case "APPROVED":
//         return <CheckCircle className="h-5 w-5 text-green-400" />;
//       case "REJECTED":
//         return <XCircle className="h-5 w-5 text-red-400" />;
//     }
//   };

//   const getStatusColor = () => {
//     switch (withdrawal.transactionStatus) {
//       case "PENDING":
//         return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
//       case "APPROVED":
//         return "bg-green-500/20 text-green-400 border-green-500/30";
//       case "REJECTED":
//         return "bg-red-500/20 text-red-400 border-red-500/30";
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-800">
//         <DialogHeader>
//           <DialogTitle className="text-white text-xl flex items-center gap-2">
//             {getStatusIcon()}
//             Withdrawal Details
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6 mt-4">
//           {/* Status */}
//           <div className="flex items-center justify-between">
//             <Badge variant="outline" className={`text-sm px-3 py-1 ${getStatusColor()}`}>
//               {withdrawal.transactionStatus}
//             </Badge>
//             <p className="text-slate-400 text-sm">
//               ID: <code className="text-slate-300 font-mono">{withdrawal.id.slice(0, 8)}</code>
//             </p>
//           </div>

//           {/* Amount */}
//           <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
//             <p className="text-slate-400 text-sm mb-2">Amount</p>
//             <p className="text-4xl font-bold text-white">${withdrawal.amount.toLocaleString()}</p>
//           </div>

//           {/* User */}
//           <div>
//             <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
//               <User className="h-4 w-4" />
//               User Information
//             </h3>
//             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-slate-400">Name:</span>
//                 <span className="text-white">{withdrawal.user?.name || "N/A"}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-400">Email:</span>
//                 <span className="text-white">{withdrawal.user?.email || "N/A"}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-400">User ID:</span>
//                 <code className="text-white font-mono text-sm">{withdrawal.userId}</code>
//               </div>
//             </div>
//           </div>

//           <Separator className="bg-slate-700" />

//           {/* Transaction */}
//           <div>
//             <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
//               <CreditCard className="h-4 w-4" />
//               Transaction Details
//             </h3>
//             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-slate-400">Transaction ID:</span>
//                 <code className="text-white font-mono text-sm">
//                   {withdrawal.transactionId || "N/A"}
//                 </code>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-400">Reference No:</span>
//                 <code className="text-white font-mono text-sm">
//                   {withdrawal.referenceNo || "N/A"}
//                 </code>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-400">Method:</span>
//                 <span className="text-white">{withdrawal.method || "N/A"}</span>
//               </div>
//             </div>
//           </div>

//           <Separator className="bg-slate-700" />

//           {/* Bank Details */}
//           <div>
//             <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
//               <CreditCard className="h-4 w-4" />
//               Bank Details
//             </h3>
//             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-slate-400">Bank Name:</span>
//                 <span className="text-white">{withdrawal.bankName || "N/A"}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-400">Bank Account Name:</span>
//                 <span className="text-white">{withdrawal.bankAccountName || "N/A"}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-400">Bank Branch:</span>
//                 <span className="text-white">{withdrawal.bankBranch || "N/A"}</span>
//               </div>
//               {"AccountName" in withdrawal && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-400">Beneficiary Account Name:</span>
//                   <span className="text-white">{(withdrawal as any).AccountName || "N/A"}</span>
//                 </div>
//               )}
//               {"AccountNo" in withdrawal && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-400">Account No:</span>
//                   <span className="text-white">{(withdrawal as any).AccountNo || "N/A"}</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           <Separator className="bg-slate-700" />

//           {/* Wallet */}
//           <div>
//             <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
//               <Wallet className="h-4 w-4" />
//               Wallet Information
//             </h3>
//             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-slate-400">Wallet ID:</span>
//                 <code className="text-white font-mono text-sm">{withdrawal.walletId}</code>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-slate-400">Net Asset Value:</span>
//                 <span className="text-white">
//                   {withdrawal.wallet?.netAssetValue != null
//                     ? `$${Number(withdrawal.wallet.netAssetValue).toLocaleString()}`
//                     : "N/A"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <Separator className="bg-slate-700" />

//           {/* Additional / Audit */}
//           <div>
//             <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
//               <FileText className="h-4 w-4" />
//               Additional Information
//             </h3>
//             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-slate-400">Created At:</span>
//                 <span className="text-white">
//                   {new Date(withdrawal.createdAt).toLocaleString()}
//                 </span>
//               </div>

//               {/* approval audit */}
//               {withdrawal.approvedByName && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-400">Approved By:</span>
//                   <span className="text-white">{withdrawal.approvedByName}</span>
//                 </div>
//               )}
//               {withdrawal.approvedById && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-400">Approved By (ID):</span>
//                   <code className="text-white font-mono text-sm">{withdrawal.approvedById}</code>
//                 </div>
//               )}
//               {withdrawal.approvedAt && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-400">Approved At:</span>
//                   <span className="text-white">
//                     {new Date(withdrawal.approvedAt).toLocaleString()}
//                   </span>
//                 </div>
//               )}

//               {/* rejection audit */}
//               {withdrawal.rejectedByName && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-400">Rejected By:</span>
//                   <span className="text-white">{withdrawal.rejectedByName}</span>
//                 </div>
//               )}
//               {withdrawal.rejectedById && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-400">Rejected By (ID):</span>
//                   <code className="text-white font-mono text-sm">{withdrawal.rejectedById}</code>
//                 </div>
//               )}
//               {withdrawal.rejectReason && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-400">Reject Reason:</span>
//                   <span className="text-white">{withdrawal.rejectReason}</span>
//                 </div>
//               )}
//               {withdrawal.rejectedAt && (
//                 <div className="flex justify-between">
//                   <span className="text-slate-400">Rejected At:</span>
//                   <span className="text-white">
//                     {new Date(withdrawal.rejectedAt).toLocaleString()}
//                   </span>
//                 </div>
//               )}

//               {withdrawal.description && (
//                 <div>
//                   <span className="text-slate-400">Description:</span>
//                   <p className="text-white mt-1">{withdrawal.description}</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Approval Transaction ID input (admin) */}
//           {withdrawal.transactionStatus === "PENDING" && (
//             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
//               <label htmlFor="txId" className="text-slate-300 text-sm">
//                 Transaction ID (set when approving)
//               </label>
//               <Input
//                 id="txId"
//                 placeholder="Enter transaction/reference ID for this payout"
//                 value={approvalTxId}
//                 onChange={(e) => setApprovalTxId(e.target.value)}
//                 className="mt-2 bg-slate-800 border-slate-700 text-white"
//                 disabled={isApproving || isRejecting}
//               />
//               <p className="text-slate-500 text-xs mt-1">
//                 This value will be saved on approval. Leave blank to keep current value.
//               </p>
//             </div>
//           )}

//           {/* Actions */}
//           {withdrawal.transactionStatus === "PENDING" ? (
//             <div className="flex gap-3 pt-2">
//               <Button
//                 onClick={handleApprove}
//                 disabled={isApproving || isRejecting}
//                 className="flex-1 bg-green-600 hover:bg-green-700 text-white"
//               >
//                 <CheckCircle className="h-4 w-4 mr-2" />
//                 {isApproving ? "Approving..." : "Approve Withdrawal"}
//               </Button>
//               <Button
//                 onClick={handleReject}
//                 disabled={isApproving || isRejecting}
//                 variant="destructive"
//                 className="flex-1"
//               >
//                 <XCircle className="h-4 w-4 mr-2" />
//                 {isRejecting ? "Rejecting..." : "Reject Withdrawal"}
//               </Button>
//             </div>
//           ) : (
//             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex items-center gap-2">
//               <AlertCircle className="h-4 w-4 text-slate-400" />
//               <p className="text-slate-400 text-sm">
//                 This withdrawal has already been {withdrawal.transactionStatus.toLowerCase()} and
//                 cannot be modified.
//               </p>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }



// app/admin/withdrawals/components/withdrawal-details-modal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Wallet,
  CreditCard,
  FileText,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { approveWithdrawal, rejectWithdrawal, Withdrawal } from "@/actions/withdraws";

interface WithdrawalDetailsModalProps {
  withdrawal: Withdrawal;
  isOpen: boolean;
  onClose: () => void;
  adminId: string;
  adminName: string;
  onSuccess: () => void;
}

export function WithdrawalDetailsModal({
  withdrawal,
  isOpen,
  onClose,
  adminId,
  adminName,
  onSuccess,
}: WithdrawalDetailsModalProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // Transaction ID to set at approval time (pre-fill if already present)
  const [approvalTxId, setApprovalTxId] = useState<string>(withdrawal.transactionId || "");

  const handleApprove = async () => {
    if (
      !confirm(
        `Approve withdrawal of $${withdrawal.amount.toLocaleString()} for ${
          withdrawal.user?.name || "this user"
        }?`
      )
    ) {
      return;
    }

    const txId = approvalTxId.trim();
    if (!txId) {
      toast.error("Please provide a transaction ID before approving.");
      return;
    }

    setIsApproving(true);
    try {
      // NOTE: new signature => (id, transactionId, approver?, opts?)
      const result = await approveWithdrawal(withdrawal.id, txId, {
        approvedById: adminId,
        approvedByName: adminName,
      });

      if (result.success) {
        toast.success("Withdrawal approved successfully!");
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Failed to approve withdrawal");
      }
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    const reason =
      prompt(
        `Provide a reason for rejecting the withdrawal of $${withdrawal.amount.toLocaleString()} for ${
          withdrawal.user?.name || "this user"
        } (optional):`
      ) ?? "";

    if (!confirm("Confirm rejection?")) return;

    setIsRejecting(true);
    try {
      const result = await rejectWithdrawal(withdrawal.id, {
        reason,
        rejectedById: adminId,
        rejectedByName: adminName,
      });
      if (result.success) {
        toast.success("Withdrawal rejected");
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Failed to reject withdrawal");
      }
    } catch (error) {
      console.error("Error rejecting withdrawal:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsRejecting(false);
    }
  };

  const getStatusIcon = () => {
    switch (withdrawal.transactionStatus) {
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-400" />;
    }
  };

  const getStatusColor = () => {
    switch (withdrawal.transactionStatus) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "APPROVED":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "REJECTED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            {getStatusIcon()}
            Withdrawal Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={`text-sm px-3 py-1 ${getStatusColor()}`}>
              {withdrawal.transactionStatus}
            </Badge>
            <p className="text-slate-400 text-sm">
              ID: <code className="text-slate-300 font-mono">{withdrawal.id.slice(0, 8)}</code>
            </p>
          </div>

          {/* Amount */}
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">Amount</p>
            <p className="text-4xl font-bold text-white">${withdrawal.amount.toLocaleString()}</p>
          </div>

          {/* User */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              User Information
            </h3>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Name:</span>
                <span className="text-white">{withdrawal.user?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="text-white">{withdrawal.user?.email || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">User ID:</span>
                <code className="text-white font-mono text-sm">{withdrawal.userId}</code>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Transaction */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Transaction Details
            </h3>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <code className="text-white font-mono text-sm">
                  {withdrawal.transactionId || "N/A"}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reference No:</span>
                <code className="text-white font-mono text-sm">
                  {withdrawal.referenceNo || "N/A"}
                </code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Method:</span>
                <span className="text-white">{withdrawal.method || "N/A"}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Bank Details */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Bank Details
            </h3>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Bank Name:</span>
                <span className="text-white">{withdrawal.bankName || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bank Account Name:</span>
                <span className="text-white">{withdrawal.bankAccountName || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bank Branch:</span>
                <span className="text-white">{withdrawal.bankBranch || "N/A"}</span>
              </div>
              {/* {"AccountName" in withdrawal && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Beneficiary Account Name:</span>
                  <span className="text-white">{(withdrawal as any).AccountName || "N/A"}</span>
                </div>
              )} */}
              {"AccountNo" in withdrawal && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Account No:</span>
                  <span className="text-white">{(withdrawal as any).AccountNo || "N/A"}</span>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Wallet */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Wallet Information
            </h3>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Wallet ID:</span>
                <code className="text-white font-mono text-sm">{withdrawal.walletId}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Net Asset Value:</span>
                <span className="text-white">
                  {withdrawal.wallet?.netAssetValue != null
                    ? `$${Number(withdrawal.wallet.netAssetValue).toLocaleString()}`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Additional / Audit */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Additional Information
            </h3>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Created At:</span>
                <span className="text-white">{new Date(withdrawal.createdAt).toLocaleString()}</span>
              </div>

              {withdrawal.approvedByName && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Approved By:</span>
                  <span className="text-white">{withdrawal.approvedByName}</span>
                </div>
              )}
              {withdrawal.approvedById && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Approved By (ID):</span>
                  <code className="text-white font-mono text-sm">{withdrawal.approvedById}</code>
                </div>
              )}
              {withdrawal.approvedAt && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Approved At:</span>
                  <span className="text-white">{new Date(withdrawal.approvedAt).toLocaleString()}</span>
                </div>
              )}

              {withdrawal.rejectedByName && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Rejected By:</span>
                  <span className="text-white">{withdrawal.rejectedByName}</span>
                </div>
              )}
              {withdrawal.rejectedById && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Rejected By (ID):</span>
                  <code className="text-white font-mono text-sm">{withdrawal.rejectedById}</code>
                </div>
              )}
              {withdrawal.rejectReason && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Reject Reason:</span>
                  <span className="text-white">{withdrawal.rejectReason}</span>
                </div>
              )}
              {withdrawal.rejectedAt && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Rejected At:</span>
                  <span className="text-white">{new Date(withdrawal.rejectedAt).toLocaleString()}</span>
                </div>
              )}

              {withdrawal.description && (
                <div>
                  <span className="text-slate-400">Description:</span>
                  <p className="text-white mt-1">{withdrawal.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Transaction ID input (required at approval) */}
          {withdrawal.transactionStatus === "PENDING" && (
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
              <label htmlFor="txId" className="text-slate-300 text-sm">
                Transaction ID <span className="text-red-500">*</span>
              </label>
              <Input
                id="txId"
                placeholder="Enter transaction/reference ID for this payout"
                value={approvalTxId}
                onChange={(e) => setApprovalTxId(e.target.value)}
                className="mt-2 bg-slate-800 border-slate-700 text-white"
                disabled={isApproving || isRejecting}
                required
              />
              <p className="text-slate-500 text-xs mt-1">
                This value is required and will be saved on approval.
              </p>
            </div>
          )}

          {/* Actions */}
          {withdrawal.transactionStatus === "PENDING" ? (
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isApproving ? "Approving..." : "Approve Withdrawal"}
              </Button>
              <Button
                onClick={handleReject}
                disabled={isApproving || isRejecting}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                {isRejecting ? "Rejecting..." : "Reject Withdrawal"}
              </Button>
            </div>
          ) : (
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-slate-400" />
              <p className="text-slate-400 text-sm">
                This withdrawal has already been {withdrawal.transactionStatus.toLowerCase()} and
                cannot be modified.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
