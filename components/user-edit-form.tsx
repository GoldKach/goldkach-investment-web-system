

// "use client";

// import type React from "react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import { ArrowLeft, Save, Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { updateUserById, UpdateUserPayload } from "@/actions/portfolioassets";

// // ⬇️ import your server action + type

// type MaybeDate = string | Date;

// export interface EditUser {
//   id: string;
//   firstName?: string;
//   lastName?: string;
//   name?: string;
//   email?: string;
//   phone?: string;
//   imageUrl?: string;
//   role?: string;
//   status?: string;
//   emailVerified?: boolean; // NOTE: not persisted by updateUser controller
//   isActive?: boolean;      // NOTE: not persisted by updateUser controller
//   isApproved?: boolean;    // NOTE: not persisted by updateUser controller
//   createdAt?: MaybeDate;
//   updatedAt?: MaybeDate;
//   entityOnboarding?: {
//     fullName?: string;
//     tin?: string;
//     homeAddress?: string;
//     employmentStatus?: string;
//     occupation?: string;
//     primaryGoal?: string;
//     riskTolerance?: string;
//     isApproved?: boolean;
//   } | null;
//   wallet?: {
//     balance?: number;
//     netAssetValue?: number;
//     bankFee?: number;
//     transactionFee?: number;
//     feeAtBank?: number;
//     status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "CLOSED";
//     createdAt?: MaybeDate;
//     accountNumber?: string;
//   } | null;
// }

// export function UserEditForm({ user: initialUser }: { user: EditUser | null }) {
//   const router = useRouter();
//   const [saving, setSaving] = useState(false);

//   if (!initialUser) {
//     return (
//       <div className="flex min-h-[400px] items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold">User Not Found</h2>
//           <Button onClick={() => router.push("/dashboard/users")} className="mt-4">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Users
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const [user, setUser] = useState<EditUser>(initialUser);

//   const updateField = (field: keyof EditUser, value: any) => {
//     setUser((prev) => ({ ...prev, [field]: value }));
//   };

//   const updateOnboardingField = (field: string, value: any) => {
//     setUser((prev) => ({
//       ...prev,
//       entityOnboarding: {
//         ...(prev.entityOnboarding ?? {}),
//         [field]: value,
//       },
//     }));
//   };

//   const updateWalletField = (field: string, value: any) => {
//     setUser((prev) => ({
//       ...prev,
//       wallet: {
//         ...(prev.wallet ?? {}),
//         [field]: value,
//       },
//     }));
//   };

//   // Build a payload that matches your Express controller
//   const buildUpdatePayload = (u: EditUser): UpdateUserPayload => ({
//     firstName: u.firstName,
//     lastName: u.lastName,
//     email: u.email,
//     phone: u.phone,
//     role: u.role,
//     status: u.status,
//     imageUrl: u.imageUrl,
//     // password: u.password, // add if you later add a password input
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const payload = buildUpdatePayload(user);
//       const result = await updateUserById(user.id, payload); // ⬅️ server action call

//       if (result?.error) {
//         throw new Error(result.error);
//       }

//       toast.success("User updated successfully");
//       router.refresh();
//     } catch (err: any) {
//       console.error("[edit] Error updating user:", err);
//       toast.error(err?.message || "Failed to update user");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <Button type="button" variant="ghost" onClick={() => router.push(`/dashboard/users/${user.id}`)}>
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to User Details
//           </Button>
//           <h1 className="mt-2 text-3xl font-bold">Edit User</h1>
//           <p className="text-muted-foreground">Update user information and settings</p>
//         </div>
//         <Button type="submit" disabled={saving}>
//           {saving ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Saving...
//             </>
//           ) : (
//             <>
//               <Save className="mr-2 h-4 w-4" />
//               Save Changes
//             </>
//           )}
//         </Button>
//       </div>

//       {/* Basic Information */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Basic Information</CardTitle>
//           <CardDescription>Update user's basic profile information</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-2">
//             <div className="space-y-2">
//               <Label htmlFor="firstName">First Name</Label>
//               <Input
//                 id="firstName"
//                 value={user.firstName ?? ""}
//                 onChange={(e) => updateField("firstName", e.target.value)}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="lastName">Last Name</Label>
//               <Input
//                 id="lastName"
//                 value={user.lastName ?? ""}
//                 onChange={(e) => updateField("lastName", e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="grid gap-4 md:grid-cols-2">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={user.email ?? ""}
//                 onChange={(e) => updateField("email", e.target.value)}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone</Label>
//               <Input id="phone" value={user.phone ?? ""} onChange={(e) => updateField("phone", e.target.value)} />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="imageUrl">Profile Image URL</Label>
//             <Input
//               id="imageUrl"
//               value={user.imageUrl ?? ""}
//               onChange={(e) => updateField("imageUrl", e.target.value)}
//             />
//           </div>

