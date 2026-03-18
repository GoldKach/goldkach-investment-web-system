// // // app/user/settings/components/account-tab.tsx
// // "use client";

// // import { useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// // import { deleteAccount, UserSettings } from "@/actions/user-settings";
// // import { toast } from "sonner";
// // import { useRouter } from "next/navigation";
// // import { AlertTriangle, Trash2, Shield, Calendar } from "lucide-react";
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// //   AlertDialogTrigger,
// // } from "@/components/ui/alert-dialog";

// // interface AccountTabProps {
// //   user: UserSettings;
// // }

// // export function AccountTab({ user }: AccountTabProps) {
// //   const router = useRouter();
// //   const [deleteForm, setDeleteForm] = useState({
// //     password: "",
// //     confirmation: "",
// //   });
// //   const [isDeleting, setIsDeleting] = useState(false);

// //   const handleDeleteAccount = async () => {
// //     if (deleteForm.confirmation !== "DELETE") {
// //       toast.error('Please type "DELETE" to confirm');
// //       return;
// //     }

// //     setIsDeleting(true);

// //     try {
// //       const result = await deleteAccount(deleteForm);

// //       if (result.success) {
// //         toast.success(result.message || "Account deactivated successfully");
// //         router.push("/login");
// //       } else {
// //         toast.error(result.error || "Failed to delete account");
// //       }
// //     } catch (error) {
// //       toast.error("An unexpected error occurred");
// //     } finally {
// //       setIsDeleting(false);
// //     }
// //   };

// //   const formatDate = (dateString: string) => {
// //     return new Date(dateString).toLocaleDateString("en-US", {
// //       year: "numeric",
// //       month: "long",
// //       day: "numeric",
// //     });
// //   };

// //   return (
// //     <div className="space-y-6">
// //       {/* Account Information */}
// //       <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
// //         <CardHeader>
// //           <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
// //             <Shield className="h-5 w-5" />
// //             Account Information
// //           </CardTitle>
// //           <CardDescription className="text-slate-600 dark:text-slate-400">
// //             View your account details and status
// //           </CardDescription>
// //         </CardHeader>
// //         <CardContent className="space-y-4">
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <div>
// //               <Label className="text-slate-600 dark:text-slate-400 text-sm">User ID</Label>
// //               <p className="text-slate-900 dark:text-white font-mono text-sm mt-1">{user.id}</p>
// //             </div>

// //             <div>
// //               <Label className="text-slate-600 dark:text-slate-400 text-sm">Role</Label>
// //               <div className="mt-1">
// //                 <Badge variant="outline" className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20">
// //                   {user.role}
// //                 </Badge>
// //               </div>
// //             </div>

// //             <div>
// //               <Label className="text-slate-600 dark:text-slate-400 text-sm">Status</Label>
// //               <div className="mt-1">
// //                 <Badge
// //                   variant="outline"
// //                   className={
// //                     user.status === "ACTIVE"
// //                       ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20"
// //                       : "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20"
// //                   }
// //                 >
// //                   {user.status}
// //                 </Badge>
// //               </div>
// //             </div>

// //             <div>
// //               <Label className="text-slate-600 dark:text-slate-400 text-sm">Email Verified</Label>
// //               <div className="mt-1">
// //                 <Badge
// //                   variant="outline"
// //                   className={
// //                     user.emailVerified
// //                       ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20"
// //                       : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20"
// //                   }
// //                 >
// //                   {user.emailVerified ? "Verified" : "Not Verified"}
// //                 </Badge>
// //               </div>
// //             </div>

// //             <div>
// //               <Label className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2">
// //                 <Calendar className="h-4 w-4" />
// //                 Member Since
// //               </Label>
// //               <p className="text-slate-900 dark:text-white text-sm mt-1">
// //                 {formatDate(user.createdAt)}
// //               </p>
// //             </div>

