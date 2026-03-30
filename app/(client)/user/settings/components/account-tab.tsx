"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { deleteAccount, UserSettings } from "@/actions/user-settings";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Shield, Calendar, AlertTriangle, Trash2, CheckCircle, XCircle } from "lucide-react";
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

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export function AccountTab({ user }: AccountTabProps) {
  const router = useRouter();
  const { logout } = useAuthStore();

  const [deleteForm, setDeleteForm]   = useState({ password: "", confirmation: "" });
  const [isDeleting, setIsDeleting]   = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteForm.confirmation !== "DELETE") {
      toast.error('Type "DELETE" to confirm.');
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
        toast.error(result.error || "Failed to deactivate account.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Summary */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            Account Summary
          </CardTitle>
          <CardDescription>Your account details and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Account Status</p>
              <Badge
                variant="outline"
                className={
                  user.status === "ACTIVE"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                }
              >
                {user.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Role</p>
              <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400">
                {user.role}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Email Verified</p>
              <div className="flex items-center gap-1.5 text-sm">
                {user.emailVerified ? (
                  <><CheckCircle className="h-4 w-4 text-emerald-400" /><span className="text-emerald-400">Verified</span></>
                ) : (
                  <><XCircle className="h-4 w-4 text-red-400" /><span className="text-red-400">Not verified</span></>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Onboarding</p>
              <div className="flex items-center gap-1.5 text-sm">
                {user.isApproved ? (
                  <><CheckCircle className="h-4 w-4 text-emerald-400" /><span className="text-emerald-400">Approved</span></>
                ) : (
                  <><XCircle className="h-4 w-4 text-amber-400" /><span className="text-amber-400">Pending approval</span></>
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Member Since
              </p>
              <p className="font-medium">{fmtDate(user.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Last Updated</p>
              <p className="font-medium">{fmtDate(user.updatedAt)}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground mb-0.5">Account ID</p>
              <p className="font-mono text-xs text-muted-foreground break-all">{user.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/20 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions. Proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <h3 className="font-semibold text-red-400 mb-1">Deactivate Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This will deactivate your account and remove your access to all services.
              Your data is retained but you will be logged out immediately.
            </p>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Deactivate Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-border bg-card">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    Deactivate your account?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will immediately revoke your access. Contact support to restore your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="deletePassword">Current Password</Label>
                    <Input
                      id="deletePassword"
                      type="password"
                      placeholder="Enter your current password"
                      value={deleteForm.password}
                      onChange={(e) => setDeleteForm({ ...deleteForm, password: e.target.value })}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="deleteConfirmation">
                      Type <span className="font-mono font-bold">DELETE</span> to confirm
                    </Label>
                    <Input
                      id="deleteConfirmation"
                      placeholder="DELETE"
                      value={deleteForm.confirmation}
                      onChange={(e) => setDeleteForm({ ...deleteForm, confirmation: e.target.value })}
                      className="bg-muted/50 border-border font-mono"
                    />
                  </div>
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => setDeleteForm({ password: "", confirmation: "" })}
                    className="border-border"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={
                      isDeleting ||
                      deleteForm.confirmation !== "DELETE" ||
                      !deleteForm.password
                    }
                    className="bg-red-600 hover:bg-red-700 text-white gap-2"
                  >
                    {isDeleting ? "Deactivating..." : "Deactivate Account"}
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
