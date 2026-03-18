// // // app/user/settings/components/security-tab.tsx
// // "use client";

// // import { useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// // import { updateEmail, updatePhone, updatePassword, UserSettings } from "@/actions/user-settings";
// // import { toast } from "sonner";
// // import { useRouter } from "next/navigation";
// // import { Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";

// // interface SecurityTabProps {
// //   user: UserSettings;
// // }

// // export function SecurityTab({ user }: SecurityTabProps) {
// //   const router = useRouter();
// //   const [showPasswords, setShowPasswords] = useState({
// //     current: false,
// //     new: false,
// //     confirm: false,
// //   });

// //   // Email form
// //   const [emailForm, setEmailForm] = useState({
// //     email: user.email,
// //     password: "",
// //   });
// //   const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

// //   // Phone form
// //   const [phoneForm, setPhoneForm] = useState({
// //     phone: user.phone,
// //     password: "",
// //   });
// //   const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);

// //   // Password form
// //   const [passwordForm, setPasswordForm] = useState({
// //     currentPassword: "",
// //     newPassword: "",
// //     confirmPassword: "",
// //   });
// //   const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

// //   const handleEmailUpdate = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setIsUpdatingEmail(true);

// //     try {
// //       const result = await updateEmail(emailForm);

// //       if (result.success) {
// //         toast.success(result.message || "Email updated successfully!");
// //         setEmailForm({ ...emailForm, password: "" });
// //         router.refresh();
// //       } else {
// //         toast.error(result.error || "Failed to update email");
// //       }
// //     } catch (error) {
// //       toast.error("An unexpected error occurred");
// //     } finally {
// //       setIsUpdatingEmail(false);
// //     }
// //   };

// //   const handlePhoneUpdate = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setIsUpdatingPhone(true);

// //     try {
// //       const result = await updatePhone(phoneForm);

// //       if (result.success) {
// //         toast.success("Phone number updated successfully!");
// //         setPhoneForm({ ...phoneForm, password: "" });
// //         router.refresh();
// //       } else {
// //         toast.error(result.error || "Failed to update phone number");
// //       }
// //     } catch (error) {
// //       toast.error("An unexpected error occurred");
// //     } finally {
// //       setIsUpdatingPhone(false);
// //     }
// //   };

// //   const handlePasswordUpdate = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     if (passwordForm.newPassword !== passwordForm.confirmPassword) {
// //       toast.error("New passwords do not match");
// //       return;
// //     }

// //     setIsUpdatingPassword(true);

// //     try {
// //       const result = await updatePassword(passwordForm);

// //       if (result.success) {
// //         toast.success(result.message || "Password updated successfully!");
// //         setPasswordForm({
// //           currentPassword: "",
// //           newPassword: "",
// //           confirmPassword: "",
// //         });
// //       } else {
// //         toast.error(result.error || "Failed to update password");
// //       }
// //     } catch (error) {
// //       toast.error("An unexpected error occurred");
// //     } finally {
// //       setIsUpdatingPassword(false);
// //     }
// //   };

// //   return (
// //     <div className="space-y-6">
// //       {/* Email */}
// //       <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
// //         <CardHeader>
// //           <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
// //             <Mail className="h-5 w-5" />
// //             Email Address
// //           </CardTitle>
// //           <CardDescription className="text-slate-600 dark:text-slate-400">
// //             Update your email address. You'll need to verify the new email.
// //           </CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           <form onSubmit={handleEmailUpdate} className="space-y-4">
// //             <div>
// //               <Label htmlFor="email" className="text-slate-900 dark:text-white">
// //                 Email
// //               </Label>
// //               <Input
// //                 id="email"
// //                 type="email"
// //                 value={emailForm.email}
// //                 onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
// //                 className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
// //                 disabled={isUpdatingEmail}
// //                 required
// //               />
// //             </div>

// //             <div>
// //               <Label htmlFor="emailPassword" className="text-slate-900 dark:text-white">
// //                 Confirm Password
// //               </Label>
// //               <Input
// //                 id="emailPassword"
// //                 type="password"
// //                 placeholder="Enter your password to confirm"
// //                 value={emailForm.password}
// //                 onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
// //                 className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
// //                 disabled={isUpdatingEmail}
// //                 required
// //               />
// //             </div>

