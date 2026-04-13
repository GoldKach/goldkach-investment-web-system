





// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import {
//   ArrowLeft,
//   Edit,
//   Trash2,
//   Mail,
//   Phone,
//   Calendar,
//   Building2,
//   Wallet,
//   TrendingUp,
//   TrendingDown,
//   DollarSign,
//   CreditCard,
//   UserCheck,
//   UserX,
//   CheckCircle2,
//   XCircle,
//   Clock,
//   FileText,
//   Download,
//   Eye,
//   Image as ImageIcon,
//   File,
// } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";

// type MaybeDate = string | Date;

// export interface UserDetail {
//   id: string;
//   email?: string;
//   role?: string;
//   firstName?: string;
//   lastName?: string;
//   name?: string;
//   phone?: string;
//   imageUrl?: string;
//   status?: string;
//   isActive?: boolean;
//   emailVerified?: boolean;
//   isApproved?: boolean;
//   createdAt?: MaybeDate;
//   updatedAt?: MaybeDate;
//   // loosely typed nested objects used below
//   entityOnboarding?: any;
//   wallet?: any;
//   userPortfolios?: any[];
//   deposits?: any[];
//   withdrawals?: any[];
// }

// export function UserDetailView({ user: initialUser }: { user: UserDetail | null }) {
//   const router = useRouter();

//   // If no user was found on the server, show the empty state.
//   if (!initialUser) {
//     return (
//       <div className="flex min-h-[400px] items-center justify-center">
//         <div className="text-center">
//           <XCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
//           <h2 className="text-2xl font-bold">User Not Found</h2>
//           <p className="mt-2 text-muted-foreground">The user you're looking for doesn't exist.</p>
//           <Button onClick={() => router.push("/dashboard/users")} className="mt-4">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Users
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // Local state from the incoming server-provided user
//   const [user, setUser] = useState<UserDetail>(initialUser);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [updatingStatus, setUpdatingStatus] = useState(false);
//   const [previewDocument, setPreviewDocument] = useState<{ url: string; name: string; type: string } | null>(null);

//   const displayName =
//     user.name ||
//     [user.firstName, user.lastName].filter(Boolean).join(" ") ||
//     user.email ||
//     "Unnamed User";

//   const safeDate = (d?: MaybeDate) => (d ? new Date(d) : null);

//   const getStatusIcon = (status?: string) => {
//     switch (status) {
//       case "COMPLETED":
//       case "APPROVED":
//         return <CheckCircle2 className="mr-1 h-3 w-3" />;
//       case "PENDING":
//         return <Clock className="mr-1 h-3 w-3" />;
//       case "REJECTED":
//       case "FAILED":
//         return <XCircle className="mr-1 h-3 w-3" />;
//       default:
//         return null;
//     }
//   };

//   const getStatusColor = (status?: string) => {
//     switch (status) {
//       case "COMPLETED":
//       case "APPROVED":
//         return "bg-green-500/10 text-green-600 dark:text-green-400";
//       case "PENDING":
//         return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
//       case "REJECTED":
//       case "FAILED":
//         return "bg-red-500/10 text-red-600 dark:text-red-400";
//       default:
//         return "bg-muted text-muted-foreground";
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await fetch(`/api/users/${user.id}`, { method: "DELETE" });
//       router.push("/users");
//     } catch (error) {
//       console.error("[v0] Error deleting user:", error);
//     }
//   };

//   const handleStatusToggle = async (field: "emailVerified" | "isActive") => {
//     setUpdatingStatus(true);
//     try {
//       const res = await fetch(`/api/users/${user.id}/status`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ field, value: !Boolean((user as any)[field]) }),
//       });
//       const updated = await res.json();
//       setUser((prev) => ({ ...prev, ...updated }));
//     } catch (error) {
//       console.error("[v0] Error updating status:", error);
//     } finally {
//       setUpdatingStatus(false);
//     }
//   };

//   const getDocumentIcon = (url: string) => {
//     const extension = url?.split('.').pop()?.toLowerCase();
//     if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
//       return <ImageIcon className="h-5 w-5" />;
//     } else if (extension === 'pdf') {
//       return <FileText className="h-5 w-5" />;
//     }
//     return <File className="h-5 w-5" />;
//   };

//   const isImage = (url: string) => {
//     const extension = url?.split('.').pop()?.toLowerCase();
//     return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '');
//   };

//   const DocumentCard = ({ title, url }: { title: string; url?: string }) => {
//     if (!url) {
//       return (
//         <div className="rounded-lg border border-dashed border-muted-foreground/25 p-4">
//           <div className="flex items-center gap-3 text-muted-foreground">
//             <File className="h-5 w-5" />
//             <div className="flex-1">
//               <p className="text-sm font-medium">{title}</p>
//               <p className="text-xs">Not uploaded</p>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="group relative rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
//             {getDocumentIcon(url)}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium truncate">{title}</p>
//             <p className="text-xs text-muted-foreground">
//               {isImage(url) ? 'Image' : 'PDF'} • Uploaded
//             </p>
//           </div>
//           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//             <Button
//               size="sm"
//               variant="ghost"
//               onClick={() => setPreviewDocument({ url, name: title, type: isImage(url) ? 'image' : 'pdf' })}
//             >
//               <Eye className="h-4 w-4" />
//             </Button>
//             <Button
//               size="sm"
//               variant="ghost"
//               onClick={() => window.open(url, '_blank')}
//             >
//               <Download className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <Button variant="ghost" onClick={() => router.push("/dashboard/users")}>
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Users
//         </Button>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={() => router.push(`/dashboard/users/${user.id}/edit`)}>
//             <Edit className="mr-2 h-4 w-4" />
//             Edit User
//           </Button>
//           <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
//             <Trash2 className="mr-2 h-4 w-4" />
//             Delete User
//           </Button>
//         </div>
//       </div>

//       {/* User Profile Card */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-start justify-between">
//             <div className="flex items-center gap-4">
//               <Avatar className="h-20 w-20 border-4 border-primary/20">
//                 <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={displayName} />
//                 <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
//                   {(user.firstName?.[0] || user.name?.[0] || "U").toUpperCase()}
//                   {(user.lastName?.[0] || user.name?.split(" ")?.[1]?.[0] || "").toUpperCase()}
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <CardTitle className="text-3xl">{displayName}</CardTitle>
//                 <CardDescription className="mt-1 text-base">
//                   {user.role || "—"} • ID: {user.id}
//                 </CardDescription>
//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {user.emailVerified && (
//                     <Badge className="border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400">
//                       <CheckCircle2 className="mr-1 h-3 w-3" />
//                       Email Verified
//                     </Badge>
//                   )}

//                   {user.isApproved ? (
//                     <Badge className="border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400">
//                       <CheckCircle2 className="mr-1 h-3 w-3" />
//                       Approved
//                     </Badge>
//                   ) : (
//                     <Badge className="border-orange-500/50 bg-orange-500/10 text-orange-600 dark:text-orange-400">
//                       <Clock className="mr-1 h-3 w-3" />
//                       Pending Approval
//                     </Badge>
//                   )}

//                   {user.status && <Badge variant="outline">{user.status}</Badge>}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent>
//           <div className="grid gap-6 md:grid-cols-2">
//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <Mail className="h-5 w-5 text-muted-foreground" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">Email</p>
//                   <p className="font-medium">{user.email || "—"}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Phone className="h-5 w-5 text-muted-foreground" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">Phone</p>
//                   <p className="font-medium">{user.phone || "—"}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <Calendar className="h-5 w-5 text-muted-foreground" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">Member Since</p>
//                   <p className="font-medium">
//                     {safeDate(user.createdAt)?.toLocaleDateString() || "—"}{" "}
//                     {safeDate(user.createdAt)
//                       ? `(${formatDistanceToNow(safeDate(user.createdAt)!, { addSuffix: true })})`
//                       : ""}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Calendar className="h-5 w-5 text-muted-foreground" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">Last Updated</p>
//                   <p className="font-medium">
//                     {safeDate(user.updatedAt)?.toLocaleDateString() || "—"}{" "}
//                     {safeDate(user.updatedAt)
//                       ? `(${formatDistanceToNow(safeDate(user.updatedAt)!, { addSuffix: true })})`
//                       : ""}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <Separator className="my-6" />

//           {/* Status Controls */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Status Controls</h3>
//             <div className="grid gap-4 md:grid-cols-2">
//               <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
//                 <div className="space-y-0.5">
//                   <Label htmlFor="email-verified" className="text-base font-medium">
//                     Email Verified
//                   </Label>
//                   <p className="text-sm text-muted-foreground">User's email verification status</p>
//                 </div>
//                 <Switch
//                   id="email-verified"
//                   checked={Boolean(user.emailVerified)}
//                   onCheckedChange={() => handleStatusToggle("emailVerified")}
//                   disabled={updatingStatus}
//                 />
//               </div>

//               <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
//                 <div className="space-y-0.5">
//                   <Label htmlFor="is-active" className="text-base font-medium">
//                     Active Status
//                   </Label>
//                   <p className="text-sm text-muted-foreground">User's account active status</p>
//                 </div>
//                 <Switch
//                   id="is-active"
//                   checked={Boolean(user.isActive)}
//                   onCheckedChange={() => handleStatusToggle("isActive")}
//                   disabled={updatingStatus}
//                 />
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Tabs */}
//       <Tabs defaultValue="onboarding" className="w-full">
//         <TabsList className="grid w-full grid-cols-5">
//           <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
//           <TabsTrigger value="documents">Documents</TabsTrigger>
//           <TabsTrigger value="wallet">Wallet</TabsTrigger>
//           <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
//           <TabsTrigger value="transactions">Transactions</TabsTrigger>
//         </TabsList>