//           <Separator />

//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Status Settings</h3>
//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="flex items-center justify-between rounded-lg border p-4">
//                 <div className="space-y-0.5">
//                   <Label htmlFor="edit-email-verified">Email Verified</Label>
//                   <p className="text-sm text-muted-foreground">User's email verification status</p>
//                 </div>
//                 <Switch
//                   id="edit-email-verified"
//                   checked={Boolean(user.emailVerified)}
//                   onCheckedChange={(checked: boolean) => updateField("emailVerified", checked)}
//                 />
//               </div>
//               <div className="flex items-center justify-between rounded-lg border p-4">
//                 <div className="space-y-0.5">
//                   <Label htmlFor="edit-is-active">Active Status</Label>
//                   <p className="text-sm text-muted-foreground">User's account active status</p>
//                 </div>
//                 <Switch
//                   id="edit-is-active"
//                   checked={Boolean(user.isActive)}
//                   onCheckedChange={(checked: boolean) => updateField("isActive", checked)}
//                 />
//               </div>
//               <div className="flex items-center justify-between rounded-lg border p-4">
//                 <div className="space-y-0.5">
//                   <Label htmlFor="edit-is-approved">Approved</Label>
//                   <p className="text-sm text-muted-foreground">User approval status</p>
//                 </div>
//                 <Switch
//                   id="edit-is-approved"
//                   checked={Boolean(user.isApproved)}
//                   onCheckedChange={(checked: boolean) => updateField("isApproved", checked)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="role">Role</Label>
//                 <Select value={user.role ?? "USER"} onValueChange={(value) => updateField("role", value)}>
//                   <SelectTrigger id="role">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="USER">User</SelectItem>
//                     <SelectItem value="ADMIN">Admin</SelectItem>
//                     <SelectItem value="MODERATOR">Moderator</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Onboarding Information */}
//       {user.entityOnboarding && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Onboarding Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="fullName">Full Name</Label>
//                 <Input
//                   id="fullName"
//                   value={user.entityOnboarding?.fullName ?? ""}
//                   onChange={(e) => updateOnboardingField("fullName", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="tin">TIN</Label>
//                 <Input
//                   id="tin"
//                   value={user.entityOnboarding?.tin ?? ""}
//                   onChange={(e) => updateOnboardingField("tin", e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="homeAddress">Home Address</Label>
//               <Textarea
//                 id="homeAddress"
//                 value={user.entityOnboarding?.homeAddress ?? ""}
//                 onChange={(e) => updateOnboardingField("homeAddress", e.target.value)}
//               />
//             </div>

//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="employmentStatus">Employment Status</Label>
//                 <Input
//                   id="employmentStatus"
//                   value={user.entityOnboarding?.employmentStatus ?? ""}
//                   onChange={(e) => updateOnboardingField("employmentStatus", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="occupation">Occupation</Label>
//                 <Input
//                   id="occupation"
//                   value={user.entityOnboarding?.occupation ?? ""}
//                   onChange={(e) => updateOnboardingField("occupation", e.target.value)}
//                 />
//               </div>
//             </div>

//             <Separator />

//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="primaryGoal">Primary Goal</Label>
//                 <Input
//                   id="primaryGoal"
//                   value={user.entityOnboarding?.primaryGoal ?? ""}
//                   onChange={(e) => updateOnboardingField("primaryGoal", e.target.value)}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="riskTolerance">Risk Tolerance</Label>
//                 <Input
//                   id="riskTolerance"
//                   value={user.entityOnboarding?.riskTolerance ?? ""}
//                   onChange={(e) => updateOnboardingField("riskTolerance", e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="flex items-center justify-between rounded-lg border p-4">
//               <div className="space-y-0.5">
//                 <Label htmlFor="onboarding-approved">Onboarding Approved</Label>
//                 <p className="text-sm text-muted-foreground">Approve user's onboarding</p>
//               </div>
//               <Switch
//                 id="onboarding-approved"
//                 checked={Boolean(user.entityOnboarding?.isApproved)}
//                 onCheckedChange={(checked: boolean) => updateOnboardingField("isApproved", checked)}
//               />
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Wallet Information */}
//       {user.wallet && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Wallet Information</CardTitle>
//           </CardHeader>
//         <CardContent className="space-y-4">
//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="space-y-2">
//                 <Label htmlFor="balance">Balance</Label>
//                 <Input
//                   id="balance"
//                   type="number"
//                   step="0.01"
//                   value={user.wallet?.balance ?? 0}
//                   onChange={(e) => updateWalletField("balance", Number.parseFloat(e.target.value))}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="netAssetValue">Net Asset Value</Label>
//                 <Input
//                   id="netAssetValue"
//                   type="number"
//                   step="0.01"
//                   value={user.wallet?.netAssetValue ?? 0}
//                   onChange={(e) => updateWalletField("netAssetValue", Number.parseFloat(e.target.value))}
//                 />
//               </div>
//             </div>

