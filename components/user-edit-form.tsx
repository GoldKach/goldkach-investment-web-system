




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
// import { updateUserById, UpdateUserPayload } from "@/actions/auth";

// // ✅ correct server action import

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
//   status?: "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED" | "DEACTIVATED" | "BANNED";
//   emailVerified?: boolean;
//   isApproved?: boolean;
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

//   // ✅ matches your Express controller
//   const buildUpdatePayload = (u: EditUser): UpdateUserPayload => ({
//     firstName: u.firstName,
//     lastName: u.lastName,
//     email: u.email,
//     phone: u.phone,
//     role: u.role,
//     status: u.status,            // enum
//     imageUrl: u.imageUrl,
//     emailVerified: u.emailVerified,
//     isApproved: u.isApproved,
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const payload = buildUpdatePayload(user);
//       const result = await updateUserById(user.id, payload);

//       if (result?.error) throw new Error(result.error);

//       toast.success("User updated successfully");
//       router.push(`/dashboard/users/${user.id}`);
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

//           {/* Status Settings */}
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
//                   <Label htmlFor="edit-is-approved">Approved</Label>
//                   <p className="text-sm text-muted-foreground">User approval status</p>
//                 </div>
//                 <Switch
//                   id="edit-is-approved"
//                   checked={Boolean(user.isApproved)}
//                   onCheckedChange={(checked: boolean) => updateField("isApproved", checked)}
//                 />
//               </div>

//               {/* ✅ Account Status (enum) */}
//               <div className="space-y-2">
//                 <Label htmlFor="user-status">Account Status</Label>
//                 <Select
//                   value={user.status ?? "INACTIVE"}
//                   onValueChange={(value) => updateField("status", value as EditUser["status"])}
//                 >
//                   <SelectTrigger id="user-status">
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="ACTIVE">Active</SelectItem>
//                     <SelectItem value="INACTIVE">Inactive</SelectItem>
//                     <SelectItem value="PENDING">Pending</SelectItem>
//                     <SelectItem value="SUSPENDED">Suspended</SelectItem>
//                     <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
//                     <SelectItem value="BANNED">Banned</SelectItem>
//                   </SelectContent>
//                 </Select>
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
//           <CardContent className="space-y-4">
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
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Upload, 
  X, 
  FileText,
  CreditCard,
  Building2,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { updateUserById, UpdateUserPayload } from "@/actions/auth";

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
    entityType?: string;
    dateOfBirth?: MaybeDate;
    tin?: string;
    homeAddress?: string;
    employmentStatus?: string;
    occupation?: string;
    nationality?: string;
    countryOfResidence?: string;
    primaryGoal?: string;
    timeHorizon?: string;
    riskTolerance?: string;
    investmentExperience?: string;
    expectedInvestment?: string;
    sourceOfWealth?: string;
    isPEP?: boolean;
    isApproved?: boolean;
    consentToDataCollection?: boolean;
    agreeToTerms?: boolean;
    // Company fields
    companyName?: string;
    registrationNumber?: string;
    companyAddress?: string;
    businessType?: string;
    incorporationDate?: MaybeDate;
    // Document URLs
    idFrontUrl?: string;
    idBackUrl?: string;
    passportPhotoUrl?: string;
    tinCertificateUrl?: string;
    bankStatementUrl?: string;
    proofOfAddressUrl?: string;
    signatureUrl?: string;
    certificateOfIncorporationUrl?: string;
    memorandumUrl?: string;
    articlesUrl?: string;
    companyTinUrl?: string;
    additionalDocumentUrl?: string;
  } | null;
  wallet?: {
    balance?: number;
    netAssetValue?: number;
    bankFee?: number;
    transactionFee?: number;
    feeAtBank?: number;
    totalFees?: number;
    status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "CLOSED";
    createdAt?: MaybeDate;
    accountNumber?: string;
  } | null;
}

