"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Upload, X, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadDropzone } from "@/lib/uploadthing";
import { updateStaffAction } from "@/actions/staff";
import { updatePassword } from "@/actions/user-settings";
import type { StaffMember } from "@/actions/staff";

interface AgentSettingsFormProps {
  staff: StaffMember;
}

function PasswordInput({
  id, value, onChange, placeholder, disabled, required,
}: {
  id: string; value: string; onChange: (v: string) => void;
  placeholder?: string; disabled?: boolean; required?: boolean;
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
        className="pr-10"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function AgentSettingsForm({ staff }: AgentSettingsFormProps) {
  const router = useRouter();

  const displayName = `${staff.firstName} ${staff.lastName}`;
  const initials = `${staff.firstName?.[0] || ""}${staff.lastName?.[0] || ""}`.toUpperCase() || "A";

  // Profile state
  const [profileForm, setProfileForm] = useState({
    firstName: staff.firstName || "",
    lastName: staff.lastName || "",
    phone: staff.phone || "",
  });
  const [imageUrl, setImageUrl] = useState(staff.imageUrl || "");
  const [showUpload, setShowUpload] = useState(false);
  const [isSavingProfile, startProfileTransition] = useTransition();

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSavingPassword, startPasswordTransition] = useTransition();

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    startProfileTransition(async () => {
      const res = await updateStaffAction(staff.id, {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
        imageUrl: imageUrl || undefined,
      });
      if (res.success) {
        toast.success("Profile updated.");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update profile.");
      }
    });
  };

  const handleImageUpload = async (res: any) => {
    const url = res?.[0]?.url;
    if (!url) { toast.error("Upload failed — no URL returned."); return; }
    const updateRes = await updateStaffAction(staff.id, { imageUrl: url });
    if (updateRes.success) {
      setImageUrl(url);
      setShowUpload(false);
      toast.success("Photo updated.");
      router.refresh();
    } else {
      toast.error(updateRes.error || "Failed to save photo.");
    }
  };

  const handleRemoveImage = async () => {
    const updateRes = await updateStaffAction(staff.id, { imageUrl: "" });
    if (updateRes.success) {
      setImageUrl("");
      toast.success("Photo removed.");
      router.refresh();
    } else {
      toast.error(updateRes.error || "Failed to remove photo.");
    }
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    startPasswordTransition(async () => {
      const res = await updatePassword(passwordForm);
      if (res.success) {
        toast.success(res.message || "Password changed.");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(res.error || "Failed to change password.");
      }
    });
  };

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList>
        <TabsTrigger value="profile" className="gap-2">
          <User className="h-4 w-4" /> Profile
        </TabsTrigger>
        <TabsTrigger value="security" className="gap-2">
          <Lock className="h-4 w-4" /> Security
        </TabsTrigger>
      </TabsList>

      {/* ── Profile Tab ── */}
      <TabsContent value="profile" className="mt-6 space-y-6">
        {/* Photo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Profile Photo</CardTitle>
            <CardDescription>Update your profile picture</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <Avatar className="h-20 w-20 border-2 border-slate-200 dark:border-[#2B2F77]/30">
                  <AvatarImage src={imageUrl} alt={displayName} />
                  <AvatarFallback className="bg-[#2B2F77] text-white text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                {!showUpload ? (
                  <Button variant="outline" size="sm" onClick={() => setShowUpload(true)} className="gap-2">
                    <Upload className="h-4 w-4" />
                    {imageUrl ? "Change Photo" : "Upload Photo"}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <UploadDropzone
                      endpoint="imageUploader"
                      onClientUploadComplete={handleImageUpload}
                      onUploadError={(err: Error) => { toast.error(`Upload failed: ${err.message}`); }}
                      className="border-2 border-dashed border-slate-200 dark:border-[#2B2F77]/30 rounded-lg"
                    />
                    <Button variant="ghost" size="sm" onClick={() => setShowUpload(false)}>Cancel</Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Personal Information</CardTitle>
            <CardDescription>Update your name and phone number</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    disabled={isSavingProfile}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    disabled={isSavingProfile}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+256700000000"
                  disabled={isSavingProfile}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-400">Email (read-only)</Label>
                <Input value={staff.email} disabled className="text-slate-400" />
              </div>
              <Button type="submit" disabled={isSavingProfile}>
                {isSavingProfile ? "Saving…" : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ── Security Tab ── */}
      <TabsContent value="security" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Change Password</CardTitle>
            <CardDescription>Use a strong password of at least 8 characters</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword">Current Password</Label>
                <PasswordInput
                  id="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={(v) => setPasswordForm({ ...passwordForm, currentPassword: v })}
                  placeholder="Enter current password"
                  disabled={isSavingPassword}
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
                  disabled={isSavingPassword}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <PasswordInput
                  id="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={(v) => setPasswordForm({ ...passwordForm, confirmPassword: v })}
                  placeholder="Repeat new password"
                  disabled={isSavingPassword}
                  required
                />
                {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                  <p className="text-xs text-red-500">Passwords do not match.</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={
                  isSavingPassword ||
                  !passwordForm.currentPassword ||
                  !passwordForm.newPassword ||
                  passwordForm.newPassword !== passwordForm.confirmPassword
                }
              >
                {isSavingPassword ? "Updating…" : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
