


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Building2,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  UserCheck,
  UserX,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type MaybeDate = string | Date;

export interface UserDetail {
  id: string;
  email?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  imageUrl?: string;
  status?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  isApproved?: boolean;
  createdAt?: MaybeDate;
  updatedAt?: MaybeDate;
  // loosely typed nested objects used below
  entityOnboarding?: any;
  wallet?: any;
  userPortfolios?: any[];
  deposits?: any[];
  withdrawals?: any[];
}

export function UserDetailView({ user: initialUser }: { user: UserDetail | null }) {
  const router = useRouter();

  // If no user was found on the server, show the empty state.
  if (!initialUser) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h2 className="text-2xl font-bold">User Not Found</h2>
          <p className="mt-2 text-muted-foreground">The user you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/dashboard/users")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  // Local state from the incoming server-provided user
  const [user, setUser] = useState<UserDetail>(initialUser);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const displayName =
    user.name ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email ||
    "Unnamed User";

  const safeDate = (d?: MaybeDate) => (d ? new Date(d) : null);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "COMPLETED":
      case "APPROVED":
        return <CheckCircle2 className="mr-1 h-3 w-3" />;
      case "PENDING":
        return <Clock className="mr-1 h-3 w-3" />;
      case "REJECTED":
      case "FAILED":
        return <XCircle className="mr-1 h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "COMPLETED":
      case "APPROVED":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "PENDING":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
      case "REJECTED":
      case "FAILED":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      router.push("/users");
    } catch (error) {
      console.error("[v0] Error deleting user:", error);
    }
  };

  const handleStatusToggle = async (field: "emailVerified" | "isActive") => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/users/${user.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value: !Boolean((user as any)[field]) }),
      });
      const updated = await res.json();
      setUser((prev) => ({ ...prev, ...updated }));
    } catch (error) {
      console.error("[v0] Error updating status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/dashboard/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/users/${user.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </Button>
        </div>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-primary/20">
                <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={displayName} />
                <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                  {(user.firstName?.[0] || user.name?.[0] || "U").toUpperCase()}
                  {(user.lastName?.[0] || user.name?.split(" ")?.[1]?.[0] || "").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl">{displayName}</CardTitle>
                <CardDescription className="mt-1 text-base">
                  {user.role || "—"} • ID: {user.id}
                </CardDescription>
                <div className="mt-2 flex flex-wrap gap-2">
                  {/* <Badge
                    variant={user.isActive ? "default" : "secondary"}
                    className={
                      user.isActive
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }
                  >
                    {user.isActive ? (
                      <>
                        <UserCheck className="mr-1 h-3 w-3" />
                        Active
                      </>
                    ) : (
                      <>
                        <UserX className="mr-1 h-3 w-3" />
                        Inactive
                      </>
                    )}
                  </Badge> */}

                  {user.emailVerified && (
                    <Badge className="border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Email Verified
                    </Badge>
                  )}

                  {user.isApproved ? (
                    <Badge className="border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Approved
                    </Badge>
                  ) : (
                    <Badge className="border-orange-500/50 bg-orange-500/10 text-orange-600 dark:text-orange-400">
                      <Clock className="mr-1 h-3 w-3" />
                      Pending Approval
                    </Badge>
                  )}

                  {user.status && <Badge variant="outline">{user.status}</Badge>}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone || "—"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {safeDate(user.createdAt)?.toLocaleDateString() || "—"}{" "}
                    {safeDate(user.createdAt)
                      ? `(${formatDistanceToNow(safeDate(user.createdAt)!, { addSuffix: true })})`
                      : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {safeDate(user.updatedAt)?.toLocaleDateString() || "—"}{" "}
                    {safeDate(user.updatedAt)
                      ? `(${formatDistanceToNow(safeDate(user.updatedAt)!, { addSuffix: true })})`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Status Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status Controls</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="email-verified" className="text-base font-medium">
                    Email Verified
                  </Label>
                  <p className="text-sm text-muted-foreground">User's email verification status</p>
                </div>
                <Switch
                  id="email-verified"
                  checked={Boolean(user.emailVerified)}
                  onCheckedChange={() => handleStatusToggle("emailVerified")}
                  disabled={updatingStatus}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="is-active" className="text-base font-medium">
                    Active Status
                  </Label>
                  <p className="text-sm text-muted-foreground">User's account active status</p>
                </div>
                <Switch
                  id="is-active"
                  checked={Boolean(user.isActive)}
                  onCheckedChange={() => handleStatusToggle("isActive")}
                  disabled={updatingStatus}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="onboarding" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* Onboarding */}
        <TabsContent value="onboarding" className="space-y-4">
          {user.entityOnboarding ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{user.entityOnboarding.fullName || displayName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Entity Type</p>
                    <p className="font-medium capitalize">{user.entityOnboarding.entityType || "—"}</p>
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
                    <p className="font-medium">{user.entityOnboarding.tin || "—"}</p>
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

              {user.entityOnboarding.entityType === "company" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
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

              <Card>
                <CardHeader>
                  <CardTitle>Investment Profile</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Primary Goal</p>
                    <p className="font-medium">{user.entityOnboarding.primaryGoal || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Horizon</p>
                    <p className="font-medium">{user.entityOnboarding.timeHorizon || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Tolerance</p>
                    <p className="font-medium">{user.entityOnboarding.riskTolerance || "—"}</p>
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

              <Card>
                <CardHeader>
                  <CardTitle>Compliance & Verification</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">PEP Status</p>
                    <p className="font-medium">{String(user.entityOnboarding.isPEP ?? "—")}</p>
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
                      {user.entityOnboarding.isApproved ? "Approved" : "Pending"}
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
                      {user.entityOnboarding.consentToDataCollection ? "Granted" : "Not Granted"}
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
                      {user.entityOnboarding.agreeToTerms ? "Agreed" : "Not Agreed"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex min-h-[200px] items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Building2 className="mx-auto mb-2 h-12 w-12 opacity-50" />
                  <p>No onboarding information available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Wallet */}
        <TabsContent value="wallet" className="space-y-4">
          {user.wallet ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Balance
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold text-primary">
                      ${Number(user.wallet.balance ?? 0).toLocaleString()}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Net Asset Value
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">
                      ${Number(user.wallet.netAssetValue ?? 0).toLocaleString()}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-orange-500/10">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Total Fees
                    </CardDescription>
                    <CardTitle className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      ${Number(user.wallet.totalFees ?? 0).toLocaleString()}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-500/10">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Account Number
                    </CardDescription>
                    <CardTitle className="font-mono text-xl font-bold text-blue-600 dark:text-blue-400">
                      {user.wallet.accountNumber || "—"}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Fee Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Bank Fee</p>
                    <p className="text-2xl font-bold">${Number(user.wallet.bankFee ?? 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction Fee</p>
                    <p className="text-2xl font-bold">${Number(user.wallet.transactionFee ?? 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fee at Bank</p>
                    <p className="text-2xl font-bold">${Number(user.wallet.feeAtBank ?? 0).toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Wallet Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                      className={
                        user.wallet.status === "ACTIVE"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }
                    >
                      {user.wallet.status || "—"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {user.wallet.createdAt
                        ? new Date(user.wallet.createdAt).toLocaleDateString()
                        : "—"}{" "}
                      {user.wallet.createdAt
                        ? `(${formatDistanceToNow(new Date(user.wallet.createdAt), { addSuffix: true })})`
                        : ""}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex min-h-[200px] items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Wallet className="mx-auto mb-2 h-12 w-12 opacity-50" />
                  <p>No wallet information available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Portfolio */}
        <TabsContent value="portfolio" className="space-y-4">
          {user.userPortfolios && user.userPortfolios.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>{user.userPortfolios[0].portfolio.name}</CardTitle>
                <CardDescription>User's investment portfolio breakdown</CardDescription>
              </CardHeader>
              <CardContent>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead className="text-right">Cost Price</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
                      <TableHead className="text-right">Close Value</TableHead>
                      <TableHead className="text-right">Loss/Gain</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.userPortfolios.map((portfolio: any) =>
                      portfolio.userAssets?.map((asset: any) => (
                        <TableRow key={asset.id}>
                          <TableCell className="font-medium">{asset.portfolioAsset?.name || "N/A"}</TableCell>
                          <TableCell className="text-right">${Number(asset.costPrice ?? 0).toLocaleString()}</TableCell>
                          <TableCell className="text-right">{Number(asset.stock ?? 0).toLocaleString()}</TableCell>
                          <TableCell className="text-right">${Number(asset.closeValue ?? 0).toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <span
                              className={
                                Number(asset.lossGain ?? 0) >= 0
                                  ? "flex items-center justify-end gap-1 text-green-600 dark:text-green-400"
                                  : "flex items-center justify-end gap-1 text-red-600 dark:text-red-400"
                              }
                            >
                              {Number(asset.lossGain ?? 0) >= 0 ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              ${Math.abs(Number(asset.lossGain ?? 0)).toLocaleString()}
                            </span>
                          </TableCell>
                        </TableRow>
                      )),
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex min-h-[200px] items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="mx-auto mb-2 h-12 w-12 opacity-50" />
                  <p>No portfolio assets available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Transactions */}
        <TabsContent value="transactions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Deposits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Deposits
                </CardTitle>
                <CardDescription>Recent deposit transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {user.deposits && user.deposits.length > 0 ? (
                  <div className="space-y-4">
                    {user.deposits.slice(0, 5).map((deposit: any) => (
                      <div key={deposit.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="font-medium">${Number(deposit.amount ?? 0).toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {deposit.createdAt ? new Date(deposit.createdAt).toLocaleDateString() : "—"}
                          </p>
                          {deposit.method && <p className="text-xs text-muted-foreground">via {deposit.method}</p>}
                        </div>
                        <Badge className={getStatusColor(deposit.transactionStatus)}>
                          {getStatusIcon(deposit.transactionStatus)}
                          {deposit.transactionStatus || "—"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[100px] items-center justify-center text-sm text-muted-foreground">
                    No deposits found
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Withdrawals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                  Withdrawals
                </CardTitle>
                <CardDescription>Recent withdrawal transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {user.withdrawals && user.withdrawals.length > 0 ? (
                  <div className="space-y-4">
                    {user.withdrawals.slice(0, 5).map((withdrawal: any) => (
                      <div key={withdrawal.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="font-medium">${Number(withdrawal.amount ?? 0).toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {withdrawal.createdAt ? new Date(withdrawal.createdAt).toLocaleDateString() : "—"}
                          </p>
                          {withdrawal.bankName && (
                            <p className="text-xs text-muted-foreground">to {withdrawal.bankName}</p>
                          )}
                        </div>
                        <Badge className={getStatusColor(withdrawal.transactionStatus)}>
                          {getStatusIcon(withdrawal.transactionStatus)}
                          {withdrawal.transactionStatus || "—"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[100px] items-center justify-center text-sm text-muted-foreground">
                    No withdrawals found
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account for{" "}
              <strong>{displayName}</strong> and remove all associated data including wallet, transactions, and portfolio
              information from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