// //             <Button
// //               type="submit"
// //               disabled={isUpdatingEmail || emailForm.email === user.email}
// //               className="bg-blue-600 hover:bg-blue-700 text-white"
// //             >
// //               {isUpdatingEmail ? "Updating..." : "Update Email"}
// //             </Button>
// //           </form>
// //         </CardContent>
// //       </Card>

// //       {/* Phone */}
// //       <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
// //         <CardHeader>
// //           <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
// //             <Phone className="h-5 w-5" />
// //             Phone Number
// //           </CardTitle>
// //           <CardDescription className="text-slate-600 dark:text-slate-400">
// //             Update your phone number (use international format)
// //           </CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           <form onSubmit={handlePhoneUpdate} className="space-y-4">
// //             <div>
// //               <Label htmlFor="phone" className="text-slate-900 dark:text-white">
// //                 Phone Number
// //               </Label>
// //               <Input
// //                 id="phone"
// //                 type="tel"
// //                 placeholder="+256700000000"
// //                 value={phoneForm.phone}
// //                 onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
// //                 className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
// //                 disabled={isUpdatingPhone}
// //                 required
// //               />
// //             </div>

// //             <div>
// //               <Label htmlFor="phonePassword" className="text-slate-900 dark:text-white">
// //                 Confirm Password
// //               </Label>
// //               <Input
// //                 id="phonePassword"
// //                 type="password"
// //                 placeholder="Enter your password to confirm"
// //                 value={phoneForm.password}
// //                 onChange={(e) => setPhoneForm({ ...phoneForm, password: e.target.value })}
// //                 className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
// //                 disabled={isUpdatingPhone}
// //                 required
// //               />
// //             </div>

// //             <Button
// //               type="submit"
// //               disabled={isUpdatingPhone || phoneForm.phone === user.phone}
// //               className="bg-blue-600 hover:bg-blue-700 text-white"
// //             >
// //               {isUpdatingPhone ? "Updating..." : "Update Phone"}
// //             </Button>
// //           </form>
// //         </CardContent>
// //       </Card>

// //       {/* Password */}
// //       <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
// //         <CardHeader>
// //           <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
// //             <Lock className="h-5 w-5" />
// //             Change Password
// //           </CardTitle>
// //           <CardDescription className="text-slate-600 dark:text-slate-400">
// //             Update your password (minimum 8 characters)
// //           </CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           <form onSubmit={handlePasswordUpdate} className="space-y-4">
// //             <div>
// //               <Label htmlFor="currentPassword" className="text-slate-900 dark:text-white">
// //                 Current Password
// //               </Label>
// //               <div className="relative mt-2">
// //                 <Input
// //                   id="currentPassword"
// //                   type={showPasswords.current ? "text" : "password"}
// //                   value={passwordForm.currentPassword}
// //                   onChange={(e) =>
// //                     setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
// //                   }
// //                   className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white pr-10"
// //                   disabled={isUpdatingPassword}
// //                   required
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() =>
// //                     setShowPasswords({ ...showPasswords, current: !showPasswords.current })
// //                   }
// //                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
// //                 >
// //                   {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
// //                 </button>
// //               </div>
// //             </div>

// //             <div>
// //               <Label htmlFor="newPassword" className="text-slate-900 dark:text-white">
// //                 New Password
// //               </Label>
// //               <div className="relative mt-2">
// //                 <Input
// //                   id="newPassword"
// //                   type={showPasswords.new ? "text" : "password"}
// //                   value={passwordForm.newPassword}
// //                   onChange={(e) =>
// //                     setPasswordForm({ ...passwordForm, newPassword: e.target.value })
// //                   }
// //                   className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white pr-10"
// //                   disabled={isUpdatingPassword}
// //                   required
// //                   minLength={8}
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() =>
// //                     setShowPasswords({ ...showPasswords, new: !showPasswords.new })
// //                   }
// //                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
// //                 >
// //                   {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
// //                 </button>
// //               </div>
// //             </div>