export function UserEditForm({ user: initialUser }: { user: EditUser | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState<string | null>(null);

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

  const handleFileUpload = async (field: string, file: File) => {
    setUploadingDocument(field);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);
      formData.append('field', field);

      // Replace with your actual upload endpoint
      const response = await fetch('/api/upload/document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      updateOnboardingField(field, data.url);
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploadingDocument(null);
    }
  };

  const buildUpdatePayload = (u: EditUser): UpdateUserPayload => ({
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    phone: u.phone,
    role: u.role,
    status: u.status,
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

  const DocumentUploadField = ({ 
    label, 
    field, 
    currentUrl 
  }: { 
    label: string; 
    field: string; 
    currentUrl?: string;
  }) => {
    const isUploading = uploadingDocument === field;

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center gap-2">
          {currentUrl && (
            <div className="relative group flex-1">
              <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate flex-1">{label} uploaded</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => updateOnboardingField(field, null)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          <div className="relative">
            <Input
              type="file"
              id={field}
              className="hidden"
              accept="image/*,.pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(field, file);
              }}
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById(field)?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {currentUrl ? 'Replace' : 'Upload'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
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

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
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
        </TabsContent>

        {/* Onboarding Information Tab */}
        <TabsContent value="onboarding" className="space-y-6">
          {user.entityOnboarding ? (
            <>
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
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
                      <Label htmlFor="entityType">Entity Type</Label>
                      <Select
                        value={user.entityOnboarding?.entityType ?? "individual"}
                        onValueChange={(value) => updateOnboardingField("entityType", value)}
                      >
                        <SelectTrigger id="entityType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={user.entityOnboarding?.dateOfBirth ? 
                          new Date(user.entityOnboarding.dateOfBirth).toISOString().split('T')[0] : ""}
                        onChange={(e) => updateOnboardingField("dateOfBirth", e.target.value)}
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
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        value={user.entityOnboarding?.nationality ?? ""}
                        onChange={(e) => updateOnboardingField("nationality", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="countryOfResidence">Country of Residence</Label>
                      <Input
                        id="countryOfResidence"
                        value={user.entityOnboarding?.countryOfResidence ?? ""}
                        onChange={(e) => updateOnboardingField("countryOfResidence", e.target.value)}
                      />
                    </div>
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
                </CardContent>
              </Card>

              {/* Company Information (conditional) */}
              {user.entityOnboarding.entityType === "company" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={user.entityOnboarding?.companyName ?? ""}
                          onChange={(e) => updateOnboardingField("companyName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registrationNumber">Registration Number</Label>
                        <Input
                          id="registrationNumber"
                          value={user.entityOnboarding?.registrationNumber ?? ""}
                          onChange={(e) => updateOnboardingField("registrationNumber", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyAddress">Company Address</Label>
                      <Textarea
                        id="companyAddress"
                        value={user.entityOnboarding?.companyAddress ?? ""}
                        onChange={(e) => updateOnboardingField("companyAddress", e.target.value)}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="businessType">Business Type</Label>
                        <Input
                          id="businessType"
                          value={user.entityOnboarding?.businessType ?? ""}
                          onChange={(e) => updateOnboardingField("businessType", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="incorporationDate">Incorporation Date</Label>
                        <Input
                          id="incorporationDate"
                          type="date"
                          value={user.entityOnboarding?.incorporationDate ? 
                            new Date(user.entityOnboarding.incorporationDate).toISOString().split('T')[0] : ""}
                          onChange={(e) => updateOnboardingField("incorporationDate", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Investment Profile */}
              <Card>
                <CardHeader>
                  <CardTitle>Investment Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      <Label htmlFor="timeHorizon">Time Horizon</Label>
                      <Input
                        id="timeHorizon"
                        value={user.entityOnboarding?.timeHorizon ?? ""}
                        onChange={(e) => updateOnboardingField("timeHorizon", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                      <Input
                        id="riskTolerance"
                        value={user.entityOnboarding?.riskTolerance ?? ""}
                        onChange={(e) => updateOnboardingField("riskTolerance", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="investmentExperience">Investment Experience</Label>
                      <Input
                        id="investmentExperience"
                        value={user.entityOnboarding?.investmentExperience ?? ""}
                        onChange={(e) => updateOnboardingField("investmentExperience", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="expectedInvestment">Expected Investment</Label>
                      <Input
                        id="expectedInvestment"
                        value={user.entityOnboarding?.expectedInvestment ?? ""}
                        onChange={(e) => updateOnboardingField("expectedInvestment", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sourceOfWealth">Source of Wealth</Label>
                      <Input
                        id="sourceOfWealth"
                        value={user.entityOnboarding?.sourceOfWealth ?? ""}
                        onChange={(e) => updateOnboardingField("sourceOfWealth", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance & Verification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="isPEP">PEP Status</Label>
                        <p className="text-sm text-muted-foreground">Politically Exposed Person</p>
                      </div>
                      <Switch
                        id="isPEP"
                        checked={Boolean(user.entityOnboarding?.isPEP)}
                        onCheckedChange={(checked: boolean) => updateOnboardingField("isPEP", checked)}
                      />
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

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="consentToDataCollection">Data Collection Consent</Label>
                        <p className="text-sm text-muted-foreground">User consent status</p>
                      </div>
                      <Switch
                        id="consentToDataCollection"
                        checked={Boolean(user.entityOnboarding?.consentToDataCollection)}
                        onCheckedChange={(checked: boolean) => updateOnboardingField("consentToDataCollection", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="agreeToTerms">Terms Agreement</Label>
                        <p className="text-sm text-muted-foreground">Terms acceptance status</p>
                      </div>
                      <Switch
                        id="agreeToTerms"
                        checked={Boolean(user.entityOnboarding?.agreeToTerms)}
                        onCheckedChange={(checked: boolean) => updateOnboardingField("agreeToTerms", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex min-h-[200px] items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p>No onboarding information available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          {user.entityOnboarding ? (
            <>
              {/* Identity Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Identity Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <DocumentUploadField
                    label="National ID / Passport (Front)"
                    field="idFrontUrl"
                    currentUrl={user.entityOnboarding.idFrontUrl}
                  />
                  <DocumentUploadField
                    label="National ID / Passport (Back)"
                    field="idBackUrl"
                    currentUrl={user.entityOnboarding.idBackUrl}
                  />
                  <DocumentUploadField
                    label="Passport Photo"
                    field="passportPhotoUrl"
                    currentUrl={user.entityOnboarding.passportPhotoUrl}
                  />
                  <DocumentUploadField
                    label="TIN Certificate"
                    field="tinCertificateUrl"
                    currentUrl={user.entityOnboarding.tinCertificateUrl}
                  />
                </CardContent>
              </Card>

              {/* Financial Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Financial Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <DocumentUploadField
                    label="Bank Statement"
                    field="bankStatementUrl"
                    currentUrl={user.entityOnboarding.bankStatementUrl}
                  />
                  <DocumentUploadField
                    label="Proof of Address"
                    field="proofOfAddressUrl"
                    currentUrl={user.entityOnboarding.proofOfAddressUrl}
                  />
                </CardContent>
              </Card>

              {/* Company Documents */}
              {user.entityOnboarding.entityType === "company" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Company Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <DocumentUploadField
                      label="Certificate of Incorporation"
                      field="certificateOfIncorporationUrl"
                      currentUrl={user.entityOnboarding.certificateOfIncorporationUrl}
                    />
                    <DocumentUploadField
                      label="Memorandum of Association"
                      field="memorandumUrl"
                      currentUrl={user.entityOnboarding.memorandumUrl}
                    />
                    <DocumentUploadField
                      label="Articles of Association"
                      field="articlesUrl"
                      currentUrl={user.entityOnboarding.articlesUrl}
                    />
                    <DocumentUploadField
                      label="Company TIN Certificate"
                      field="companyTinUrl"
                      currentUrl={user.entityOnboarding.companyTinUrl}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Additional Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Additional Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <DocumentUploadField
                    label="Signature Specimen"
                    field="signatureUrl"
                    currentUrl={user.entityOnboarding.signatureUrl}
                  />
                  <DocumentUploadField
                    label="Additional Document"
                    field="additionalDocumentUrl"
                    currentUrl={user.entityOnboarding.additionalDocumentUrl}
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex min-h-[200px] items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p>No document information available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="space-y-6">
          {user.wallet ? (
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

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={user.wallet?.accountNumber ?? ""}
                      onChange={(e) => updateWalletField("accountNumber", e.target.value)}
                    />
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
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex min-h-[200px] items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p>No wallet information available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Save Button at Bottom */}
      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push(`/dashboard/users/${user.id}`)}
        >
          Cancel
        </Button>
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