//         {/* Onboarding */}
//         <TabsContent value="onboarding" className="space-y-4">
//           {user.entityOnboarding ? (
//             <>
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Personal Information</CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid gap-6 md:grid-cols-2">
//                   <div>
//                     <p className="text-sm text-muted-foreground">Full Name</p>
//                     <p className="font-medium">{user.entityOnboarding.fullName || displayName}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Entity Type</p>
//                     <p className="font-medium capitalize">{user.entityOnboarding.entityType || "—"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Date of Birth</p>
//                     <p className="font-medium">
//                       {user.entityOnboarding.dateOfBirth
//                         ? new Date(user.entityOnboarding.dateOfBirth).toLocaleDateString()
//                         : "—"}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">TIN</p>
//                     <p className="font-medium">{user.entityOnboarding.tin || "—"}</p>
//                   </div>
//                   <div className="md:col-span-2">
//                     <p className="text-sm text-muted-foreground">Home Address</p>
//                     <p className="font-medium">{user.entityOnboarding.homeAddress || "—"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Employment Status</p>
//                     <p className="font-medium">{user.entityOnboarding.employmentStatus || "—"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Occupation</p>
//                     <p className="font-medium">{user.entityOnboarding.occupation || "—"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Nationality</p>
//                     <p className="font-medium">{user.entityOnboarding.nationality || "—"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Country of Residence</p>
//                     <p className="font-medium">{user.entityOnboarding.countryOfResidence || "—"}</p>
//                   </div>
//                 </CardContent>
//               </Card>

//               {user.entityOnboarding.entityType === "company" && (
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Company Information</CardTitle>
//                   </CardHeader>
//                   <CardContent className="grid gap-6 md:grid-cols-2">
//                     <div>
//                       <p className="text-sm text-muted-foreground">Company Name</p>
//                       <p className="font-medium">{user.entityOnboarding.companyName || "N/A"}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground">Registration Number</p>
//                       <p className="font-medium">{user.entityOnboarding.registrationNumber || "N/A"}</p>
//                     </div>
//                     <div className="md:col-span-2">
//                       <p className="text-sm text-muted-foreground">Company Address</p>
//                       <p className="font-medium">{user.entityOnboarding.companyAddress || "N/A"}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground">Business Type</p>
//                       <p className="font-medium">{user.entityOnboarding.businessType || "N/A"}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground">Incorporation Date</p>
//                       <p className="font-medium">
//                         {user.entityOnboarding.incorporationDate
//                           ? new Date(user.entityOnboarding.incorporationDate).toLocaleDateString()
//                           : "N/A"}
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Investment Profile</CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid gap-6 md:grid-cols-2">
//                   <div>
//                     <p className="text-sm text-muted-foreground">Primary Goal</p>
//                     <p className="font-medium">{user.entityOnboarding.primaryGoal || "—"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Time Horizon</p>
//                     <p className="font-medium">{user.entityOnboarding.timeHorizon || "—"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Risk Tolerance</p>
//                     <p className="font-medium">{user.entityOnboarding.riskTolerance || "—"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Investment Experience</p>
//                     <p className="font-medium">{user.entityOnboarding.investmentExperience || "—"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Expected Investment</p>
//                     <p className="font-medium">{user.entityOnboarding.expectedInvestment || "—"}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Source of Wealth</p>
//                     <p className="font-medium">{user.entityOnboarding.sourceOfWealth || "—"}</p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Compliance & Verification</CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid gap-6 md:grid-cols-2">
//                   <div>
//                     <p className="text-sm text-muted-foreground">PEP Status</p>
//                     <p className="font-medium">{String(user.entityOnboarding.isPEP ?? "—")}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Approval Status</p>
//                     <Badge
//                       className={
//                         user.entityOnboarding.isApproved
//                           ? "bg-green-500/10 text-green-600 dark:text-green-400"
//                           : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
//                       }
//                     >
//                       {user.entityOnboarding.isApproved ? "Approved" : "Pending"}
//                     </Badge>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Data Collection Consent</p>
//                     <Badge
//                       className={
//                         user.entityOnboarding.consentToDataCollection
//                           ? "bg-green-500/10 text-green-600 dark:text-green-400"
//                           : "bg-red-500/10 text-red-600 dark:text-red-400"
//                       }
//                     >
//                       {user.entityOnboarding.consentToDataCollection ? "Granted" : "Not Granted"}
//                     </Badge>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Terms Agreement</p>
//                     <Badge
//                       className={
//                         user.entityOnboarding.agreeToTerms
//                           ? "bg-green-500/10 text-green-600 dark:text-green-400"
//                           : "bg-red-500/10 text-red-600 dark:text-red-400"
//                       }
//                     >
//                       {user.entityOnboarding.agreeToTerms ? "Agreed" : "Not Agreed"}
//                     </Badge>
//                   </div>
//                 </CardContent>
//               </Card>
//             </>
//           ) : (
//             <Card>
//               <CardContent className="flex min-h-[200px] items-center justify-center">
//                 <div className="text-center text-muted-foreground">
//                   <Building2 className="mx-auto mb-2 h-12 w-12 opacity-50" />
//                   <p>No onboarding information available</p>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </TabsContent>

//         {/* Documents Tab */}
//         <TabsContent value="documents" className="space-y-4">
//           {user.entityOnboarding ? (
//             <>
//               {/* Identity Documents */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <CreditCard className="h-5 w-5" />
//                     Identity Documents
//                   </CardTitle>
//                   <CardDescription>Official identification documents</CardDescription>
//                 </CardHeader>
//                 <CardContent className="grid gap-4 md:grid-cols-2">
//                   <DocumentCard 
//                     title="National ID / Passport (Front)" 
//                     url={user.entityOnboarding.nationalIdUrl} 
//                   />
//                   <DocumentCard 
//                     title="Passport Photo" 
//                     url={user.entityOnboarding.passportPhotoUrl} 
//                   />
//                   <DocumentCard 
//                     title="TIN Certificate" 
//                     url={user.entityOnboarding.tinCertificateUrl} 
//                   />
//                 </CardContent>
//               </Card>

//               {/* Financial Documents */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <FileText className="h-5 w-5" />
//                     Financial Documents
//                   </CardTitle>
//                   <CardDescription>Bank statements and financial records</CardDescription>
//                 </CardHeader>
//                 <CardContent className="grid gap-4 md:grid-cols-2">
//                   <DocumentCard 
//                     title="Bank Statement" 
//                     url={user.entityOnboarding.bankStatementUrl} 
//                   />
//                   <DocumentCard 
//                     title="Proof of Address" 
//                     url={user.entityOnboarding.proofOfAddressUrl} 
//                   />
//                 </CardContent>
//               </Card>

//               {/* Company Documents (if entity type is company) */}
//               {user.entityOnboarding.entityType === "company" && (
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Building2 className="h-5 w-5" />
//                       Company Documents
//                     </CardTitle>
//                     <CardDescription>Company registration and verification documents</CardDescription>
//                   </CardHeader>
//                   <CardContent className="grid gap-4 md:grid-cols-2">
//                     <DocumentCard 
//                       title="Certificate of Incorporation" 
//                       url={user.entityOnboarding.certificateOfIncorporationUrl} 
//                     />
//                     <DocumentCard 
//                       title="Memorandum of Association" 
//                       url={user.entityOnboarding.memorandumUrl} 
//                     />
//                     <DocumentCard 
//                       title="Articles of Association" 
//                       url={user.entityOnboarding.articlesUrl} 
//                     />
//                     <DocumentCard 
//                       title="Company TIN Certificate" 
//                       url={user.entityOnboarding.companyTinUrl} 
//                     />
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Additional Documents */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <FileText className="h-5 w-5" />
//                     Additional Documents
//                   </CardTitle>
//                   <CardDescription>Other supporting documents</CardDescription>
//                 </CardHeader>
//                 <CardContent className="grid gap-4 md:grid-cols-2">
//                   <DocumentCard 
//                     title="Signature Specimen" 
//                     url={user.entityOnboarding.signatureUrl} 
//                   />
//                   {user.entityOnboarding.additionalDocumentUrl && (
//                     <DocumentCard 
//                       title="Additional Document" 
//                       url={user.entityOnboarding.additionalDocumentUrl} 
//                     />
//                   )}
//                 </CardContent>
//               </Card>
//             </>
//           ) : (
//             <Card>
//               <CardContent className="flex min-h-[200px] items-center justify-center">
//                 <div className="text-center text-muted-foreground">
//                   <FileText className="mx-auto mb-2 h-12 w-12 opacity-50" />
//                   <p>No documents available</p>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </TabsContent>

//         {/* Wallet */}
//         <TabsContent value="wallet" className="space-y-4">
//           {user.wallet ? (
//             <>
//               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                 <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
//                   <CardHeader className="pb-2">
//                     <CardDescription className="flex items-center gap-2">
//                       <Wallet className="h-4 w-4" />
//                       Balance
//                     </CardDescription>
//                     <CardTitle className="text-3xl font-bold text-primary">
//                       ${Number(user.wallet.balance ?? 0).toLocaleString()}
//                     </CardTitle>
//                   </CardHeader>
//                 </Card>
//                 <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10">
//                   <CardHeader className="pb-2">
//                     <CardDescription className="flex items-center gap-2">
//                       <TrendingUp className="h-4 w-4" />
//                       Net Asset Value
//                     </CardDescription>
//                     <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">
//                       ${Number(user.wallet.netAssetValue ?? 0).toLocaleString()}
//                     </CardTitle>
//                   </CardHeader>
//                 </Card>
//                 <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-orange-500/10">
//                   <CardHeader className="pb-2">
//                     <CardDescription className="flex items-center gap-2">
//                       <DollarSign className="h-4 w-4" />
//                       Total Fees
//                     </CardDescription>
//                     <CardTitle className="text-3xl font-bold text-orange-600 dark:text-orange-400">
//                       ${Number(user.wallet.totalFees ?? 0).toLocaleString()}
//                     </CardTitle>
//                   </CardHeader>
//                 </Card>
//                 <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
//                   <CardHeader className="pb-2">
//                     <CardDescription className="flex items-center gap-2">
//                       <CreditCard className="h-4 w-4" />
//                       Account Number
//                     </CardDescription>
//                     <CardTitle className="font-mono text-xl font-bold text-blue-600 dark:text-blue-400">
//                       {user.wallet.accountNumber || "—"}
//                     </CardTitle>
//                   </CardHeader>
//                 </Card>
//               </div>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Fee Breakdown</CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid gap-4 md:grid-cols-3">
//                   <div>
//                     <p className="text-sm text-muted-foreground">Bank Fee</p>
//                     <p className="text-2xl font-bold">${Number(user.wallet.bankFee ?? 0).toLocaleString()}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Transaction Fee</p>
//                     <p className="text-2xl font-bold">${Number(user.wallet.transactionFee ?? 0).toLocaleString()}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Fee at Bank</p>
//                     <p className="text-2xl font-bold">${Number(user.wallet.feeAtBank ?? 0).toLocaleString()}</p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Wallet Information</CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid gap-6 md:grid-cols-2">
//                   <div>
//                     <p className="text-sm text-muted-foreground">Status</p>
//                     <Badge
//                       className={
//                         user.wallet.status === "ACTIVE"
//                           ? "bg-green-500/10 text-green-600 dark:text-green-400"
//                           : "bg-red-500/10 text-red-600 dark:text-red-400"
//                       }
//                     >
//                       {user.wallet.status || "—"}
//                     </Badge>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Created</p>
//                     <p className="font-medium">
//                       {user.wallet.createdAt
//                         ? new Date(user.wallet.createdAt).toLocaleDateString()
//                         : "—"}{" "}
//                       {user.wallet.createdAt
//                         ? `(${formatDistanceToNow(new Date(user.wallet.createdAt), { addSuffix: true })})`
//                         : ""}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </>
//           ) : (
//             <Card>
//               <CardContent className="flex min-h-[200px] items-center justify-center">
//                 <div className="text-center text-muted-foreground">
//                   <Wallet className="mx-auto mb-2 h-12 w-12 opacity-50" />
//                   <p>No wallet information available</p>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </TabsContent>

