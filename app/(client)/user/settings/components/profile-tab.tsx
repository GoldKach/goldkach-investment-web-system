


// // app/user/settings/components/profile-tab.tsx
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { UserSettings } from "@/actions/user-settings";
// import { useAccessToken } from "@/hooks/useAccessToken";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { Upload, X } from "lucide-react";
// import { UploadDropzone } from "@/lib/uploadthing";
// import axios from "axios";

// const API = process.env.NEXT_PUBLIC_API_URL || "";

// interface ProfileTabProps {
//   user: UserSettings;
// }

// export function ProfileTab({ user }: ProfileTabProps) {
//   const router = useRouter();
//   const { accessToken, hydrated } = useAccessToken();

//   // ✅ ALL hooks must be declared before any conditional returns
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showUploadZone, setShowUploadZone] = useState(false);
//   const [formData, setFormData] = useState({
//     name: user.name || "",
//     firstName: user.firstName || "",
//     lastName: user.lastName || "",
//   });
//   const [imageUrl, setImageUrl] = useState(user.imageUrl || "");

//   // Hydration guard AFTER all hooks
//   if (!hydrated) {
//     return (
//       <div className="space-y-6">
//         {[1, 2].map((i) => (
//           <div key={i} className="h-48 rounded-xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
//         ))}
//       </div>
//     );
//   }

//   function authHeader() {
//     return { Authorization: `Bearer ${accessToken}` };
//   }

//   const handleProfileUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!accessToken) {
//       toast.error("Not authenticated. Please log in again.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await axios.patch(`${API}/users/settings/profile`, formData, {
//         headers: authHeader(),
//       });
//       toast.success("Profile updated successfully!");
//       router.refresh();
//     } catch (e: any) {
//       toast.error(e?.response?.data?.error || "Failed to update profile.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleImageUploadComplete = async (res: any) => {
//     const uploadedUrl = res?.[0]?.url;
//     if (!uploadedUrl) {
//       toast.error("Failed to get uploaded image URL.");
//       return;
//     }

//     if (!accessToken) {
//       toast.error("Not authenticated. Please log in again.");
//       return;
//     }

//     try {
//       await axios.patch(
//         `${API}/users/settings/image`,
//         { imageUrl: uploadedUrl },
//         { headers: authHeader() }
//       );
//       setImageUrl(uploadedUrl);
//       setShowUploadZone(false);
//       toast.success("Profile image updated successfully!");
//       router.refresh();
//     } catch (e: any) {
//       toast.error(e?.response?.data?.error || "Failed to update image.");
//     }
//   };

//   const handleRemoveImage = async () => {
//     if (!accessToken) {
//       toast.error("Not authenticated. Please log in again.");
//       return;
//     }

//     try {
//       await axios.patch(
//         `${API}/users/settings/image`,
//         { imageUrl: "" },
//         { headers: authHeader() }
//       );
//       setImageUrl("");
//       toast.success("Profile image removed.");
//       router.refresh();
//     } catch (e: any) {
//       toast.error(e?.response?.data?.error || "Failed to remove image.");
//     }
//   };

//   const initials =
//     `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";

//   return (
//     <div className="space-y-6">
//       {/* Profile Picture */}
//       <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
//         <CardHeader>
//           <CardTitle className="text-slate-900 dark:text-white">Profile Picture</CardTitle>
//           <CardDescription className="text-slate-600 dark:text-slate-400">
//             Upload or update your profile image
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex flex-col items-center gap-6">
//             {/* Avatar Preview */}
//             <div className="relative">
//               <Avatar className="h-32 w-32 border-4 border-slate-200 dark:border-slate-700">
//                 <AvatarImage src={imageUrl} alt={user.name} />
//                 <AvatarFallback className="bg-blue-600 text-white text-3xl">
//                   {initials}
//                 </AvatarFallback>
//               </Avatar>
//               {imageUrl && (
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   size="icon"
//                   className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
//                   onClick={handleRemoveImage}
//                   title="Remove image"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               )}
//             </div>

