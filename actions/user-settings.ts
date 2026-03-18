
// // actions/user-settings.ts
// "use server";

// import axios from "axios";
// import { revalidatePath } from "next/cache";
// import { getSession } from "@/actions/auth";

// const BASE_API_URL = process.env.API_URL || "http://localhost:8000/api/v1";

// const api = axios.create({
//   baseURL: BASE_API_URL,
//   timeout: 12000,
//   headers: { "Content-Type": "application/json" },
// });

// function msg(e: any, fallback = "Request failed") {
//   return e?.response?.data?.error || e?.message || fallback;
// }

// // TEMPORARY: gets userId from session instead of token
// // When auth middleware is re-enabled, revert to token-based auth
// async function getUserId(): Promise<string | null> {
//   const session = await getSession();
//   const userId = session?.user?.id ?? null;
//   if (!userId) console.error("No userId found in session.");
//   return userId;
// }

// /* Types */

// export interface UserSettings {
//   id: string;
//   name: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   emailVerified: boolean;
//   phone: string;
//   imageUrl: string;
//   role: string;
//   status: string;
//   isApproved: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface UpdateProfileInput {
//   name?: string;
//   firstName?: string;
//   lastName?: string;
// }

// export interface UpdateEmailInput {
//   email: string;
//   password: string;
// }

// export interface UpdatePhoneInput {
//   phone: string;
//   password: string;
// }

// export interface UpdatePasswordInput {
//   currentPassword: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// export interface UpdateImageInput {
//   imageUrl: string;
// }

// export interface DeleteAccountInput {
//   password: string;
//   confirmation: string;
// }

// /* Actions */

// export async function getUserSettings() {
//   const userId = await getUserId();
//   if (!userId) return { success: false, error: "Not authenticated" };
//   try {
//     const res = await api.get("/users/settings", { params: { userId } });
//     return { success: true, data: res.data?.data as UserSettings };
//   } catch (e: any) {
//     console.error("getUserSettings error:", e?.response?.data || e?.message);
//     return { success: false, error: msg(e, "Failed to load user settings") };
//   }
// }

// export async function updateProfile(input: UpdateProfileInput) {
//   const userId = await getUserId();
//   if (!userId) return { success: false, error: "Not authenticated" };
//   try {
//     const res = await api.patch("/users/settings/profile", { ...input, userId });
//     revalidatePath("/user/settings");
//     revalidatePath("/user/dashboard");
//     return { success: true, data: res.data?.data };
//   } catch (e: any) {
//     console.error("updateProfile error:", e?.response?.data || e?.message);
//     return { success: false, error: msg(e, "Failed to update profile") };
//   }
// }

// export async function updateEmail(input: UpdateEmailInput) {
//   const userId = await getUserId();
//   if (!userId) return { success: false, error: "Not authenticated" };
//   try {
//     const res = await api.patch("/users/settings/email", { ...input, userId });
//     revalidatePath("/user/settings");
//     return { success: true, data: res.data?.data, message: res.data?.message };
//   } catch (e: any) {
//     console.error("updateEmail error:", e?.response?.data || e?.message);
//     return { success: false, error: msg(e, "Failed to update email") };
//   }
// }

// export async function updatePhone(input: UpdatePhoneInput) {
//   const userId = await getUserId();
//   if (!userId) return { success: false, error: "Not authenticated" };
//   try {
//     const res = await api.patch("/users/settings/phone", { ...input, userId });
//     revalidatePath("/user/settings");
//     return { success: true, data: res.data?.data };
//   } catch (e: any) {
//     console.error("updatePhone error:", e?.response?.data || e?.message);
//     return { success: false, error: msg(e, "Failed to update phone number") };
//   }
// }

// export async function updatePassword(input: UpdatePasswordInput) {
//   const userId = await getUserId();
//   if (!userId) return { success: false, error: "Not authenticated" };
//   try {
//     const res = await api.patch("/users/settings/password", { ...input, userId });
//     return { success: true, message: res.data?.message || "Password updated successfully" };
//   } catch (e: any) {
//     console.error("updatePassword error:", e?.response?.data || e?.message);
//     return { success: false, error: msg(e, "Failed to update password") };
//   }
// }

// export async function updateProfileImage(input: UpdateImageInput) {
//   const userId = await getUserId();
//   if (!userId) return { success: false, error: "Not authenticated" };
//   try {
//     const res = await api.patch("/users/settings/image", { ...input, userId });
//     revalidatePath("/user/settings");
//     revalidatePath("/user/dashboard");
//     return { success: true, data: res.data?.data };
//   } catch (e: any) {
//     console.error("updateProfileImage error:", e?.response?.data || e?.message);
//     return { success: false, error: msg(e, "Failed to update profile image") };
//   }
// }

// export async function deleteAccount(input: DeleteAccountInput) {
//   const userId = await getUserId();
//   if (!userId) return { success: false, error: "Not authenticated" };
//   try {
//     const res = await api.request({
//       method: "DELETE",
//       url: "/users/settings/account",
//       data: { ...input, userId },
//     });
//     return { success: true, message: res.data?.message || "Account deactivated successfully" };
//   } catch (e: any) {
//     console.error("deleteAccount error:", e?.response?.data || e?.message);
//     return { success: false, error: msg(e, "Failed to delete account") };
//   }
// }

// actions/user-settings.ts
"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { getSession } from "@/actions/auth";

