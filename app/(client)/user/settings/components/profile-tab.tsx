"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfile, updateProfileImage, UserSettings } from "@/actions/user-settings";
import { toast } from "sonner";
import { Upload, X, User } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";

interface ProfileTabProps {
  user: UserSettings;
}

export function ProfileTab({ user }: ProfileTabProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [imageUrl, setImageUrl] = useState(user.imageUrl || "");
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName:  user.lastName  || "",
    name:      user.name      || "",
  });

  const initials =
    `${formData.firstName?.[0] || ""}${formData.lastName?.[0] || ""}`.toUpperCase() || "U";

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success("Profile updated successfully.");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update profile.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUploadComplete = async (res: any) => {
    const uploadedUrl = res?.[0]?.url;
    if (!uploadedUrl) { toast.error("Failed to get uploaded image URL."); return; }
    try {
      const result = await updateProfileImage({ imageUrl: uploadedUrl });
      if (result.success) {
        setImageUrl(uploadedUrl);
        setShowUploadZone(false);
        toast.success("Profile image updated.");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update image.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleRemoveImage = async () => {
    try {
      const result = await updateProfileImage({ imageUrl: "" });
      if (result.success) {
        setImageUrl("");
        toast.success("Profile image removed.");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to remove image.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Profile Picture
          </CardTitle>
          <CardDescription>Update your profile photo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="h-24 w-24 border-2 border-border">
                <AvatarImage src={imageUrl} alt="Profile" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {imageUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/80 transition-colors"
                  title="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Upload controls */}
            <div className="flex-1 w-full">
              {!showUploadZone ? (
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUploadZone(true)}
                    className="gap-2 border-border"
                  >
                    <Upload className="h-4 w-4" />
                    {imageUrl ? "Change Photo" : "Upload Photo"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Recommended: Square image, at least 400×400px. JPG or PNG.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={handleImageUploadComplete}
                    onUploadError={(error: Error) => { toast.error(`Upload failed: ${error.message}`); }}
                    className="border-2 border-dashed border-border rounded-lg ut-label:text-foreground ut-allowed-content:text-muted-foreground"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUploadZone(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your name and display details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="bg-muted/50 border-border"
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="bg-muted/50 border-border"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. John Doe"
                className="bg-muted/50 border-border"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Used in greetings and receipts. Defaults to first + last name if left blank.
              </p>
            </div>

            {/* Read-only info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <Input
                  value={user.email}
                  disabled
                  className="bg-muted/30 border-border text-muted-foreground text-sm"
                />
                <p className="text-xs text-muted-foreground">Change in the Security tab</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <Input
                  value={user.phone || "Not set"}
                  disabled
                  className="bg-muted/30 border-border text-muted-foreground text-sm"
                />
                <p className="text-xs text-muted-foreground">Change in the Security tab</p>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