// //             <div>
// //               <Label className="text-slate-600 dark:text-slate-400 text-sm">Last Updated</Label>
// //               <p className="text-slate-900 dark:text-white text-sm mt-1">
// //                 {formatDate(user.updatedAt)}
// //               </p>
// //             </div>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       {/* Danger Zone */}
// //       <Card className="bg-white dark:bg-slate-900/50 border-red-200 dark:border-red-900">
// //         <CardHeader>
// //           <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
// //             <AlertTriangle className="h-5 w-5" />
// //             Danger Zone
// //           </CardTitle>
// //           <CardDescription className="text-slate-600 dark:text-slate-400">
// //             Irreversible actions that affect your account
// //           </CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
// //             <h3 className="text-red-700 dark:text-red-400 font-semibold mb-2">
// //               Delete Account
// //             </h3>
// //             <p className="text-slate-700 dark:text-slate-300 text-sm mb-4">
// //               Once you delete your account, there is no going back. Please be certain.
// //             </p>

// //             <AlertDialog>
// //               <AlertDialogTrigger asChild>
// //                 <Button
// //                   variant="destructive"
// //                   className="bg-red-600 hover:bg-red-700 text-white"
// //                 >
// //                   <Trash2 className="h-4 w-4 mr-2" />
// //                   Delete Account
// //                 </Button>
// //               </AlertDialogTrigger>
// //               <AlertDialogContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
// //                 <AlertDialogHeader>
// //                   <AlertDialogTitle className="text-slate-900 dark:text-white">
// //                     Are you absolutely sure?
// //                   </AlertDialogTitle>
// //                   <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
// //                     This action cannot be undone. This will permanently deactivate your account
// //                     and remove your access to all services.
// //                   </AlertDialogDescription>
// //                 </AlertDialogHeader>

// //                 <div className="space-y-4 py-4">
// //                   <div>
// //                     <Label htmlFor="deletePassword" className="text-slate-900 dark:text-white">
// //                       Confirm Password
// //                     </Label>
// //                     <Input
// //                       id="deletePassword"
// //                       type="password"
// //                       placeholder="Enter your password"
// //                       value={deleteForm.password}
// //                       onChange={(e) =>
// //                         setDeleteForm({ ...deleteForm, password: e.target.value })
// //                       }
// //                       className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
// //                     />
// //                   </div>

// //                   <div>
// //                     <Label htmlFor="deleteConfirmation" className="text-slate-900 dark:text-white">
// //                       Type "DELETE" to confirm
// //                     </Label>
// //                     <Input
// //                       id="deleteConfirmation"
// //                       placeholder="DELETE"
// //                       value={deleteForm.confirmation}
// //                       onChange={(e) =>
// //                         setDeleteForm({ ...deleteForm, confirmation: e.target.value })
// //                       }
// //                       className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
// //                     />
// //                   </div>
// //                 </div>

// //                 <AlertDialogFooter>
// //                   <AlertDialogCancel className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400">
// //                     Cancel
// //                   </AlertDialogCancel>
// //                   <AlertDialogAction
// //                     onClick={handleDeleteAccount}
// //                     disabled={isDeleting || deleteForm.confirmation !== "DELETE"}
// //                     className="bg-red-600 hover:bg-red-700 text-white"
// //                   >
// //                     {isDeleting ? "Deleting..." : "Delete Account"}
// //                   </AlertDialogAction>
// //                 </AlertDialogFooter>
// //               </AlertDialogContent>
// //             </AlertDialog>
// //           </div>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }





// // app/user/settings/components/account-tab.tsx
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { UserSettings } from "@/actions/user-settings";
// import { useAccessToken } from "@/hooks/useAccessToken";
// import { useAuthStore } from "@/store/authStore";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { AlertTriangle, Trash2, Shield, Calendar } from "lucide-react";
// import axios from "axios";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

// const API = process.env.NEXT_PUBLIC_API_URL || "";

// interface AccountTabProps {
//   user: UserSettings;
// }

// export function AccountTab({ user }: AccountTabProps) {
//   const router = useRouter();
//   const { accessToken, hydrated } = useAccessToken();
//   const { logout } = useAuthStore();

