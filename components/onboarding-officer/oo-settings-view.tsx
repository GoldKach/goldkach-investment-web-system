"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Loader2, ShieldCheck, Camera, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UploadDropzone } from "@/lib/uploadthing";
import { updateStaffAction } from "@/actions/staff";
import { updatePassword } from "@/actions/user-settings";

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
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
        className="pr-10"
        autoComplete="new-password"
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setShow((v) => !v)}
        tabIndex={-1}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function OOSettingsView({ user }: { user: any }) {
  const router = useRouter();

  /* ── photo state ── */
  const [imageUrl, setImageUrl] = useState<string>(user?.imageUrl || "");
  const [showUpload, setShowUpload] = useState(false);

  /* ── password state ── */
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.name || "Onboarding Officer";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  /* ── photo handlers ── */
  const handleImageUpload = async (res: any) => {
    const url = res?.[0]?.ufsUrl ?? res?.[0]?.url;
    if (!url) { toast.error("Upload failed — no URL returned."); return; }
    const updateRes = await updateStaffAction(user.id, { imageUrl: url });
    if (updateRes.success) {
      setImageUrl(url);
      setShowUpload(false);
      toast.success("Profile photo updated.");
      router.refresh();
    } else {
      toast.error(updateRes.error ?? "Failed to save photo.");
    }
  };

  const handleRemovePhoto = async () => {
    const updateRes = await updateStaffAction(user.id, { imageUrl: "" });
    if (updateRes.success) {
      setImageUrl("");
      toast.success("Profile photo removed.");
      router.refresh();
    } else {
      toast.error(updateRes.error ?? "Failed to remove photo.");
    }
  };

  /* ── password validation ── */
  function validate() {
    const e: Record<string, string> = {};
    if (!current) e.current = "Current password is required.";
    if (!newPw) e.newPw = "New password is required.";
    else if (newPw.length < 8) e.newPw = "Password must be at least 8 characters.";
    if (!confirm) e.confirm = "Please confirm your new password.";
    else if (newPw !== confirm) e.confirm = "Passwords do not match.";
    if (newPw && current && newPw === current) e.newPw = "New password must differ from current password.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await updatePassword({
        currentPassword: current,
        newPassword: newPw,
        confirmPassword: confirm,
      });
      if (!res.success) {
        toast.error(res.error ?? "Failed to update password.");
        return;
      }
      toast.success("Password updated successfully.");
      setCurrent(""); setNewPw(""); setConfirm("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile card with photo upload */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Profile Photo</CardTitle>
          <CardDescription>Update your profile picture.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <div className="flex items-start gap-5">
            {/* Avatar with camera overlay */}
            <div className="relative shrink-0">
              <Avatar className="h-20 w-20 rounded-xl border-2 border-[#193388]/20">
                <AvatarImage src={imageUrl} alt={displayName} className="object-cover rounded-xl" />
                <AvatarFallback className="rounded-xl bg-[#193388] text-white text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {imageUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors shadow"
                  title="Remove photo"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Info + upload toggle */}
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white truncate">{displayName}</p>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                <p className="text-xs text-[#193388] dark:text-blue-400 font-medium mt-0.5">Onboarding Officer</p>
              </div>

              {!showUpload ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUpload(true)}
                  className="gap-2 h-8 text-xs"
                >
                  <Camera className="h-3.5 w-3.5" />
                  {imageUrl ? "Change Photo" : "Upload Photo"}
                </Button>
              ) : (
                <div className="space-y-2">
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={handleImageUpload}
                    onUploadError={(err) => { toast.error(`Upload failed: ${err.message}`); }}
                    appearance={{
                      container: "border border-dashed border-[#193388]/30 rounded-lg bg-slate-50 dark:bg-[#193388]/5 p-3 ut-uploading:cursor-not-allowed",
                      label: "text-xs text-slate-500",
                      allowedContent: "text-xs text-slate-400",
                      button: "bg-[#193388] text-white text-xs h-7 px-3 rounded after:bg-[#142a80] ut-readying:bg-[#193388]/70",
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUpload(false)}
                    className="gap-1.5 h-7 text-xs text-muted-foreground"
                  >
                    <X className="h-3 w-3" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4 text-[#193388]" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password. You will need to enter your current password to confirm.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current">Current Password</Label>
              <PasswordInput
                id="current"
                value={current}
                onChange={setCurrent}
                placeholder="Enter your current password"
              />
              {errors.current && <p className="text-xs text-destructive">{errors.current}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="newPw">New Password</Label>
              <PasswordInput
                id="newPw"
                value={newPw}
                onChange={setNewPw}
                placeholder="At least 8 characters"
              />
              {errors.newPw && <p className="text-xs text-destructive">{errors.newPw}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirm New Password</Label>
              <PasswordInput
                id="confirm"
                value={confirm}
                onChange={setConfirm}
                placeholder="Re-enter new password"
              />
              {errors.confirm && <p className="text-xs text-destructive">{errors.confirm}</p>}
            </div>

            {/* Strength indicator */}
            {newPw && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[8, 12, 16].map((min, i) => (
                    <div
                      key={min}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        newPw.length >= min
                          ? i === 0 ? "bg-red-400" : i === 1 ? "bg-amber-400" : "bg-emerald-500"
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {newPw.length < 8 ? "Too short" : newPw.length < 12 ? "Weak" : newPw.length < 16 ? "Good" : "Strong"}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2 bg-[#193388] hover:bg-[#142a80] text-white mt-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {loading ? "Updating…" : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