//             {/* Upload Controls */}
//             <div className="w-full max-w-md">
//               {!showUploadZone ? (
//                 <Button
//                   type="button"
//                   onClick={() => setShowUploadZone(true)}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//                 >
//                   <Upload className="h-4 w-4 mr-2" />
//                   {imageUrl ? "Change Profile Picture" : "Upload Profile Picture"}
//                 </Button>
//               ) : (
//                 <div className="space-y-3">
//                   <UploadDropzone
//                     endpoint="imageUploader"
//                     onClientUploadComplete={handleImageUploadComplete}
//                     onUploadError={(error: Error) => {
//                       toast.error(`Upload failed: ${error.message}`);
//                     }}
//                     className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg"
//                   />
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => setShowUploadZone(false)}
//                     className="w-full"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               )}
//               <p className="text-slate-500 dark:text-slate-400 text-xs text-center mt-3">
//                 Recommended: Square image, at least 400×400px
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Personal Information */}
//       <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
//         <CardHeader>
//           <CardTitle className="text-slate-900 dark:text-white">Personal Information</CardTitle>
//           <CardDescription className="text-slate-600 dark:text-slate-400">
//             Update your personal details
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleProfileUpdate} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="firstName" className="text-slate-900 dark:text-white">
//                   First Name
//                 </Label>
//                 <Input
//                   id="firstName"
//                   value={formData.firstName}
//                   onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                   className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
//                   disabled={isSubmitting}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="lastName" className="text-slate-900 dark:text-white">
//                   Last Name
//                 </Label>
//                 <Input
//                   id="lastName"
//                   value={formData.lastName}
//                   onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
//                   className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
//                   disabled={isSubmitting}
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="name" className="text-slate-900 dark:text-white">
//                 Full Name
//               </Label>
//               <Input
//                 id="name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
//                 disabled={isSubmitting}
//                 required
//               />
//             </div>

//             {/* Read-only fields */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
//               <div>
//                 <Label className="text-slate-500 dark:text-slate-500 text-xs">
//                   Email (change in Security tab)
//                 </Label>
//                 <Input
//                   value={user.email}
//                   disabled
//                   className="bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-500 mt-2"
//                 />
//               </div>
//               <div>
//                 <Label className="text-slate-500 dark:text-slate-500 text-xs">
//                   Phone (change in Security tab)
//                 </Label>
//                 <Input
//                   value={user.phone || "—"}
//                   disabled
//                   className="bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-500 mt-2"
//                 />
//               </div>
//             </div>

//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               {isSubmitting ? "Saving..." : "Save Changes"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }





// app/user/settings/components/profile-tab.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfile, updateProfileImage, UserSettings } from "@/actions/user-settings";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";

interface ProfileTabProps {
  user: UserSettings;
}

export function ProfileTab({ user }: ProfileTabProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  });
  const [imageUrl, setImageUrl] = useState(user.imageUrl || "");

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success("Profile updated successfully!");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch {
      toast.error("An unexpected error occurred");
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
        toast.success("Profile image updated successfully!");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update image");
      }
    } catch {
      toast.error("An unexpected error occurred");
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
        toast.error(result.error || "Failed to remove image");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Profile Picture</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Upload or update your profile image
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-slate-200 dark:border-slate-700">
                <AvatarImage src={imageUrl} alt={user.name} />
                <AvatarFallback className="bg-blue-600 text-white text-3xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {imageUrl && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="w-full max-w-md">
              {!showUploadZone ? (
                <Button
                  type="button"
                  onClick={() => setShowUploadZone(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {imageUrl ? "Change Profile Picture" : "Upload Profile Picture"}
                </Button>
              ) : (
                <div className="space-y-3">
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={handleImageUploadComplete}
                    // onUploadError={(error: Error) => toast.error(`Upload failed: ${error.message}`)}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg"
                  />
                  <Button type="button" variant="outline" onClick={() => setShowUploadZone(false)} className="w-full">
                    Cancel
                  </Button>
                </div>
              )}
              <p className="text-slate-500 dark:text-slate-400 text-xs text-center mt-3">
                Recommended: Square image, at least 400×400px
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Personal Information</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Update your personal details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-slate-900 dark:text-white">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-slate-900 dark:text-white">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="name" className="text-slate-900 dark:text-white">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white mt-2"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div>
                <Label className="text-slate-500 dark:text-slate-500 text-xs">Email (change in Security tab)</Label>
                <Input value={user.email} disabled className="bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 mt-2" />
              </div>
              <div>
                <Label className="text-slate-500 dark:text-slate-500 text-xs">Phone (change in Security tab)</Label>
                <Input value={user.phone || "—"} disabled className="bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 mt-2" />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}