//         {/* Portfolio */}
//         <TabsContent value="portfolio" className="space-y-4">
//           {user.userPortfolios && user.userPortfolios.length > 0 ? (
//             <Card>
//               <CardHeader>
//                 <CardTitle>{user.userPortfolios[0].portfolio.name}</CardTitle>
//                 <CardDescription>User's investment portfolio breakdown</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Asset</TableHead>
//                       <TableHead className="text-right">Cost Price</TableHead>
//                       <TableHead className="text-right">Stock</TableHead>
//                       <TableHead className="text-right">Close Value</TableHead>
//                       <TableHead className="text-right">Loss/Gain</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {user.userPortfolios.map((portfolio: any) =>
//                       portfolio.userAssets?.map((asset: any) => (
//                         <TableRow key={asset.id}>
//                           <TableCell className="font-medium">{asset.portfolioAsset?.name || "N/A"}</TableCell>
//                           <TableCell className="text-right">${Number(asset.costPrice ?? 0).toLocaleString()}</TableCell>
//                           <TableCell className="text-right">{Number(asset.stock ?? 0).toLocaleString()}</TableCell>
//                           <TableCell className="text-right">${Number(asset.closeValue ?? 0).toLocaleString()}</TableCell>
//                           <TableCell className="text-right">
//                             <span
//                               className={
//                                 Number(asset.lossGain ?? 0) >= 0
//                                   ? "flex items-center justify-end gap-1 text-green-600 dark:text-green-400"
//                                   : "flex items-center justify-end gap-1 text-red-600 dark:text-red-400"
//                               }
//                             >
//                               {Number(asset.lossGain ?? 0) >= 0 ? (
//                                 <TrendingUp className="h-4 w-4" />
//                               ) : (
//                                 <TrendingDown className="h-4 w-4" />
//                               )}
//                               ${Math.abs(Number(asset.lossGain ?? 0)).toLocaleString()}
//                             </span>
//                           </TableCell>
//                         </TableRow>
//                       )),
//                     )}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           ) : (
//             <Card>
//               <CardContent className="flex min-h-[200px] items-center justify-center">
//                 <div className="text-center text-muted-foreground">
//                   <TrendingUp className="mx-auto mb-2 h-12 w-12 opacity-50" />
//                   <p>No portfolio assets available</p>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </TabsContent>

//         {/* Transactions */}
//         <TabsContent value="transactions" className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-2">
//             {/* Deposits */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
//                   Deposits
//                 </CardTitle>
//                 <CardDescription>Recent deposit transactions</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {user.deposits && user.deposits.length > 0 ? (
//                   <div className="space-y-4">
//                     {user.deposits.slice(0, 5).map((deposit: any) => (
//                       <div key={deposit.id} className="flex items-center justify-between rounded-lg border p-3">
//                         <div>
//                           <p className="font-medium">${Number(deposit.amount ?? 0).toLocaleString()}</p>
//                           <p className="text-xs text-muted-foreground">
//                             {deposit.createdAt ? new Date(deposit.createdAt).toLocaleDateString() : "—"}
//                           </p>
//                           {deposit.method && <p className="text-xs text-muted-foreground">via {deposit.method}</p>}
//                         </div>
//                         <Badge className={getStatusColor(deposit.transactionStatus)}>
//                           {getStatusIcon(deposit.transactionStatus)}
//                           {deposit.transactionStatus || "—"}
//                         </Badge>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="flex min-h-[100px] items-center justify-center text-sm text-muted-foreground">
//                     No deposits found
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Withdrawals */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
//                   Withdrawals
//                 </CardTitle>
//                 <CardDescription>Recent withdrawal transactions</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {user.withdrawals && user.withdrawals.length > 0 ? (
//                   <div className="space-y-4">
//                     {user.withdrawals.slice(0, 5).map((withdrawal: any) => (
//                       <div key={withdrawal.id} className="flex items-center justify-between rounded-lg border p-3">
//                         <div>
//                           <p className="font-medium">${Number(withdrawal.amount ?? 0).toLocaleString()}</p>
//                           <p className="text-xs text-muted-foreground">
//                             {withdrawal.createdAt ? new Date(withdrawal.createdAt).toLocaleDateString() : "—"}
//                           </p>
//                           {withdrawal.bankName && (
//                             <p className="text-xs text-muted-foreground">to {withdrawal.bankName}</p>
//                           )}
//                         </div>
//                         <Badge className={getStatusColor(withdrawal.transactionStatus)}>
//                           {getStatusIcon(withdrawal.transactionStatus)}
//                           {withdrawal.transactionStatus || "—"}
//                         </Badge>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="flex min-h-[100px] items-center justify-center text-sm text-muted-foreground">
//                     No withdrawals found
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>

//       {/* Document Preview Dialog */}
//       <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
//         <DialogContent className="max-w-4xl max-h-[90vh]">
//           <DialogHeader>
//             <DialogTitle>{previewDocument?.name}</DialogTitle>
//             <DialogDescription>
//               Document preview • {previewDocument?.type === 'image' ? 'Image' : 'PDF'}
//             </DialogDescription>
//           </DialogHeader>
//           <div className="mt-4 overflow-auto max-h-[calc(90vh-200px)]">
//             {previewDocument?.type === 'image' ? (
//               <div className="relative w-full h-full flex items-center justify-center bg-muted/10 rounded-lg">
//                 <Image
//                   src={previewDocument.url}
//                   alt={previewDocument.name}
//                   width={800}
//                   height={600}
//                   className="max-w-full h-auto rounded-lg"
//                   style={{ objectFit: 'contain' }}
//                 />
//               </div>
//             ) : (
//               <iframe
//                 src={previewDocument?.url}
//                 className="w-full h-[600px] rounded-lg border"
//                 title={previewDocument?.name}
//               />
//             )}
//           </div>
//           <div className="flex justify-end gap-2 mt-4">
//             <Button variant="outline" onClick={() => setPreviewDocument(null)}>
//               Close
//             </Button>
//             <Button onClick={() => window.open(previewDocument?.url, '_blank')}>
//               <Download className="mr-2 h-4 w-4" />
//               Download
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete the user account for{" "}
//               <strong>{displayName}</strong> and remove all associated data including wallet, transactions, and portfolio
//               information from the system.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
//               Delete User
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }





// components/user/dashboard-content.tsx
"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts"
import {
  ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown,
  Wallet as WalletIcon, DollarSign, Activity,
  Shield, Target, Briefcase, CreditCard, FileText, Download, Eye,
  Image as ImageIcon, File, Building2, CheckCircle2, Clock, XCircle,
  Layers, BarChart2, PieChartIcon, Banknote, Calendar, Hash, ChevronDown,
} from "lucide-react"
import type { PortfolioSummary } from "@/actions/portfolio-summary"
import { createAllocation } from "@/actions/deposits"
import { createRedemption } from "@/actions/withdraws"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatDistanceToNow } from "date-fns"

type TxStatus = "PENDING" | "APPROVED" | "REJECTED"

type Deposit = {
  id: string
  amount: number
  createdAt: string
  method?: string | null
  transactionStatus: TxStatus
}

type Withdrawal = {
  id: string
  amount: number
  createdAt: string
  method?: string | null
  transactionStatus: TxStatus
}

type Wallet = {
  id: string
  accountNumber: string
  balance?: number | null
  netAssetValue?: number | null
  totalFees?: number | null
  bankFee?: number | null
  transactionFee?: number | null
  feeAtBank?: number | null
  status?: string | null
  updatedAt?: string | null
  createdAt?: string | null
}

type EntityOnboarding = {
  fullName?: string | null
  entityType?: string | null
  dateOfBirth?: string | null
  tin?: string | null
  homeAddress?: string | null
  nationality?: string | null
  countryOfResidence?: string | null
  employmentStatus?: string | null
  occupation?: string | null
  companyName?: string | null
  registrationNumber?: string | null
  companyAddress?: string | null
  businessType?: string | null
  incorporationDate?: string | null
  primaryGoal?: string | null
  timeHorizon?: string | null
  riskTolerance?: string | null
  investmentExperience?: string | null
  expectedInvestment?: string | null
  sourceOfWealth?: string | null
  isPEP?: boolean | string | null
  isApproved?: boolean | null
  consentToDataCollection?: boolean | null
  agreeToTerms?: boolean | null
  // Documents
  nationalIdUrl?: string | null
  passportPhotoUrl?: string | null
  tinCertificateUrl?: string | null
  bankStatementUrl?: string | null
  proofOfAddressUrl?: string | null
  signatureUrl?: string | null
  certificateOfIncorporationUrl?: string | null
  memorandumUrl?: string | null
  articlesUrl?: string | null
  companyTinUrl?: string | null
  additionalDocumentUrl?: string | null
}