//   const [deleteForm, setDeleteForm] = useState({ password: "", confirmation: "" });
//   const [isDeleting, setIsDeleting] = useState(false);

//   // Wait for Zustand to rehydrate from localStorage before allowing any API calls
//   if (!hydrated) {
//     return (
//       <div className="space-y-6">
//         {[1, 2].map((i) => (
//           <div key={i} className="h-48 rounded-xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
//         ))}
//       </div>
//     );
//   }

//   const handleDeleteAccount = async () => {
//     if (deleteForm.confirmation !== "DELETE") {
//       toast.error('Please type "DELETE" to confirm.');
//       return;
//     }

//     if (!accessToken) {
//       toast.error("Not authenticated. Please log in again.");
//       return;
//     }

//     setIsDeleting(true);
//     try {
//       await axios.request({
//         method: "DELETE",
//         url: `${API}/users/settings/account`,
//         headers: { Authorization: `Bearer ${accessToken}` },
//         data: deleteForm,
//       });

//       toast.success("Account deactivated successfully.");
//       await logout();
//       router.push("/login");
//     } catch (e: any) {
//       toast.error(e?.response?.data?.error || "Failed to delete account.");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   return (
//     <div className="space-y-6">
//       {/* Account Information */}
//       <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
//         <CardHeader>
//           <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
//             <Shield className="h-5 w-5" />
//             Account Information
//           </CardTitle>
//           <CardDescription className="text-slate-600 dark:text-slate-400">
//             View your account details and status
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label className="text-slate-600 dark:text-slate-400 text-sm">User ID</Label>
//               <p className="text-slate-900 dark:text-white font-mono text-sm mt-1 break-all">
//                 {user.id}
//               </p>
//             </div>

//             <div>
//               <Label className="text-slate-600 dark:text-slate-400 text-sm">Role</Label>
//               <div className="mt-1">
//                 <Badge
//                   variant="outline"
//                   className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
//                 >
//                   {user.role}
//                 </Badge>
//               </div>
//             </div>

//             <div>
//               <Label className="text-slate-600 dark:text-slate-400 text-sm">Status</Label>
//               <div className="mt-1">
//                 <Badge
//                   variant="outline"
//                   className={
//                     user.status === "ACTIVE"
//                       ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20"
//                       : "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20"
//                   }
//                 >
//                   {user.status}
//                 </Badge>
//               </div>
//             </div>

//             <div>
//               <Label className="text-slate-600 dark:text-slate-400 text-sm">Email Verified</Label>
//               <div className="mt-1">
//                 <Badge
//                   variant="outline"
//                   className={
//                     user.emailVerified
//                       ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20"
//                       : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20"
//                   }
//                 >
//                   {user.emailVerified ? "Verified" : "Not Verified"}
//                 </Badge>
//               </div>
//             </div>

//             <div>
//               <Label className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2">
//                 <Calendar className="h-4 w-4" />
//                 Member Since
//               </Label>
//               <p className="text-slate-900 dark:text-white text-sm mt-1">
//                 {formatDate(user.createdAt)}
//               </p>
//             </div>

//             <div>
//               <Label className="text-slate-600 dark:text-slate-400 text-sm">Last Updated</Label>
//               <p className="text-slate-900 dark:text-white text-sm mt-1">
//                 {formatDate(user.updatedAt)}
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Danger Zone */}
//       <Card className="bg-white dark:bg-slate-900/50 border-red-200 dark:border-red-900">
//         <CardHeader>
//           <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
//             <AlertTriangle className="h-5 w-5" />
//             Danger Zone
//           </CardTitle>
//           <CardDescription className="text-slate-600 dark:text-slate-400">
//             Irreversible actions that affect your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
//             <h3 className="text-red-700 dark:text-red-400 font-semibold mb-2">Delete Account</h3>
//             <p className="text-slate-700 dark:text-slate-300 text-sm mb-4">
//               Once you delete your account, there is no going back. Please be certain.
//             </p>

