"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateEmail, updatePhone, updatePassword, UserSettings } from "@/actions/user-settings";
import { toast } from "sonner";
import { Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";

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
  const router = useRouter();

  /* ---- email form ---- */
  const [emailForm, setEmailForm] = useState({ email: user.email, password: "" });
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  /* ---- phone form ---- */
  const [phoneForm, setPhoneForm] = useState({ phone: user.phone || "", password: "" });
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);

  /* ---- password form ---- */
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  /* ---- handlers ---- */
  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingEmail(true);
    try {
      const result = await updateEmail(emailForm);
      if (result.success) {
        toast.success(result.message || "Email updated successfully.");
        setEmailForm({ ...emailForm, password: "" });
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update email.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
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
        toast.success("Phone number updated successfully.");
        setPhoneForm({ ...phoneForm, password: "" });
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update phone number.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsUpdatingPhone(false);
    }
  };

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

      {/* Email */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Email Address
          </CardTitle>
          <CardDescription>
            Current: <span className="text-foreground font-medium">{user.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">New Email Address</Label>
              <Input
                id="email"
                type="email"
                value={emailForm.email}
                onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                className="bg-muted/50 border-border"
                disabled={isUpdatingEmail}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emailPassword">Confirm Current Password</Label>
              <PasswordInput
                id="emailPassword"
                value={emailForm.password}
                onChange={(v) => setEmailForm({ ...emailForm, password: v })}
                placeholder="Enter your current password"
                disabled={isUpdatingEmail}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isUpdatingEmail || emailForm.email === user.email || !emailForm.password}
              className="gap-2"
            >
              {isUpdatingEmail ? "Updating..." : "Update Email"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Phone */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            Phone Number
          </CardTitle>
          <CardDescription>
            {user.phone
              ? <>Current: <span className="text-foreground font-medium">{user.phone}</span></>
              : "No phone number set. Use international format (e.g. +256700000000)."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePhoneUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+256700000000"
                value={phoneForm.phone}
                onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                className="bg-muted/50 border-border"
                disabled={isUpdatingPhone}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phonePassword">Confirm Current Password</Label>
              <PasswordInput
                id="phonePassword"
                value={phoneForm.password}
                onChange={(v) => setPhoneForm({ ...phoneForm, password: v })}
                placeholder="Enter your current password"
                disabled={isUpdatingPhone}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isUpdatingPhone || phoneForm.phone === user.phone || !phoneForm.password}
              className="gap-2"
            >
              {isUpdatingPhone ? "Updating..." : "Update Phone"}
            </Button>
          </form>
        </CardContent>
      </Card>

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