const BASE_API_URL = process.env.API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 12000,
  headers: { "Content-Type": "application/json" },
});

function msg(e: any, fallback = "Request failed") {
  return e?.response?.data?.error || e?.message || fallback;
}

async function getUserId(): Promise<string | null> {
  const session = await getSession();
  const userId = session?.user?.id ?? null;
  if (!userId) console.error("No userId found in session.");
  return userId;
}

/* -------------------------------------------------------------------------- */
/*  Types                                                                       */
/* -------------------------------------------------------------------------- */

export interface PortfolioWalletSummary {
  id:             string;
  accountNumber:  string;
  balance:        number;
  netAssetValue:  number;
  totalFees:      number;
  status:         string;
  userPortfolio?: {
    id:          string;
    customName:  string;
    portfolioId: string;
    portfolio?:  { id: string; name: string };
  };
}

export interface MasterWalletSummary {
  id:             string;
  accountNumber:  string;
  totalDeposited: number;
  totalWithdrawn: number;
  totalFees:      number;
  netAssetValue:  number;
  status:         string;
}

export interface UserPortfolioSummary {
  id:             string;
  customName:     string;
  portfolioId:    string;
  portfolioValue: number;
  totalInvested:  number;
  totalLossGain:  number;
  isActive:       boolean;
  wallet?:        PortfolioWalletSummary;
  portfolio?:     { id: string; name: string };
}

export interface UserSettings {
  id:             string;
  name?:          string;
  firstName:      string;
  lastName:       string;
  email:          string;
  emailVerified:  boolean;
  phone:          string;
  imageUrl:       string;
  role:           string;
  status:         string;
  isApproved:     boolean;
  createdAt:      string;
  updatedAt:      string;
  // New wallet structure
  masterWallet?:  MasterWalletSummary;
  userPortfolios?: UserPortfolioSummary[];
}

export interface UpdateProfileInput {
  name?:      string;
  firstName?: string;
  lastName?:  string;
}

export interface UpdateEmailInput {
  email:    string;
  password: string;
}

export interface UpdatePhoneInput {
  phone:    string;
  password: string;
}

export interface UpdatePasswordInput {
  currentPassword: string;
  newPassword:     string;
  confirmPassword: string;
}

export interface UpdateImageInput {
  imageUrl: string;
}

export interface DeleteAccountInput {
  password:     string;
  confirmation: string;
}

/* -------------------------------------------------------------------------- */
/*  Actions                                                                     */
/* -------------------------------------------------------------------------- */

export async function getUserSettings() {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "Not authenticated" };
  try {
    const res = await api.get("/users/settings", { params: { userId } });
    return { success: true, data: res.data?.data as UserSettings };
  } catch (e: any) {
    console.error("getUserSettings error:", e?.response?.data || e?.message);
    return { success: false, error: msg(e, "Failed to load user settings") };
  }
}

export async function updateProfile(input: UpdateProfileInput) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "Not authenticated" };
  try {
    const res = await api.patch("/users/settings/profile", { ...input, userId });
    revalidatePath("/user/settings");
    revalidatePath("/user/dashboard");
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    console.error("updateProfile error:", e?.response?.data || e?.message);
    return { success: false, error: msg(e, "Failed to update profile") };
  }
}

export async function updateEmail(input: UpdateEmailInput) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "Not authenticated" };
  try {
    const res = await api.patch("/users/settings/email", { ...input, userId });
    revalidatePath("/user/settings");
    return { success: true, data: res.data?.data, message: res.data?.message };
  } catch (e: any) {
    console.error("updateEmail error:", e?.response?.data || e?.message);
    return { success: false, error: msg(e, "Failed to update email") };
  }
}

export async function updatePhone(input: UpdatePhoneInput) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "Not authenticated" };
  try {
    const res = await api.patch("/users/settings/phone", { ...input, userId });
    revalidatePath("/user/settings");
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    console.error("updatePhone error:", e?.response?.data || e?.message);
    return { success: false, error: msg(e, "Failed to update phone number") };
  }
}

export async function updatePassword(input: UpdatePasswordInput) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "Not authenticated" };
  try {
    const res = await api.patch("/users/settings/password", { ...input, userId });
    return { success: true, message: res.data?.message || "Password updated successfully" };
  } catch (e: any) {
    console.error("updatePassword error:", e?.response?.data || e?.message);
    return { success: false, error: msg(e, "Failed to update password") };
  }
}

export async function updateProfileImage(input: UpdateImageInput) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "Not authenticated" };
  try {
    const res = await api.patch("/users/settings/image", { ...input, userId });
    revalidatePath("/user/settings");
    revalidatePath("/user/dashboard");
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    console.error("updateProfileImage error:", e?.response?.data || e?.message);
    return { success: false, error: msg(e, "Failed to update profile image") };
  }
}

export async function deleteAccount(input: DeleteAccountInput) {
  const userId = await getUserId();
  if (!userId) return { success: false, error: "Not authenticated" };
  try {
    const res = await api.request({
      method: "DELETE",
      url:    "/users/settings/account",
      data:   { ...input, userId },
    });
    return { success: true, message: res.data?.message || "Account deactivated successfully" };
  } catch (e: any) {
    console.error("deleteAccount error:", e?.response?.data || e?.message);
    return { success: false, error: msg(e, "Failed to delete account") };
  }
}