// //             <div>
// //               <Label htmlFor="confirmPassword" className="text-slate-900 dark:text-white">
// //                 Confirm New Password
// //               </Label>
// //               <div className="relative mt-2">
// //                 <Input
// //                   id="confirmPassword"
// //                   type={showPasswords.confirm ? "text" : "password"}
// //                   value={passwordForm.confirmPassword}
// //                   onChange={(e) =>
// //                     setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
// //                   }
// //                   className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white pr-10"
// //                   disabled={isUpdatingPassword}
// //                   required
// //                   minLength={8}
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() =>
// //                     setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
// //                   }
// //                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
// //                 >
// //                   {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
// //                 </button>
// //               </div>
// //             </div>

// //             <Button
// //               type="submit"
// //               disabled={isUpdatingPassword}
// //               className="bg-blue-600 hover:bg-blue-700 text-white"
// //             >
// //               {isUpdatingPassword ? "Updating..." : "Change Password"}
// //             </Button>
// //           </form>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }



// // app/user/settings/components/security-tab.tsx
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { UserSettings } from "@/actions/user-settings";
// import { useAccessToken } from "@/hooks/useAccessToken";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
// import axios from "axios";

// const API = process.env.NEXT_PUBLIC_API_URL || "";

// interface SecurityTabProps {
//   user: UserSettings;
// }

// export function SecurityTab({ user }: SecurityTabProps) {
//   const router = useRouter();
//   const { accessToken, hydrated } = useAccessToken();

//   // ✅ ALL hooks must be declared before any conditional returns
//   const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
//   const [emailForm, setEmailForm] = useState({ email: user.email, password: "" });
//   const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
//   const [phoneForm, setPhoneForm] = useState({ phone: user.phone || "", password: "" });
//   const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
//   const [passwordForm, setPasswordForm] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

//   // Hydration guard AFTER all hooks
//   if (!hydrated) {
//     return (
//       <div className="space-y-6">
//         {[1, 2, 3].map((i) => (
//           <div key={i} className="h-48 rounded-xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
//         ))}
//       </div>
//     );
//   }

//   function authHeader() {
//     return { Authorization: `Bearer ${accessToken}` };
//   }

//   const handleEmailUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!accessToken) {
//       toast.error("Not authenticated. Please log in again.");
//       return;
//     }

//     setIsUpdatingEmail(true);
//     try {
//       const res = await axios.patch(`${API}/users/settings/email`, emailForm, {
//         headers: authHeader(),
//       });
//       toast.success(res.data?.message || "Email updated successfully!");
//       setEmailForm({ ...emailForm, password: "" });
//       router.refresh();
//     } catch (e: any) {
//       toast.error(e?.response?.data?.error || "Failed to update email.");
//     } finally {
//       setIsUpdatingEmail(false);
//     }
//   };

//   const handlePhoneUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!accessToken) {
//       toast.error("Not authenticated. Please log in again.");
//       return;
//     }

//     setIsUpdatingPhone(true);
//     try {
//       await axios.patch(`${API}/users/settings/phone`, phoneForm, {
//         headers: authHeader(),
//       });
//       toast.success("Phone number updated successfully!");
//       setPhoneForm({ ...phoneForm, password: "" });
//       router.refresh();
//     } catch (e: any) {
//       toast.error(e?.response?.data?.error || "Failed to update phone number.");
//     } finally {
//       setIsUpdatingPhone(false);
//     }
//   };

//   const handlePasswordUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!accessToken) {
//       toast.error("Not authenticated. Please log in again.");
//       return;
//     }

//     if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//       toast.error("New passwords do not match.");
//       return;
//     }

