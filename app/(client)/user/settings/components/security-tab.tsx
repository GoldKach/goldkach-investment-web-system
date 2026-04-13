"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updatePassword, UserSettings } from "@/actions/user-settings";
import { toast } from "sonner";
import { Lock, Eye, EyeOff } from "lucide-react";

interface SecurityTabProps {
  user: UserSettings;
}

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  minLength,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        minLength={minLength}
        className="bg-muted/50 border-border pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function SecurityTab({ user }: SecurityTabProps) {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const result = await updatePassword(passwordForm);
      if (result.success) {
        toast.success(result.message || "Password updated successfully.");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(result.error || "Failed to update password.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Password */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            Change Password
          </CardTitle>
          <CardDescription>Use a strong password of at least 8 characters.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
              <PasswordInput
                id="currentPassword"
                value={passwordForm.currentPassword}
                onChange={(v) => setPasswordForm({ ...passwordForm, currentPassword: v })}
                placeholder="Enter your current password"
                disabled={isUpdatingPassword}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <PasswordInput
                id="newPassword"
                value={passwordForm.newPassword}
                onChange={(v) => setPasswordForm({ ...passwordForm, newPassword: v })}
                placeholder="At least 8 characters"
                disabled={isUpdatingPassword}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <PasswordInput
                id="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={(v) => setPasswordForm({ ...passwordForm, confirmPassword: v })}
                placeholder="Repeat new password"
                disabled={isUpdatingPassword}
                required
                minLength={8}
              />
              {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                <p className="text-xs text-red-400">Passwords do not match.</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={
                isUpdatingPassword ||
                !passwordForm.currentPassword ||
                !passwordForm.newPassword ||
                passwordForm.newPassword !== passwordForm.confirmPassword
              }
              className="gap-2"
            >
              {isUpdatingPassword ? "Updating..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