//             <div className="grid gap-4 md:grid-cols-3">
//               <div className="space-y-2">
//                 <Label htmlFor="bankFee">Bank Fee</Label>
//                 <Input
//                   id="bankFee"
//                   type="number"
//                   step="0.01"
//                   value={user.wallet?.bankFee ?? 0}
//                   onChange={(e) => updateWalletField("bankFee", Number.parseFloat(e.target.value))}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="transactionFee">Transaction Fee</Label>
//                 <Input
//                   id="transactionFee"
//                   type="number"
//                   step="0.01"
//                   value={user.wallet?.transactionFee ?? 0}
//                   onChange={(e) => updateWalletField("transactionFee", Number.parseFloat(e.target.value))}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="feeAtBank">Fee at Bank</Label>
//                 <Input
//                   id="feeAtBank"
//                   type="number"
//                   step="0.01"
//                   value={user.wallet?.feeAtBank ?? 0}
//                   onChange={(e) => updateWalletField("feeAtBank", Number.parseFloat(e.target.value))}
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="walletStatus">Wallet Status</Label>
//               <Select
//                 value={user.wallet?.status ?? "ACTIVE"}
//                 onValueChange={(value) => updateWalletField("status", value)}
//               >
//                 <SelectTrigger id="walletStatus">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ACTIVE">Active</SelectItem>
//                   <SelectItem value="INACTIVE">Inactive</SelectItem>
//                   <SelectItem value="SUSPENDED">Suspended</SelectItem>
//                   <SelectItem value="CLOSED">Closed</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Save Button at Bottom */}
//       <div className="flex justify-end">
//         <Button type="submit" size="lg" disabled={saving}>
//           {saving ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Saving Changes...
//             </>
//           ) : (
//             <>
//               <Save className="mr-2 h-4 w-4" />
//               Save All Changes
//             </>
//           )}
//         </Button>
//       </div>
//     </form>
//   );
// }





"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateUserById, UpdateUserPayload } from "@/actions/auth";

// ✅ correct server action import

type MaybeDate = string | Date;

export interface EditUser {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  role?: string;
  status?: "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED" | "DEACTIVATED" | "BANNED";
  emailVerified?: boolean;
  isApproved?: boolean;
  createdAt?: MaybeDate;
  updatedAt?: MaybeDate;
  entityOnboarding?: {
    fullName?: string;
    tin?: string;
    homeAddress?: string;
    employmentStatus?: string;
    occupation?: string;
    primaryGoal?: string;
    riskTolerance?: string;
    isApproved?: boolean;
  } | null;
  wallet?: {
    balance?: number;
    netAssetValue?: number;
    bankFee?: number;
    transactionFee?: number;
    feeAtBank?: number;
    status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "CLOSED";
    createdAt?: MaybeDate;
    accountNumber?: string;
  } | null;
}