//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Delete Account
//                 </Button>
//               </AlertDialogTrigger>
//               <AlertDialogContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
//                 <AlertDialogHeader>
//                   <AlertDialogTitle className="text-slate-900 dark:text-white">
//                     Are you absolutely sure?
//                   </AlertDialogTitle>
//                   <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
//                     This action cannot be undone. This will permanently deactivate your account
//                     and remove your access to all services.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>

//                 <div className="space-y-4 py-4">
//                   <div>
//                     <Label htmlFor="deletePassword" className="text-slate-900 dark:text-white">
//                       Confirm Password
//                     </Label>
//                     <Input
//                       id="deletePassword"
//                       type="password"
//                       placeholder="Enter your password"
//                       value={deleteForm.password}
//                       onChange={(e) => setDeleteForm({ ...deleteForm, password: e.target.value })}
//                       className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="deleteConfirmation" className="text-slate-900 dark:text-white">
//                       Type "DELETE" to confirm
//                     </Label>
//                     <Input
//                       id="deleteConfirmation"
//                       placeholder="DELETE"
//                       value={deleteForm.confirmation}
//                       onChange={(e) => setDeleteForm({ ...deleteForm, confirmation: e.target.value })}
//                       className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
//                     />
//                   </div>
//                 </div>

//                 <AlertDialogFooter>
//                   <AlertDialogCancel className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400">
//                     Cancel
//                   </AlertDialogCancel>
//                   <AlertDialogAction
//                     onClick={handleDeleteAccount}
//                     disabled={isDeleting || deleteForm.confirmation !== "DELETE" || !deleteForm.password}
//                     className="bg-red-600 hover:bg-red-700 text-white"
//                   >
//                     {isDeleting ? "Deleting..." : "Delete Account"}
//                   </AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }






// app/user/settings/components/account-tab.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deleteAccount, UserSettings } from "@/actions/user-settings";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2, Shield, Calendar } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AccountTabProps {
  user: UserSettings;
}

export function AccountTab({ user }: AccountTabProps) {
  const router = useRouter();
  const { logout } = useAuthStore();

  const [deleteForm, setDeleteForm] = useState({ password: "", confirmation: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteForm.confirmation !== "DELETE") {
      toast.error('Please type "DELETE" to confirm.');
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteAccount(deleteForm);
      if (result.success) {
        toast.success(result.message || "Account deactivated successfully.");
        await logout();
        router.push("/login");
      } else {
        toast.error(result.error || "Failed to delete account");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="h-5 w-5" /> Account Information
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            View your account details and status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-600 dark:text-slate-400 text-sm">Email Verified</Label>
              <div className="mt-1">
                <Badge variant="outline" className={
                  user.emailVerified
                    ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20"
                    : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20"
                }>
                  {user.emailVerified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-slate-600 dark:text-slate-400 text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Member Since
              </Label>
              <p className="text-slate-900 dark:text-white text-sm mt-1">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <Label className="text-slate-600 dark:text-slate-400 text-sm">Last Updated</Label>
              <p className="text-slate-900 dark:text-white text-sm mt-1">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-white dark:bg-slate-900/50 border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> Danger Zone
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
            <h3 className="text-red-700 dark:text-red-400 font-semibold mb-2">Delete Account</h3>
            <p className="text-slate-700 dark:text-slate-300 text-sm mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-slate-900 dark:text-white">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                    This action cannot be undone. This will permanently deactivate your account and remove your access to all services.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="deletePassword" className="text-slate-900 dark:text-white">Confirm Password</Label>
                    <Input
                      id="deletePassword"
                      type="password"
                      placeholder="Enter your password"
                      value={deleteForm.password}
                      onChange={(e) => setDeleteForm({ ...deleteForm, password: e.target.value })}
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deleteConfirmation" className="text-slate-900 dark:text-white">Type "DELETE" to confirm</Label>
                    <Input
                      id="deleteConfirmation"
                      placeholder="DELETE"
                      value={deleteForm.confirmation}
                      onChange={(e) => setDeleteForm({ ...deleteForm, confirmation: e.target.value })}
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || deleteForm.confirmation !== "DELETE" || !deleteForm.password}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}