//     setIsUpdatingPassword(true);
//     try {
//       const res = await axios.patch(`${API}/users/settings/password`, passwordForm, {
//         headers: authHeader(),
//       });
//       toast.success(res.data?.message || "Password updated successfully!");
//       setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
//     } catch (e: any) {
//       toast.error(e?.response?.data?.error || "Failed to update password.");
//     } finally {
//       setIsUpdatingPassword(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Email */}
//       <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
//         <CardHeader>
//           <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
//             <Mail className="h-5 w-5" />
//             Email Address
//           </CardTitle>
//           <CardDescription className="text-slate-600 dark:text-slate-400">
//             Update your email address. You'll need to verify the new email.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleEmailUpdate} className="space-y-4">
//             <div>
//               <Label htmlFor="email" className="text-slate-900 dark:text-white">
//                 New Email
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={emailForm.email}
//                 onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
//                 className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
//                 disabled={isUpdatingEmail}
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="emailPassword" className="text-slate-900 dark:text-white">
//                 Confirm Password
//               </Label>
//               <Input
//                 id="emailPassword"
//                 type="password"
//                 placeholder="Enter your current password to confirm"
//                 value={emailForm.password}
//                 onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
//                 className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
//                 disabled={isUpdatingEmail}
//                 required
//               />
//             </div>
//             <Button
//               type="submit"
//               disabled={isUpdatingEmail || emailForm.email === user.email || !emailForm.password}
//               className="bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               {isUpdatingEmail ? "Updating..." : "Update Email"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       {/* Phone */}
//       <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
//         <CardHeader>
//           <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
//             <Phone className="h-5 w-5" />
//             Phone Number
//           </CardTitle>
//           <CardDescription className="text-slate-600 dark:text-slate-400">
//             Update your phone number using international format (e.g. +256700000000)
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handlePhoneUpdate} className="space-y-4">
//             <div>
//               <Label htmlFor="phone" className="text-slate-900 dark:text-white">
//                 Phone Number
//               </Label>
//               <Input
//                 id="phone"
//                 type="tel"
//                 placeholder="+256700000000"
//                 value={phoneForm.phone}
//                 onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
//                 className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
//                 disabled={isUpdatingPhone}
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="phonePassword" className="text-slate-900 dark:text-white">
//                 Confirm Password
//               </Label>
//               <Input
//                 id="phonePassword"
//                 type="password"
//                 placeholder="Enter your current password to confirm"
//                 value={phoneForm.password}
//                 onChange={(e) => setPhoneForm({ ...phoneForm, password: e.target.value })}
//                 className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
//                 disabled={isUpdatingPhone}
//                 required
//               />
//             </div>
//             <Button
//               type="submit"
//               disabled={isUpdatingPhone || phoneForm.phone === user.phone || !phoneForm.password}
//               className="bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               {isUpdatingPhone ? "Updating..." : "Update Phone"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       {/* Password */}
//       <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
//         <CardHeader>
//           <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
//             <Lock className="h-5 w-5" />
//             Change Password
//           </CardTitle>
//           <CardDescription className="text-slate-600 dark:text-slate-400">
//             Update your password. Minimum 8 characters.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handlePasswordUpdate} className="space-y-4">
//             {/* Current Password */}
//             <div>
//               <Label htmlFor="currentPassword" className="text-slate-900 dark:text-white">
//                 Current Password
//               </Label>
//               <div className="relative mt-2">
//                 <Input
//                   id="currentPassword"
//                   type={showPasswords.current ? "text" : "password"}
//                   value={passwordForm.currentPassword}
//                   onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
//                   className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white pr-10"
//                   disabled={isUpdatingPassword}
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
//                 >
//                   {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </div>

//             {/* New Password */}
//             <div>
//               <Label htmlFor="newPassword" className="text-slate-900 dark:text-white">
//                 New Password
//               </Label>
//               <div className="relative mt-2">
//                 <Input
//                   id="newPassword"
//                   type={showPasswords.new ? "text" : "password"}
//                   value={passwordForm.newPassword}
//                   onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
//                   className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white pr-10"
//                   disabled={isUpdatingPassword}
//                   required
//                   minLength={8}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
//                 >
//                   {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <Label htmlFor="confirmPassword" className="text-slate-900 dark:text-white">
//                 Confirm New Password
//               </Label>
//               <div className="relative mt-2">
//                 <Input
//                   id="confirmPassword"
//                   type={showPasswords.confirm ? "text" : "password"}
//                   value={passwordForm.confirmPassword}
//                   onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
//                   className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white pr-10"
//                   disabled={isUpdatingPassword}
//                   required
//                   minLength={8}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
//                 >
//                   {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </div>