export function UserEditForm({ user: initialUser }: { user: EditUser | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  if (!initialUser) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">User Not Found</h2>
          <Button onClick={() => router.push("/dashboard/users")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const [user, setUser] = useState<EditUser>(initialUser);

  const updateField = (field: keyof EditUser, value: any) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const updateOnboardingField = (field: string, value: any) => {
    setUser((prev) => ({
      ...prev,
      entityOnboarding: {
        ...(prev.entityOnboarding ?? {}),
        [field]: value,
      },
    }));
  };

  const updateWalletField = (field: string, value: any) => {
    setUser((prev) => ({
      ...prev,
      wallet: {
        ...(prev.wallet ?? {}),
        [field]: value,
      },
    }));
  };

  // ✅ matches your Express controller
  const buildUpdatePayload = (u: EditUser): UpdateUserPayload => ({
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    phone: u.phone,
    role: u.role,
    status: u.status,            // enum
    imageUrl: u.imageUrl,
    emailVerified: u.emailVerified,
    isApproved: u.isApproved,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildUpdatePayload(user);
      const result = await updateUserById(user.id, payload);

      if (result?.error) throw new Error(result.error);

      toast.success("User updated successfully");
      router.push(`/dashboard/users/${user.id}`);
    } catch (err: any) {
      console.error("[edit] Error updating user:", err);
      toast.error(err?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button type="button" variant="ghost" onClick={() => router.push(`/dashboard/users/${user.id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Details
          </Button>
          <h1 className="mt-2 text-3xl font-bold">Edit User</h1>
          <p className="text-muted-foreground">Update user information and settings</p>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update user's basic profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={user.firstName ?? ""}
                onChange={(e) => updateField("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={user.lastName ?? ""}
                onChange={(e) => updateField("lastName", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email ?? ""}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={user.phone ?? ""} onChange={(e) => updateField("phone", e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Profile Image URL</Label>
            <Input
              id="imageUrl"
              value={user.imageUrl ?? ""}
              onChange={(e) => updateField("imageUrl", e.target.value)}
            />
          </div>

          <Separator />

          {/* Status Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status Settings</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="edit-email-verified">Email Verified</Label>
                  <p className="text-sm text-muted-foreground">User's email verification status</p>
                </div>
                <Switch
                  id="edit-email-verified"
                  checked={Boolean(user.emailVerified)}
                  onCheckedChange={(checked: boolean) => updateField("emailVerified", checked)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="edit-is-approved">Approved</Label>
                  <p className="text-sm text-muted-foreground">User approval status</p>
                </div>
                <Switch
                  id="edit-is-approved"
                  checked={Boolean(user.isApproved)}
                  onCheckedChange={(checked: boolean) => updateField("isApproved", checked)}
                />
              </div>

              {/* ✅ Account Status (enum) */}
              <div className="space-y-2">
                <Label htmlFor="user-status">Account Status</Label>
                <Select
                  value={user.status ?? "INACTIVE"}
                  onValueChange={(value) => updateField("status", value as EditUser["status"])}
                >
                  <SelectTrigger id="user-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
                    <SelectItem value="BANNED">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={user.role ?? "USER"} onValueChange={(value) => updateField("role", value)}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MODERATOR">Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Information */}
      {user.entityOnboarding && (
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={user.entityOnboarding?.fullName ?? ""}
                  onChange={(e) => updateOnboardingField("fullName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tin">TIN</Label>
                <Input
                  id="tin"
                  value={user.entityOnboarding?.tin ?? ""}
                  onChange={(e) => updateOnboardingField("tin", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="homeAddress">Home Address</Label>
              <Textarea
                id="homeAddress"
                value={user.entityOnboarding?.homeAddress ?? ""}
                onChange={(e) => updateOnboardingField("homeAddress", e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employmentStatus">Employment Status</Label>
                <Input
                  id="employmentStatus"
                  value={user.entityOnboarding?.employmentStatus ?? ""}
                  onChange={(e) => updateOnboardingField("employmentStatus", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={user.entityOnboarding?.occupation ?? ""}
                  onChange={(e) => updateOnboardingField("occupation", e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primaryGoal">Primary Goal</Label>
                <Input
                  id="primaryGoal"
                  value={user.entityOnboarding?.primaryGoal ?? ""}
                  onChange={(e) => updateOnboardingField("primaryGoal", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                <Input
                  id="riskTolerance"
                  value={user.entityOnboarding?.riskTolerance ?? ""}
                  onChange={(e) => updateOnboardingField("riskTolerance", e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="onboarding-approved">Onboarding Approved</Label>
                <p className="text-sm text-muted-foreground">Approve user's onboarding</p>
              </div>
              <Switch
                id="onboarding-approved"
                checked={Boolean(user.entityOnboarding?.isApproved)}
                onCheckedChange={(checked: boolean) => updateOnboardingField("isApproved", checked)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wallet Information */}
      {user.wallet && (
        <Card>
          <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="balance">Balance</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  value={user.wallet?.balance ?? 0}
                  onChange={(e) => updateWalletField("balance", Number.parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="netAssetValue">Net Asset Value</Label>
                <Input
                  id="netAssetValue"
                  type="number"
                  step="0.01"
                  value={user.wallet?.netAssetValue ?? 0}
                  onChange={(e) => updateWalletField("netAssetValue", Number.parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="bankFee">Bank Fee</Label>
                <Input
                  id="bankFee"
                  type="number"
                  step="0.01"
                  value={user.wallet?.bankFee ?? 0}
                  onChange={(e) => updateWalletField("bankFee", Number.parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionFee">Transaction Fee</Label>
                <Input
                  id="transactionFee"
                  type="number"
                  step="0.01"
                  value={user.wallet?.transactionFee ?? 0}
                  onChange={(e) => updateWalletField("transactionFee", Number.parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feeAtBank">Fee at Bank</Label>
                <Input
                  id="feeAtBank"
                  type="number"
                  step="0.01"
                  value={user.wallet?.feeAtBank ?? 0}
                  onChange={(e) => updateWalletField("feeAtBank", Number.parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="walletStatus">Wallet Status</Label>
              <Select
                value={user.wallet?.status ?? "ACTIVE"}
                onValueChange={(value) => updateWalletField("status", value)}
              >
                <SelectTrigger id="walletStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Button at Bottom */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