type UserForDashboard = {
  id: string
  name: string
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  phone?: string | null
  imageUrl?: string | null
  status?: string | null
  isApproved?: boolean | null
  emailVerified?: boolean | null
  createdAt?: string | null
  updatedAt?: string | null
  wallet?: Wallet | null
  deposits?: Deposit[] | null
  withdrawals?: Withdrawal[] | null
  entityOnboarding?: EntityOnboarding | null
}

type TxRow = {
  id: string
  type: "Deposit" | "Withdrawal"
  amount: number
  status: TxStatus
  date: string
  method?: string | null
}

type SeriesPoint = { date: string; value: number; deposits?: number; withdrawals?: number }

export function UserDetailPreview({
  user,
  portfolioSummary,
}: {
  user: UserForDashboard
  portfolioSummary?: PortfolioSummary | null
}) {
  const [previewDocument, setPreviewDocument] = useState<{ url: string; name: string; type: string } | null>(null)
  const [expandedPortfolios, setExpandedPortfolios] = useState<Set<string>>(new Set())
  const [portfolioAction, setPortfolioAction] = useState<{ type: "topup" | "withdraw"; portfolioId: string; portfolioName: string; walletBalance: number; masterBalance: number; availableCloseValue: number } | null>(null)
  const [actionAmount, setActionAmount] = useState("")
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function togglePortfolio(id: string) {
    setExpandedPortfolios((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // ---------- SAFE MAPS FROM USER ----------
  const wallet = (user as any).masterWallet ?? user.wallet ?? {
    id: "n/a",
    accountNumber: "—",
    balance: 0,
    netAssetValue: 0,
    totalFees: 0,
    bankFee: 0,
    transactionFee: 0,
    feeAtBank: 0,
    status: "INACTIVE",
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }

  const deposits = (user.deposits ?? []).map(d => ({
    ...d,
    amount: Number(d.amount ?? 0),
  }))
  const withdrawals = (user.withdrawals ?? []).map(w => ({
    ...w,
    amount: Number(w.amount ?? 0),
  }))

  const recentTx: TxRow[] = [
    ...deposits.map(d => ({
      id: d.id,
      type: "Deposit" as const,
      amount: d.amount,
      status: d.transactionStatus,
      date: d.createdAt,
      method: d.method ?? null,
    })),
    ...withdrawals.map(w => ({
      id: w.id,
      type: "Withdrawal" as const,
      amount: w.amount,
      status: w.transactionStatus,
      date: w.createdAt,
      method: w.method ?? null,
    })),
  ]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 12)

  // ---------- KPIs ----------
  const availableBalance = Number(wallet.balance ?? 0)
  const netAssetValue = Number(wallet.netAssetValue ?? 0)
  const totalDeposits = deposits.reduce((s, d) => s + d.amount, 0)
  const totalWithdrawals = withdrawals.reduce((s, w) => s + w.amount, 0)
  const cashBalance = portfolioSummary
    ? portfolioSummary.portfolios.reduce((s, p) => s + Number(p.wallet?.balance ?? 0), 0)
    : 0

  // ---------- PORTFOLIO PERFORMANCE SERIES (from topup history) ----------
  // Use portfolioSummary topup events as the NAV timeline if available
  const navPerfSeries: SeriesPoint[] = portfolioSummary
    ? portfolioSummary.portfolios
        .flatMap((p) =>
          p.topupHistory
            .filter((t) => t.createdAt)
            .map((t) => ({ date: t.createdAt, nav: t.newNAV, invested: t.newTotalInvested }))
        )
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((t) => ({
          date: new Date(t.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
          value: t.nav,
          deposits: t.invested,
          withdrawals: 0,
        }))
    : []
  // append current value as last point if different from last topup
  if (portfolioSummary) {
    const currentNAV = portfolioSummary.aggregate.totalValue
    if (navPerfSeries.length === 0 || navPerfSeries[navPerfSeries.length - 1].value !== currentNAV) {
      navPerfSeries.push({ date: "Now", value: currentNAV, deposits: portfolioSummary.aggregate.totalInvested, withdrawals: 0 })
    }
  }

  // ---------- DEPOSITS vs WITHDRAWALS SERIES (from tx, grouped by month) ----------
  const byMonth = new Map<string, { deposits: number; withdrawals: number; monthKey: string }>()
  const allTx = [
    ...deposits.map((d) => ({ type: "Deposit" as const, amount: d.amount, date: d.createdAt })),
    ...withdrawals.map((w) => ({ type: "Withdrawal" as const, amount: w.amount, date: w.createdAt })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  for (const t of allTx) {
    const d = new Date(t.date)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const label = d.toLocaleString("default", { month: "short", year: "2-digit" })
    const bucket = byMonth.get(monthKey) ?? { deposits: 0, withdrawals: 0, monthKey }
    if (t.type === "Deposit") bucket.deposits += t.amount
    else bucket.withdrawals += t.amount
    byMonth.set(monthKey, { ...bucket, monthKey })
  }
  const txSeries: SeriesPoint[] = Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => ({
      date: new Date(key + "-01").toLocaleString("default", { month: "short", year: "2-digit" }),
      value: v.deposits - v.withdrawals,
      deposits: v.deposits,
      withdrawals: v.withdrawals,
    }))

  // For backward compat — keep series pointing to whichever has data
  const series = navPerfSeries.length >= 2 ? navPerfSeries : txSeries

  const portfolioChange =
    navPerfSeries.length >= 2
      ? navPerfSeries[navPerfSeries.length - 1].value - navPerfSeries[0].value
      : 0
  const portfolioChangePercent =
    navPerfSeries.length >= 2 && navPerfSeries[0].value
      ? +(((portfolioChange / navPerfSeries[0].value) * 100).toFixed(1))
      : 0

  const displayName =
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email ||
    "User"

  const safeDate = (d?: string | null) => (d ? new Date(d) : null)

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "COMPLETED":
      case "APPROVED":
        return <CheckCircle2 className="mr-1 h-3 w-3" />
      case "PENDING":
        return <Clock className="mr-1 h-3 w-3" />
      case "REJECTED":
      case "FAILED":
        return <XCircle className="mr-1 h-3 w-3" />
      default:
        return null
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "COMPLETED":
      case "APPROVED":
        return "bg-green-500/10 text-green-600 dark:text-green-400"
      case "PENDING":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400"
      case "REJECTED":
      case "FAILED":
        return "bg-red-500/10 text-red-600 dark:text-red-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getDocumentIcon = (url: string) => {
    const extension = url?.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <ImageIcon className="h-5 w-5" />
    } else if (extension === 'pdf') {
      return <FileText className="h-5 w-5" />
    }
    return <File className="h-5 w-5" />
  }

  const isImage = (url: string) => {
    const extension = url?.split('.').pop()?.toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')
  }

  const DocumentCard = ({ title, url }: { title: string; url?: string | null }) => {
    if (!url) {
      return (
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <File className="h-5 w-5" />
            <div className="flex-1">
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs">Not uploaded</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="group relative rounded-lg border bg-card p-4 transition-colors hover:bg-accent">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {getDocumentIcon(url)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{title}</p>
            <p className="text-xs text-muted-foreground">
              {isImage(url) ? 'Image' : 'PDF'} • Uploaded
            </p>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPreviewDocument({ url, name: title, type: isImage(url) ? 'image' : 'pdf' })}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.open(url, '_blank')}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  const ASSET_COLORS = [
    "#0089ff", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
    "#06b6d4", "#f97316", "#84cc16", "#ec4899", "#14b8a6",
  ]

  const fmtUGX = {
    format: (v: number) => `$${Math.round(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  }
  const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`
  const fmtDate = (d: string | null | undefined) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"

  return (
    <div className="flex-1 space-y-6 p-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="portfolios" className="gap-1">
            <PieChartIcon className="h-3.5 w-3.5" />
            Portfolios
            {portfolioSummary && (
              <span className="ml-1 rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold leading-none">
                {portfolioSummary.aggregate.portfolioCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* ===== Overview ===== */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Available Balance — highlighted as actionable */}
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                <div className="rounded-lg bg-emerald-500/10 p-1.5">
                  <WalletIcon className="h-4 w-4 text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400">
                  {fmtUGX.format(availableBalance)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Available for withdrawal or investment</p>
              </CardContent>
            </Card>

            {/* Cash Balance - sum of all portfolio wallet balances */}
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
                <div className="rounded-lg bg-amber-500/10 p-1.5">
                  <DollarSign className="h-4 w-4 text-amber-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-400">
                  {fmtUGX.format(cashBalance)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Total in portfolio wallets</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Asset Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">
                  {fmtUGX.format(netAssetValue)}
                </div>
                <div className={`flex items-center text-xs mt-1 ${portfolioChange >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {portfolioChange >= 0
                    ? <ArrowUpRight className="mr-1 h-3 w-3" />
                    : <ArrowDownRight className="mr-1 h-3 w-3" />}
                  {portfolioChange >= 0 ? "+" : ""}{portfolioChangePercent}% total return
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {fmtUGX.format(totalDeposits)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{deposits.length} deposit{deposits.length !== 1 ? "s" : ""} all time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {fmtUGX.format(totalWithdrawals)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{withdrawals.length} withdrawal{withdrawals.length !== 1 ? "s" : ""} all time</p>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Performance chart */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>
                {navPerfSeries.length >= 2
                  ? "NAV over time — based on topup history"
                  : "Portfolio value history"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {navPerfSeries.length < 2 ? (
                <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <TrendingUp className="h-10 w-10 opacity-30" />
                  <p className="text-sm">No performance history yet</p>
                  <p className="text-xs">Data will appear once topup history is available</p>
                </div>
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={navPerfSeries} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                      <defs>
                        <linearGradient id="overviewNavGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0089ff" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#0089ff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(v) => (Math.abs(v)>=1e9?(Math.round(v/1e8)/10)+"B":Math.abs(v)>=1e6?(Math.round(v/1e5)/10)+"M":Math.abs(v)>=1e3?(Math.round(v/1e2)/10)+"K":String(Math.round(v)))} />
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                        formatter={(v: any) => [fmtUGX.format(v), "NAV"]}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Area type="monotone" dataKey="value" name="Portfolio NAV" stroke="#0089ff" strokeWidth={2} fill="url(#overviewNavGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deposits vs Withdrawals chart */}
          <Card>
            <CardHeader>
              <CardTitle>Deposits vs Withdrawals</CardTitle>
              <CardDescription>Monthly transaction breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {txSeries.length === 0 ? (
                <div className="h-[280px] flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <BarChart2 className="h-10 w-10 opacity-30" />
                  <p className="text-sm">No transaction history yet</p>
                  <p className="text-xs">Deposits and withdrawals will appear here once recorded</p>
                </div>
              ) : (
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={txSeries} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(v) => (Math.abs(v)>=1e9?(Math.round(v/1e8)/10)+"B":Math.abs(v)>=1e6?(Math.round(v/1e5)/10)+"M":Math.abs(v)>=1e3?(Math.round(v/1e2)/10)+"K":String(Math.round(v)))} />
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                        formatter={(v: any, name: any) => [fmtUGX.format(v), name]}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Bar dataKey="deposits" name="Deposits" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="withdrawals" name="Withdrawals" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Profile ===== */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {(user.firstName?.[0] ?? user.name?.[0] ?? "U")}
                      {(user.lastName?.[0] ?? "").toString()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-semibold">{displayName}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{user.status ?? "ACTIVE"}</Badge>
                      {user.isApproved && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Shield className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{user.email ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{user.phone ?? "—"}</span>
                  </div>
                  {user.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since:</span>
                      <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {user.emailVerified && (
                    <div className="flex items-center gap-2 pt-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Email Verified</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Investment Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Investment Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {user.entityOnboarding ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Primary Goal</p>
                        <p className="font-medium">{user.entityOnboarding.primaryGoal ?? "—"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Time Horizon</p>
                        <Badge variant="outline">{user.entityOnboarding.timeHorizon ?? "—"}</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Risk Tolerance</p>
                        <Badge variant="outline">{user.entityOnboarding.riskTolerance ?? "—"}</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Experience</p>
                        <p className="font-medium">{user.entityOnboarding.investmentExperience ?? "—"}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Source of Wealth</p>
                      <p className="font-medium">{user.entityOnboarding.sourceOfWealth ?? "—"}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">No investment profile found.</p>
                )}
              </CardContent>
            </Card>

            {/* KYC / Employment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  KYC Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {user.entityOnboarding ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Entity Type</span>
                      <Badge>{user.entityOnboarding.entityType ?? "—"}</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Employment</p>
                      <p className="font-medium">{user.entityOnboarding.occupation ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{user.entityOnboarding.companyName ?? "—"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">TIN</p>
                      <p className="font-mono text-xs">{user.entityOnboarding.tin ?? "—"}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-muted-foreground">PEP Status</span>
                      <Badge variant={(user.entityOnboarding.isPEP ?? "No") === "No" ? "outline" : "destructive"}>
                        {String(user.entityOnboarding.isPEP ?? "No")}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">No KYC/onboarding data found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===== Onboarding (Combined with Documents) ===== */}
        <TabsContent value="onboarding" className="space-y-4">
          {user.entityOnboarding ? (
            <>
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Basic personal and identification details</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{user.entityOnboarding.fullName || displayName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Entity Type</p>
                    <Badge variant="outline" className="capitalize">
                      {user.entityOnboarding.entityType || "—"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">
                      {user.entityOnboarding.dateOfBirth
                        ? new Date(user.entityOnboarding.dateOfBirth).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">TIN</p>
                    <p className="font-mono text-sm font-medium">{user.entityOnboarding.tin || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nationality</p>
                    <p className="font-medium">{user.entityOnboarding.nationality || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country of Residence</p>
                    <p className="font-medium">{user.entityOnboarding.countryOfResidence || "—"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Home Address</p>
                    <p className="font-medium">{user.entityOnboarding.homeAddress || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Employment Status</p>
                    <p className="font-medium">{user.entityOnboarding.employmentStatus || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Occupation</p>
                    <p className="font-medium">{user.entityOnboarding.occupation || "—"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Company Information (if applicable) */}
              {user.entityOnboarding.entityType === "company" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>Business and company details</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Company Name</p>
                      <p className="font-medium">{user.entityOnboarding.companyName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Registration Number</p>
                      <p className="font-medium">{user.entityOnboarding.registrationNumber || "N/A"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Company Address</p>
                      <p className="font-medium">{user.entityOnboarding.companyAddress || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Business Type</p>
                      <p className="font-medium">{user.entityOnboarding.businessType || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Incorporation Date</p>
                      <p className="font-medium">
                        {user.entityOnboarding.incorporationDate
                          ? new Date(user.entityOnboarding.incorporationDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Investment Profile */}
              <Card>
                <CardHeader>
                  <CardTitle>Investment Profile</CardTitle>
                  <CardDescription>Investment goals and preferences</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Primary Goal</p>
                    <p className="font-medium">{user.entityOnboarding.primaryGoal || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Horizon</p>
                    <Badge variant="outline">{user.entityOnboarding.timeHorizon || "—"}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Tolerance</p>
                    <Badge variant="outline">{user.entityOnboarding.riskTolerance || "—"}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Investment Experience</p>
                    <p className="font-medium">{user.entityOnboarding.investmentExperience || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Investment</p>
                    <p className="font-medium">{user.entityOnboarding.expectedInvestment || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Source of Wealth</p>
                    <p className="font-medium">{user.entityOnboarding.sourceOfWealth || "—"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance & Verification */}
              <Card>
                <CardHeader>
                  <CardTitle>Compliance & Verification</CardTitle>
                  <CardDescription>KYC and compliance status</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">PEP Status</p>
                    <Badge variant={String(user.entityOnboarding.isPEP) === "true" ? "destructive" : "outline"}>
                      {String(user.entityOnboarding.isPEP ?? "No")}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Approval Status</p>
                    <Badge
                      className={
                        user.entityOnboarding.isApproved
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                      }
                    >
                      {getStatusIcon(user.entityOnboarding.isApproved ? "APPROVED" : "PENDING")}
                      {user.entityOnboarding.isApproved ? "Approved" : "Pending Approval"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data Collection Consent</p>
                    <Badge
                      className={
                        user.entityOnboarding.consentToDataCollection
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }
                    >
                      {user.entityOnboarding.consentToDataCollection ? (
                        <>
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Granted
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-1 h-3 w-3" />
                          Not Granted
                        </>
                      )}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Terms Agreement</p>
                    <Badge
                      className={
                        user.entityOnboarding.agreeToTerms
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }
                    >
                      {user.entityOnboarding.agreeToTerms ? (
                        <>
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Agreed
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-1 h-3 w-3" />
                          Not Agreed
                        </>
                      )}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Section */}
              <div className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Submitted Documents</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  All documents submitted during the onboarding process
                </p>

                {/* Identity Documents */}
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Identity Documents
                    </CardTitle>
                    <CardDescription>Official identification documents</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <DocumentCard 
                      title="National ID / Passport" 
                      url={user.entityOnboarding.nationalIdUrl} 
                    />
                    <DocumentCard 
                      title="Passport Photo" 
                      url={user.entityOnboarding.passportPhotoUrl} 
                    />
                    <DocumentCard 
                      title="TIN Certificate" 
                      url={user.entityOnboarding.tinCertificateUrl} 
                    />
                  </CardContent>
                </Card>

                {/* Financial Documents */}
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Financial Documents
                    </CardTitle>
                    <CardDescription>Bank statements and financial records</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <DocumentCard 
                      title="Bank Statement" 
                      url={user.entityOnboarding.bankStatementUrl} 
                    />
                    <DocumentCard 
                      title="Proof of Address" 
                      url={user.entityOnboarding.proofOfAddressUrl} 
                    />
                  </CardContent>
                </Card>

                {/* Company Documents (if entity type is company) */}
                {user.entityOnboarding.entityType === "company" && (
                  <Card className="mb-4">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Company Documents
                      </CardTitle>
                      <CardDescription>Company registration and verification documents</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <DocumentCard 
                        title="Certificate of Incorporation" 
                        url={user.entityOnboarding.certificateOfIncorporationUrl} 
                      />
                      <DocumentCard 
                        title="Memorandum of Association" 
                        url={user.entityOnboarding.memorandumUrl} 
                      />
                      <DocumentCard 
                        title="Articles of Association" 
                        url={user.entityOnboarding.articlesUrl} 
                      />
                      <DocumentCard 
                        title="Company TIN Certificate" 
                        url={user.entityOnboarding.companyTinUrl} 
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
                    <CardDescription>Other supporting documents</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <DocumentCard 
                      title="Signature Specimen" 
                      url={user.entityOnboarding.signatureUrl} 
                    />
                    {user.entityOnboarding.additionalDocumentUrl && (
                      <DocumentCard 
                        title="Additional Document" 
                        url={user.entityOnboarding.additionalDocumentUrl} 
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex min-h-[400px] items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Building2 className="mx-auto mb-4 h-16 w-16 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Onboarding Information</h3>
                  <p>Complete your onboarding to view this information.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ===== Wallet ===== */}
        <TabsContent value="wallet" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Wallet Details
              </CardTitle>
              <CardDescription>Account information and fee breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Account Number</p>
                  <p className="font-mono text-lg font-semibold">{wallet.accountNumber}</p>
                  <Badge variant={(wallet.status ?? "ACTIVE") === "ACTIVE" ? "default" : "secondary"}>
                    {wallet.status ?? "ACTIVE"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-2xl font-bold">{fmtUGX.format(wallet.balance ?? 0)}</p>
                  <p className="text-xs text-muted-foreground">Available funds</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Net Asset Value</p>
                  <p className="text-2xl font-bold">{fmtUGX.format(wallet.netAssetValue ?? 0)}</p>
                  <p className="text-xs text-muted-foreground">After fees</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Fees</p>
                  <p className="text-2xl font-bold">{fmtUGX.format(wallet.totalFees ?? 0)}</p>
                  <p className="text-xs text-muted-foreground">All charges</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-medium mb-4">Fee Breakdown</p>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Bank Fee</span>
                    <span className="font-semibold">{fmtUGX.format(wallet.bankFee ?? 0)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Transaction Fee</span>
                    <span className="font-semibold">{fmtUGX.format(wallet.transactionFee ?? 0)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Fee at Bank</span>
                    <span className="font-semibold">{fmtUGX.format(wallet.feeAtBank ?? 0)}</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Last updated: {new Date(wallet.updatedAt ?? new Date().toISOString()).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Portfolios ===== */}
        <TabsContent value="portfolios" className="space-y-6">
          {!portfolioSummary ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="rounded-full bg-muted/40 p-5">
                  <PieChartIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">No portfolio data available</p>
              </CardContent>
            </Card>
          ) : (() => {
            const computedTotalFees = portfolioSummary.portfolios.reduce((s, p) => s + (p.wallet?.totalFees ?? 0), 0)
            const computedTotalGainLoss = portfolioSummary.portfolios.reduce((s, p) => s + p.assets.reduce((as, a) => as + a.lossGain, 0), 0)
            const computedTotalInvested = portfolioSummary.aggregate.totalInvested
            const computedTotalValue = portfolioSummary.aggregate.totalValue
            const computedReturnPct = computedTotalInvested > 0
              ? ((computedTotalValue - computedTotalInvested) / computedTotalInvested) * 100
              : 0
            const aggPos = computedTotalGainLoss >= 0
            return (
              <>
                {/* ── Aggregate KPI ── */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: "Total Invested", value: fmtUGX.format(computedTotalInvested), sub: portfolioSummary.aggregate.portfolioCount + " portfolios", icon: DollarSign, cls: "text-blue-400", bg: "bg-blue-500/10" },
                    { label: "Current Value", value: fmtUGX.format(computedTotalValue), sub: "Portfolio NAV", icon: WalletIcon, cls: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { label: "Total Gain / Loss", value: (aggPos ? "+" : "") + fmtUGX.format(computedTotalGainLoss), sub: fmtPct(computedReturnPct), icon: aggPos ? TrendingUp : TrendingDown, cls: aggPos ? "text-emerald-400" : "text-red-400", bg: aggPos ? "bg-emerald-500/10" : "bg-red-500/10" },
                    { label: "Total Fees", value: fmtUGX.format(computedTotalFees), sub: "Sum of all portfolio fees", icon: Banknote, cls: "text-amber-400", bg: "bg-amber-500/10" },
                  ].map((item) => (
                    <Card key={item.label}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
                        <div className={`rounded-lg p-2 ${item.bg}`}><item.icon className={`h-4 w-4 ${item.cls}`} /></div>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-xl font-bold ${item.cls}`}>{item.value}</div>
                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* ── Master Wallet ── */}
                {portfolioSummary.masterWallet && (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-blue-500/10 p-2.5">
                            <Building2 className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <CardTitle className="text-base">Master Wallet</CardTitle>
                            <CardDescription className="font-mono text-xs">{portfolioSummary.masterWallet.accountNumber}</CardDescription>
                          </div>
                        </div>
                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold
                          ${portfolioSummary.masterWallet.status === "ACTIVE"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-slate-500/20 bg-slate-500/10 text-slate-400"}`}>
                          {portfolioSummary.masterWallet.status}
                        </span>
                      </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {[
                          { label: "Net Asset Value", value: fmtUGX.format(portfolioSummary.masterWallet.netAssetValue), cls: "text-blue-400" },
                          { label: "Total Deposited", value: fmtUGX.format(portfolioSummary.masterWallet.totalDeposited), cls: "text-emerald-400" },
                          { label: "Total Withdrawn", value: fmtUGX.format(portfolioSummary.masterWallet.totalWithdrawn), cls: "text-red-400" },
                          { label: "Total Fees", value: fmtUGX.format(portfolioSummary.masterWallet.totalFees), cls: "text-amber-400" },
                          { label: "Net Flow", value: fmtUGX.format(portfolioSummary.masterWallet.totalDeposited - portfolioSummary.masterWallet.totalWithdrawn), cls: (portfolioSummary.masterWallet.totalDeposited - portfolioSummary.masterWallet.totalWithdrawn) >= 0 ? "text-emerald-400" : "text-red-400" },
                        ].map((item) => (
                          <div key={item.label} className="rounded-lg border border-border bg-muted/40 p-3">
                            <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                            <p className={`text-sm font-bold ${item.cls}`}>{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* ── Individual portfolio cards ── */}
                {portfolioSummary.portfolios.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                      <PieChartIcon className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No portfolios assigned</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-8">
                    <h3 className="text-base font-semibold">
                      Individual Portfolios
                      <span className="ml-2 text-sm font-normal text-muted-foreground">({portfolioSummary.portfolios.length})</span>
                    </h3>
                    {portfolioSummary.portfolios.map((p) => {
                      const gainLossFromAssets = p.assets.reduce((s, a) => s + a.lossGain, 0)
                      const pos = gainLossFromAssets >= 0
                      const totalCloseValue = p.assets.reduce((s, a) => s + a.closeValue, 0)

                      // Performance chart from topup history
                      const perfData = p.topupHistory
                        .filter((t) => t.createdAt)
                        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                        .map((t) => ({
                          date: new Date(t.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
                          nav: t.newNAV,
                          invested: t.newTotalInvested,
                        }))
                      if (perfData.length === 0 || perfData[perfData.length - 1].nav !== p.portfolioValue) {
                        perfData.push({ date: "Now", nav: p.portfolioValue, invested: p.totalInvested })
                      }

                      // Asset allocation pie
                      const assetPieData = p.assets.map((a) => ({ name: a.asset.symbol, value: a.allocationPercentage }))

                      // Asset-class pie (by close value)
                      const classMap: Record<string, number> = {}
                      p.assets.forEach((a) => {
                        const cls = a.asset.assetClass || "Other"
                        classMap[cls] = (classMap[cls] ?? 0) + a.closeValue
                      })
                      const classPieData = Object.entries(classMap).map(([name, value]) => ({ name, value }))
                      const classTotal = classPieData.reduce((s, x) => s + x.value, 0)

                      // Asset class table rows
                      const ALL_CLASSES = ["REITS", "Equities", "ETFs", "Cash", "Bonds", "Others"]
                      const classRows: Record<string, { holdings: number; closeValue: number }> = {}
                      ALL_CLASSES.forEach((c) => { classRows[c] = { holdings: 0, closeValue: 0 } })
                      p.assets.forEach((a) => {
                        const key = a.asset.assetClass || "Others"
                        if (!classRows[key]) classRows[key] = { holdings: 0, closeValue: 0 }
                        classRows[key].holdings += 1
                        classRows[key].closeValue += a.closeValue
                      })
                      if ((p.wallet?.balance ?? 0) > 0) {
                        classRows["Cash"] = { holdings: classRows["Cash"]?.holdings ?? 0, closeValue: (classRows["Cash"]?.closeValue ?? 0) + (p.wallet?.balance ?? 0) }
                      }
                      const classTableTotal = Object.values(classRows).reduce((s, r) => s + r.closeValue, 0)

                      // Creation date proxy
                      const sortedTopups = p.topupHistory.slice().sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                      const sortedSubs = p.subPortfolios.slice().sort((a, b) => a.generation - b.generation)
                      const createdDate = sortedTopups.length > 0 ? fmtDate(sortedTopups[0].createdAt)
                        : sortedSubs.length > 0 ? fmtDate(sortedSubs[0].snapshotDate) : "—"

                      const isExpanded = expandedPortfolios.has(p.id)
                      return (
                        <Card key={p.id} className="overflow-hidden">
                          {/* Header — click to expand / collapse */}
                          <CardHeader
                            className="pb-3 cursor-pointer select-none hover:bg-muted/10 transition-colors"
                            onClick={() => togglePortfolio(p.id)}
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="space-y-1 flex-1 min-w-0">
                                <CardTitle className="text-lg">{p.customName}</CardTitle>
                                <CardDescription>{p.portfolio.name}</CardDescription>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
                                    <Clock className="h-2.5 w-2.5" />{p.portfolio.timeHorizon}
                                  </span>
                                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                                    <Activity className="h-2.5 w-2.5" />{p.portfolio.riskTolerance}
                                  </span>
                                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs
                                    ${(p.wallet?.status ?? "") === "ACTIVE" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-slate-500/20 bg-slate-500/10 text-slate-400"}`}>
                                    {p.wallet?.status ?? "—"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 shrink-0">
                                <div className="text-right">
                                  <p className="text-2xl font-bold">{fmtUGX.format(p.portfolioValue)}</p>
                                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold mt-1
                                    ${pos ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-red-500/20 bg-red-500/10 text-red-400"}`}>
                                    {pos ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                    {fmtPct(p.returnPct)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1" onClick={(e) => e.stopPropagation()}>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 gap-1.5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 text-xs"
                                    onClick={() => {
                                      setPortfolioAction({ type: "topup", portfolioId: p.id, portfolioName: p.customName, walletBalance: p.wallet?.balance ?? 0, masterBalance: portfolioSummary.masterWallet?.netAssetValue ?? 0, availableCloseValue: 0 })
                                      setActionAmount("")
                                      setActionError(null)
                                      setActionSuccess(null)
                                    }}
                                  >
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                    Top Up
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 gap-1.5 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 text-xs"
                                    onClick={() => {
                                      setPortfolioAction({ type: "withdraw", portfolioId: p.id, portfolioName: p.customName, walletBalance: p.wallet?.balance ?? 0, masterBalance: portfolioSummary.masterWallet?.netAssetValue ?? 0, availableCloseValue: p.assets.reduce((s: number, a: any) => s + (a.closeValue ?? 0), 0) })
                                      setActionAmount("")
                                      setActionError(null)
                                      setActionSuccess(null)
                                    }}
                                  >
                                    <ArrowDownRight className="h-3.5 w-3.5" />
                                    Withdraw
                                  </Button>
                                </div>
                                <div className="mt-1 rounded-full border border-border p-1.5 text-muted-foreground">
                                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                                </div>
                              </div>
                            </div>
                          </CardHeader>

                          {isExpanded && (
                          <CardContent className="pt-6 space-y-6 border-t border-border">
                            {/* Stats row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {[
                                { label: "Total Invested", value: fmtUGX.format(p.totalInvested), cls: "", border: "" },
                                { label: "Current Value", value: fmtUGX.format(p.portfolioValue), cls: "", border: "" },
                                { label: "Gain / Loss", value: (pos ? "+" : "") + fmtUGX.format(gainLossFromAssets), cls: pos ? "text-emerald-400" : "text-red-400", border: pos ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5" },
                                { label: "NAV", value: fmtUGX.format(p.wallet?.netAssetValue ?? 0), cls: "text-blue-400", border: "" },
                              ].map((item) => (
                                <div key={item.label} className={`rounded-lg border p-3 ${item.border || "border-border bg-muted/40"}`}>
                                  <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                                  <p className={`text-base font-bold ${item.cls}`}>{item.value}</p>
                                </div>
                              ))}
                            </div>

                            {/* Row 1: Performance chart + Portfolio Details */}
                            <div className="grid gap-4 lg:grid-cols-2">
                              <Card className="border-border bg-muted/10">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm font-semibold">Performance Over Time</CardTitle>
                                  <CardDescription className="text-xs">Portfolio value history</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  {perfData.length < 2 ? (
                                    <div className="h-[220px] flex items-center justify-center text-xs text-muted-foreground">
                                      Insufficient data for chart
                                    </div>
                                  ) : (
                                    <div className="h-[220px]">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={perfData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                                          <defs>
                                            <linearGradient id={`navGrad${p.id}`} x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor="#0089ff" stopOpacity={0.4} />
                                              <stop offset="95%" stopColor="#0089ff" stopOpacity={0} />
                                            </linearGradient>
                                          </defs>
                                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                                          <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => (v / 1000).toFixed(0) + "k"} />
                                          <Tooltip
                                            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                                            formatter={(v: any) => [fmtUGX.format(v)]}
                                          />
                                          <Area type="monotone" dataKey="nav" name="NAV" stroke="#0089ff" strokeWidth={2} fill={`url(#navGrad${p.id})`} />
                                        </AreaChart>
                                      </ResponsiveContainer>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>

                              <Card className="border-border bg-muted/10">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm font-semibold">Portfolio Details</CardTitle>
                                  <CardDescription className="text-xs">Key information</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="divide-y divide-border">
                                    {[
                                      { label: "Risk Tolerance", value: p.portfolio.riskTolerance, cls: "" },
                                      { label: "Time Horizon", value: p.portfolio.timeHorizon, cls: "" },
                                      { label: "Number of Assets", value: String(p.assets.length), cls: "" },
                                      { label: "Created Date", value: createdDate, cls: "" },
                                      { label: "Total Return", value: fmtPct(p.returnPct), cls: pos ? "text-emerald-400" : "text-red-400" },
                                    ].map((row) => (
                                      <div key={row.label} className="flex items-center justify-between py-2.5">
                                        <span className="text-sm text-blue-400 font-medium">{row.label}</span>
                                        <span className={`text-sm font-semibold ${row.cls}`}>{row.value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Asset Holdings Table */}
                            <Card className="border-border bg-muted/10">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold">Holdings</CardTitle>
                                <CardDescription className="text-xs">All positions in this portfolio</CardDescription>
                              </CardHeader>
                              <CardContent className="p-0">
                                {p.assets.length === 0 ? (
                                  <p className="py-6 text-center text-sm text-muted-foreground">No assets assigned</p>
                                ) : (
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                      <thead>
                                        <tr className="border-b border-border bg-muted/40">
                                          {["Symbol", "Description", "Asset Class", "Stocks", "Allocation", "Cost Per Share", "Cost Price", "Close Price", "Close Value", "U/L/G"].map((h) => (
                                            <th key={h} className="px-3 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {p.assets.map((a, i) => {
                                          const aPos = a.lossGain >= 0
                                          return (
                                            <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                              <td className="px-3 py-2.5">
                                                <div className="flex items-center gap-1.5">
                                                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: ASSET_COLORS[i % ASSET_COLORS.length] }} />
                                                  <span className="font-bold">{a.asset.symbol}</span>
                                                </div>
                                              </td>
                                              <td className="px-3 py-2.5 max-w-[150px] truncate text-muted-foreground">{a.asset.description}</td>
                                              <td className="px-3 py-2.5 text-muted-foreground">{a.asset.assetClass || "—"}</td>
                                              <td className="px-3 py-2.5">{a.stock.toLocaleString()}</td>
                                              <td className="px-3 py-2.5">{a.allocationPercentage.toFixed(1)}%</td>
                                              <td className="px-3 py-2.5">{fmtUGX.format(a.costPerShare)}</td>
                                              <td className="px-3 py-2.5">{fmtUGX.format(a.costPrice)}</td>
                                              <td className="px-3 py-2.5">{fmtUGX.format(a.asset.closePrice)}</td>
                                              <td className="px-3 py-2.5 font-semibold">{fmtUGX.format(a.closeValue)}</td>
                                              <td className={`px-3 py-2.5 font-semibold ${aPos ? "text-emerald-400" : "text-red-400"}`}>
                                                {aPos ? "+" : ""}{fmtUGX.format(a.lossGain)}
                                              </td>
                                            </tr>
                                          )
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            {/* Row 2: Asset Allocation pie + Asset Class Allocation pie */}
                            {p.assets.length > 0 && (
                              <div className="grid gap-4 lg:grid-cols-2">
                                <Card className="border-border bg-muted/10">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-semibold">Asset Allocation</CardTitle>
                                    <CardDescription className="text-xs">Distribution by asset</CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="h-[260px]">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                          <Pie data={assetPieData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                                            label={({ name, value }) => `${name} ${Number(value).toFixed(0)}%`} labelLine>
                                            {assetPieData.map((_, i) => <Cell key={i} fill={ASSET_COLORS[i % ASSET_COLORS.length]} />)}
                                          </Pie>
                                          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                                            formatter={(v: any) => [`${Number(v).toFixed(1)}%`]} />
                                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                                        </PieChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card className="border-border bg-muted/10">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-semibold">Asset Class Allocation</CardTitle>
                                    <CardDescription className="text-xs">Distribution by class</CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="h-[260px]">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                          <Pie data={classPieData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                                            label={({ name, value }) => `${name} ${classTotal > 0 ? ((Number(value) / classTotal) * 100).toFixed(0) : 0}%`} labelLine>
                                            {classPieData.map((_, i) => <Cell key={i} fill={ASSET_COLORS[(i + 3) % ASSET_COLORS.length]} />)}
                                          </Pie>
                                          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                                            formatter={(v: any) => [fmtUGX.format(v)]} />
                                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                                        </PieChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}

                            {/* Allocation Breakdown list */}
                            {p.assets.length > 0 && (
                              <Card className="border-border bg-muted/10">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm font-semibold">Allocation Breakdown</CardTitle>
                                  <CardDescription className="text-xs">Percentage allocation by asset</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-1">
                                    {p.assets.map((a, i) => {
                                      const pct = totalCloseValue > 0 ? (a.closeValue / totalCloseValue) * 100 : 0
                                      return (
                                        <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                          <div className="flex items-center gap-2.5 min-w-0">
                                            <span className="h-3 w-3 rounded-sm shrink-0" style={{ background: ASSET_COLORS[i % ASSET_COLORS.length] }} />
                                            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-bold"
                                              style={{ background: ASSET_COLORS[i % ASSET_COLORS.length] + "28", color: ASSET_COLORS[i % ASSET_COLORS.length] }}>
                                              {a.asset.symbol}
                                            </span>
                                            <span className="text-sm text-muted-foreground truncate">{a.asset.description}</span>
                                          </div>
                                          <div className="flex items-center gap-4 shrink-0">
                                            <span className="text-sm font-semibold">{fmtUGX.format(a.closeValue)}</span>
                                            <span className="text-sm text-muted-foreground w-16 text-right">{pct.toFixed(2)}%</span>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* Asset Class Breakdown table */}
                            <Card className="border-border bg-muted/10">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold">Asset Class Breakdown</CardTitle>
                              </CardHeader>
                              <CardContent className="p-0">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-border bg-muted/40">
                                      <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground">Asset Class</th>
                                      <th className="px-4 py-2.5 text-right font-semibold text-muted-foreground">Holdings</th>
                                      <th className="px-4 py-2.5 text-right font-semibold text-muted-foreground">Total Cash Value</th>
                                      <th className="px-4 py-2.5 text-right font-semibold text-muted-foreground">%</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Object.entries(classRows).map(([cls, row]) => (
                                      <tr key={cls} className="border-b border-border last:border-0 hover:bg-muted/20">
                                        <td className="px-4 py-2.5 font-medium">{cls}</td>
                                        <td className="px-4 py-2.5 text-right text-muted-foreground">{row.holdings}</td>
                                        <td className="px-4 py-2.5 text-right">{fmtUGX.format(row.closeValue)}</td>
                                        <td className="px-4 py-2.5 text-right text-muted-foreground">{classTableTotal > 0 ? ((row.closeValue / classTableTotal) * 100).toFixed(2) : "0.00"}%</td>
                                      </tr>
                                    ))}
                                    <tr className="bg-muted/30">
                                      <td className="px-4 py-2.5 font-bold">Total</td>
                                      <td className="px-4 py-2.5 text-right font-bold">{p.assets.length}</td>
                                      <td className="px-4 py-2.5 text-right font-bold">{fmtUGX.format(classTableTotal)}</td>
                                      <td className="px-4 py-2.5 text-right font-bold">100.00%</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </CardContent>
                            </Card>

                            {/* Wallet stripe */}
                            <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-semibold text-sm">Portfolio Wallet</span>
                                  <span className="font-mono text-xs text-muted-foreground">{p.wallet?.accountNumber ?? "—"}</span>
                                </div>
                                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs
                                  ${(p.wallet?.status ?? "") === "ACTIVE" ? "border-emerald-500/20 text-emerald-400" : "border-slate-500/20 text-slate-400"}`}>
                                  {p.wallet?.status ?? "—"}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                <div><p className="text-muted-foreground mb-0.5">Balance</p><p className="font-semibold text-sm">{fmtUGX.format(p.wallet?.balance ?? 0)}</p></div>
                                <div><p className="text-muted-foreground mb-0.5">NAV</p><p className="font-semibold text-sm text-blue-400">{fmtUGX.format(p.wallet?.netAssetValue ?? 0)}</p></div>
                                <div><p className="text-muted-foreground mb-0.5">Total Fees</p><p className="font-semibold text-sm text-amber-400">{fmtUGX.format(p.wallet?.totalFees ?? 0)}</p></div>
                                <div><p className="text-muted-foreground mb-0.5">Topups</p><p className="font-semibold text-sm">{p.topupHistory.length}</p></div>
                              </div>
                            </div>

                            {/* Topup history */}
                            {p.topupHistory.length > 0 && (
                              <Card className="border-border bg-muted/10">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm font-semibold">Topup History</CardTitle>
                                  <CardDescription className="text-xs">{p.topupHistory.length} topup event{p.topupHistory.length !== 1 ? "s" : ""}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  {p.topupHistory
                                    .slice()
                                    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                                    .map((t, i) => {
                                      const tPos = t.gainLoss >= 0
                                      return (
                                        <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs">
                                          <div className="flex items-center gap-2">
                                            <span className="font-mono text-muted-foreground">#{i + 1}</span>
                                            <span className="font-semibold">{fmtUGX.format(t.topupAmount)}</span>
                                            <span className="text-muted-foreground hidden sm:block">→ NAV {fmtUGX.format(t.newNAV)}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className={tPos ? "text-emerald-400 font-medium" : "text-red-400 font-medium"}>{tPos ? "+" : ""}{fmtUGX.format(t.gainLoss)}</span>
                                            <span className="text-muted-foreground">Fees: {fmtUGX.format(t.totalFees)}</span>
                                            <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${t.status === "MERGED" ? "border-emerald-500/20 text-emerald-400" : "border-amber-500/20 text-amber-400"}`}>{t.status}</span>
                                            <span className="text-muted-foreground">{fmtDate(t.createdAt)}</span>
                                          </div>
                                        </div>
                                      )
                                    })}
                                </CardContent>
                              </Card>
                            )}

                            {/* Sub-portfolios */}
                            <Card className="border-border bg-muted/10">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold">Sub-Portfolios</CardTitle>
                                <CardDescription className="text-xs">Investment slices by generation ({p.subPortfolios.length} slice{p.subPortfolios.length !== 1 ? "s" : ""})</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                {p.subPortfolios.length === 0 ? (
                                  <p className="py-4 text-center text-sm text-muted-foreground">No sub-portfolios yet</p>
                                ) : (
                                  p.subPortfolios.map((s) => {
                                    const sPos = s.totalLossGain >= 0
                                    return (
                                      <div key={s.id} className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{s.label}</span>
                                            <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">Gen {s.generation}</span>
                                          </div>
                                          <span className="text-xs text-muted-foreground">{fmtDate(s.snapshotDate)}</span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                          <div className="rounded bg-muted/40 p-2"><p className="text-muted-foreground mb-0.5">Invested</p><p className="font-semibold">{fmtUGX.format(s.amountInvested)}</p></div>
                                          <div className="rounded bg-muted/40 p-2"><p className="text-muted-foreground mb-0.5">Close Value</p><p className="font-semibold">{fmtUGX.format(s.totalCloseValue)}</p></div>
                                          <div className={`rounded p-2 ${sPos ? "bg-emerald-500/5" : "bg-red-500/5"}`}><p className="text-muted-foreground mb-0.5">Gain / Loss</p><p className={`font-semibold ${sPos ? "text-emerald-400" : "text-red-400"}`}>{sPos ? "+" : ""}{fmtUGX.format(s.totalLossGain)}</p></div>
                                          <div className="rounded bg-muted/40 p-2"><p className="text-muted-foreground mb-0.5">Cash at Bank</p><p className="font-semibold">{fmtUGX.format(s.cashAtBank)}</p></div>
                                        </div>
                                      </div>
                                    )
                                  })
                                )}
                              </CardContent>
                            </Card>

                          </CardContent>
                          )}
                        </Card>
                      )
                    })}
                  </div>
                )}
              </>
            )
          })()}
        </TabsContent>


        {/* ===== Transactions ===== */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest deposits and withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTx.map((t) => (
                  <div key={t.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{t.type}</p>
                        <Badge
                          variant={
                            t.status === "APPROVED" ? "default" : t.status === "PENDING" ? "secondary" : "destructive"
                          }
                          className="text-xs"
                        >
                          {t.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {(t.method ?? "—")} • {new Date(t.date).toLocaleString()}
                      </p>
                    </div>
                    <div className={`text-sm font-semibold ${t.type === "Deposit" ? "text-green-600" : "text-red-600"}`}>
                      {t.type === "Deposit" ? "+" : "-"}{fmtUGX.format(t.amount)}
                    </div>
                  </div>
                ))}
                {recentTx.length === 0 && (
                  <p className="text-sm text-muted-foreground">No recent transactions.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Document Preview Dialog */}
      {/* ===== Top Up / Withdraw Dialog ===== */}
      <Dialog open={!!portfolioAction} onOpenChange={(open) => { if (!open) setPortfolioAction(null) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {portfolioAction?.type === "topup" ? "Top Up Portfolio" : "Withdraw from Portfolio"}
            </DialogTitle>
            <DialogDescription>
              {portfolioAction?.type === "topup"
                ? `Allocate funds from master wallet into "${portfolioAction?.portfolioName}"`
                : `Redeem funds from "${portfolioAction?.portfolioName}" back to master wallet`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground mb-0.5">Master Wallet</p>
                <p className="font-semibold text-sm">{fmtUGX.format(portfolioAction?.masterBalance ?? 0)}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {portfolioAction?.type === "withdraw" ? "Current Value" : "Portfolio Wallet"}
                </p>
                <p className="font-semibold text-sm">
                  {fmtUGX.format(portfolioAction?.type === "withdraw" ? (portfolioAction?.availableCloseValue ?? 0) : (portfolioAction?.walletBalance ?? 0))}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="action-amount">Amount (UGX)</Label>
              <Input
                id="action-amount"
                type="number"
                min={1}
                max={portfolioAction?.type === "withdraw" ? (portfolioAction?.availableCloseValue ?? undefined) : undefined}
                step={1000}
                placeholder="Enter amount"
                value={actionAmount}
                onChange={(e) => { setActionAmount(e.target.value); setActionError(null); setActionSuccess(null) }}
                disabled={isPending}
              />
              {portfolioAction?.type === "topup" && Number(actionAmount) > 0 && (
                <p className="text-xs text-muted-foreground">
                  Remaining master wallet balance after topup: <span className="font-semibold text-foreground">{fmtUGX.format((portfolioAction?.masterBalance ?? 0) - Number(actionAmount))}</span>
                </p>
              )}
              {portfolioAction?.type === "withdraw" && Number(actionAmount) > (portfolioAction?.availableCloseValue ?? 0) && (
                <p className="text-xs text-red-400">You cannot withdraw more than the portfolio current value of {fmtUGX.format(portfolioAction?.availableCloseValue ?? 0)}.</p>
              )}
            </div>

            {actionError && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{actionError}</p>
            )}
            {actionSuccess && (
              <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">{actionSuccess}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setPortfolioAction(null)} disabled={isPending}>
              Cancel
            </Button>
            <Button
              disabled={isPending || !actionAmount || Number(actionAmount) <= 0 || (portfolioAction?.type === "withdraw" && Number(actionAmount) > (portfolioAction?.availableCloseValue ?? 0))}
              className={portfolioAction?.type === "topup"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-amber-600 hover:bg-amber-700 text-white"}
              onClick={() => {
                if (!portfolioAction) return
                const amount = Number(actionAmount)
                if (!Number.isFinite(amount) || amount <= 0) {
                  setActionError("Enter a valid positive amount.")
                  return
                }
                if (portfolioAction.type === "withdraw" && amount > (portfolioAction.availableCloseValue ?? 0)) {
                  setActionError(`Amount exceeds current portfolio value of ${fmtUGX.format(portfolioAction.availableCloseValue ?? 0)}.`)
                  return
                }
                startTransition(async () => {
                  setActionError(null)
                  setActionSuccess(null)
                  let result: { success: boolean; error?: string }
                  if (portfolioAction.type === "topup") {
                    result = await createAllocation({ userId: user.id, userPortfolioId: portfolioAction.portfolioId, amount })
                  } else {
                    result = await createRedemption({ userId: user.id, userPortfolioId: portfolioAction.portfolioId, amount })
                  }
                  if (result.success) {
                    setActionSuccess(portfolioAction.type === "topup"
                      ? `Allocation of ${fmtUGX.format(amount)} submitted. Awaiting approval.`
                      : `${fmtUGX.format(amount)} redeemed successfully and added to your master wallet.`)
                    setActionAmount("")
                  } else {
                    setActionError(result.error ?? "Request failed.")
                  }
                })
              }}
            >
              {isPending ? "Processing…" : portfolioAction?.type === "topup" ? "Submit Top Up" : "Submit Withdrawal"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{previewDocument?.name}</DialogTitle>
            <DialogDescription>
              Document preview • {previewDocument?.type === 'image' ? 'Image' : 'PDF'}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 overflow-auto max-h-[calc(90vh-200px)]">
            {previewDocument?.type === 'image' ? (
              <div className="relative w-full h-full flex items-center justify-center bg-muted/10 rounded-lg">
                <Image
                  src={previewDocument.url}
                  alt={previewDocument.name}
                  width={800}
                  height={600}
                  className="max-w-full h-auto rounded-lg"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            ) : (
              <iframe
                src={previewDocument?.url}
                className="w-full h-[600px] rounded-lg border"
                title={previewDocument?.name}
              />
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setPreviewDocument(null)}>
              Close
            </Button>
            <Button onClick={() => window.open(previewDocument?.url, '_blank')}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}