//             <Button
//               type="submit"
//               disabled={isUpdatingPassword}
//               className="bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               {isUpdatingPassword ? "Updating..." : "Change Password"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }





// app/user/settings/components/security-tab.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateEmail, updatePhone, updatePassword, UserSettings } from "@/actions/user-settings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";

interface SecurityTabProps {
  user: UserSettings;
}

export function SecurityTab({ user }: SecurityTabProps) {
  const router = useRouter();

  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [emailForm, setEmailForm] = useState({ email: user.email, password: "" });
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [phoneForm, setPhoneForm] = useState({ phone: user.phone || "", password: "" });
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingEmail(true);
    try {
      const result = await updateEmail(emailForm);
      if (result.success) {
        toast.success(result.message || "Email updated successfully!");
        setEmailForm({ ...emailForm, password: "" });
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update email");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handlePhoneUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPhone(true);
    try {
      const result = await updatePhone(phoneForm);
      if (result.success) {
        toast.success("Phone number updated successfully!");
        setPhoneForm({ ...phoneForm, password: "" });
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update phone number");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdatingPhone(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const result = await updatePassword(passwordForm);
      if (result.success) {
        toast.success(result.message || "Password updated successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(result.error || "Failed to update password");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email */}
      <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="h-5 w-5" /> Email Address
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Update your email address. You'll need to verify the new email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-slate-900 dark:text-white">New Email</Label>
              <Input
                id="email"
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
                disabled={isUpdatingEmail}
                required
              />
            </div>
            <div>
              <Label htmlFor="emailPassword" className="text-slate-900 dark:text-white">Confirm Password</Label>
              <Input
                id="emailPassword"
                type="password"
                placeholder="Enter your current password to confirm"
                value={emailForm.password}
                onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
                disabled={isUpdatingEmail}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isUpdatingEmail || emailForm.email === user.email || !emailForm.password}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUpdatingEmail ? "Updating..." : "Update Email"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Phone */}
      <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
            <Phone className="h-5 w-5" /> Phone Number
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Update your phone number using international format (e.g. +256700000000)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePhoneUpdate} className="space-y-4">
            <div>
              <Label htmlFor="phone" className="text-slate-900 dark:text-white">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+256700000000"
                value={phoneForm.phone}
                onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
                disabled={isUpdatingPhone}
                required
              />
            </div>
            <div>
              <Label htmlFor="phonePassword" className="text-slate-900 dark:text-white">Confirm Password</Label>
              <Input
                id="phonePassword"
                type="password"
                placeholder="Enter your current password to confirm"
                value={phoneForm.password}
                onChange={(e) => setPhoneForm({ ...phoneForm, password: e.target.value })}
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
                disabled={isUpdatingPhone}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isUpdatingPhone || phoneForm.phone === user.phone || !phoneForm.password}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUpdatingPhone ? "Updating..." : "Update Phone"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password */}
      <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="h-5 w-5" /> Change Password
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Update your password. Minimum 8 characters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            {[
              { id: "currentPassword", label: "Current Password", key: "currentPassword" as const, show: showPasswords.current, toggle: () => setShowPasswords({ ...showPasswords, current: !showPasswords.current }) },
              { id: "newPassword", label: "New Password", key: "newPassword" as const, show: showPasswords.new, toggle: () => setShowPasswords({ ...showPasswords, new: !showPasswords.new }) },
              { id: "confirmPassword", label: "Confirm New Password", key: "confirmPassword" as const, show: showPasswords.confirm, toggle: () => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm }) },
            ].map(({ id, label, key, show, toggle }) => (
              <div key={id}>
                <Label htmlFor={id} className="text-slate-900 dark:text-white">{label}</Label>
                <div className="relative mt-2">
                  <Input
                    id={id}
                    type={show ? "text" : "password"}
                    value={passwordForm[key]}
                    onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white pr-10"
                    disabled={isUpdatingPassword}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={toggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
            <Button type="submit" disabled={isUpdatingPassword} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isUpdatingPassword ? "Updating..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}