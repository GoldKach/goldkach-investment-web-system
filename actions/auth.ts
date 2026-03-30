


// app/actions/auth.ts
"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/** ========= Axios ========= **/
const BASE_API_URL = process.env.API_URL || "";
const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/** ========= Types ========= **/
interface BackendUser {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  imageUrl?: string;
  status?: string;
}

interface LoginSuccessPayload {
  user: BackendUser;
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  success: boolean;
  data?: LoginSuccessPayload;
  error?: string;
}

interface InitiateLoginResponse {
  success: boolean;
  data?: {
    userId: string;
    email: string;
    requiresVerification: boolean;
    expiresAt: string;
  };
  error?: string;
}

/** ========= Cookie Helpers ========= **/
const setCookies = async (
  accessToken: string,
  refreshToken: string,
  userData: BackendUser
) => {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  // keep userData server-only as well
  cookieStore.set("userData", JSON.stringify(userData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

const clearCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("userData");
};

export async function clearOnboardingSession() {
  await clearCookies();
}

/** ========= 2FA LOGIN FLOW ========= **/

/**
 * STEP 1: Initiate Login - Send verification code
 */
export async function initiateLogin(data: {
  identifier: string; // email OR phone
  password: string;
}): Promise<InitiateLoginResponse> {
  try {
    const res = await api.post("/auth/login", data);
    
    if (!res.data.success) {
      return {
        success: false,
        error: res.data.error || res.data.message || "Login failed",
      };
    }

    return {
      success: true,
      data: {
        userId: res.data.data.userId,
        email: res.data.data.email,
        requiresVerification: res.data.data.requiresVerification,
        expiresAt: res.data.data.expiresAt,
      },
    };
  } catch (error: any) {
    console.error("Initiate login error:", error?.response?.data || error);
    return {
      success: false,
      error: error?.response?.data?.error || "Login failed. Please try again.",
    };
  }
}

/**
 * STEP 2: Verify Login Code - Complete login and get tokens
 */
export async function verifyLoginCode(data: {
  userId: string;
  code: string;
}): Promise<LoginResponse> {
  try {
    const res = await api.post("/auth/login/verify", data);
    
    if (!res.data.success) {
      return {
        success: false,
        error: res.data.error || res.data.message || "Verification failed",
      };
    }

    const { user, accessToken, refreshToken } = res.data.data as LoginSuccessPayload;
    await setCookies(accessToken, refreshToken, user);
    
    return { 
      success: true, 
      data: { user, accessToken, refreshToken } 
    };
  } catch (error: any) {
    console.error("Verify login code error:", error?.response?.data || error);
    return {
      success: false,
      error: error?.response?.data?.error || "Verification failed. Please try again.",
    };
  }
}

/**
 * Resend Login Verification Code
 */
export async function resendLoginCode(data: {
  userId: string;
}): Promise<{ success: boolean; data?: { expiresAt: string }; error?: string }> {
  try {
    const res = await api.post("/auth/login/resend-code", data);
    
    if (!res.data.success) {
      return {
        success: false,
        error: res.data.error || res.data.message || "Failed to resend code",
      };
    }

    return {
      success: true,
      data: {
        expiresAt: res.data.data.expiresAt,
      },
    };
  } catch (error: any) {
    console.error("Resend login code error:", error?.response?.data || error);
    return {
      success: false,
      error: error?.response?.data?.error || "Failed to resend code. Please try again.",
    };
  }
}

/** ========= OLD LOGIN (Deprecated - use initiateLogin instead) ========= **/
export async function loginUser(data: {
  identifier: string;
  password: string;
}): Promise<InitiateLoginResponse> {
  // Redirect to 2FA flow
  return initiateLogin(data);
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (accessToken) {
      await api.post(
        "/logout",
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    }

    await clearCookies();
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    await clearCookies();
    return { success: false, error: "Logout failed, but session was cleared" };
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const userData = cookieStore.get("userData");
  if (!accessToken || !userData?.value) return null;

  try {
    return { user: JSON.parse(userData.value), accessToken: accessToken.value };
  } catch (e) {
    console.error("Session parse error:", e);
    return null;
  }
}

export async function refreshAccessToken() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) throw new Error("No refresh token found");

    const res = await api.post("/refresh-token", { refreshToken });
    const { accessToken: newAccessToken } = res.data;

    cookieStore.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, accessToken: newAccessToken };
  } catch (error) {
    console.error("Token refresh error:", error);
    await clearCookies();
    redirect("/login");
  }
}


export async function forgotPassword(email: string) {
  try {
    // Your backend returns 200 with a generic message (recommended)
    await api.post("/auth/forgot-password", { email });
    return { success: true };
  } catch (error) {
    // still return success to avoid user enumeration from UI
    console.error("forgotPassword error:", (error as any)?.response?.data || error);
    return { success: true };
  }
}

export async function resetPassword(args: {
  uid: string;
  token: string;
  newPassword: string;
}) {
  const { uid, token, newPassword } = args;
  try {
    const res = await api.post("/auth/reset-password", { uid, token, newPassword });
    return { success: res.status === 200 };
  } catch (error: any) {
    const msg = error?.response?.data?.error || "Reset failed. Link may be invalid or expired.";
    return { success: false, error: msg };
  }
}


async function getAuthHeaderFromCookies() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

export async function getAllUsers() {
  try {
    const headers = await getAuthHeaderFromCookies();
    const res = await api.get("/users", { headers });
    return res.data;
  } catch (error: any) {
    console.error("getAllUsers error:", error);
    return { data: [], error: error?.response?.data?.error || error?.message || "Failed to fetch users" };
  }
}

// export async function createUser(data: any) {
//   try {
//     const res = await api.post("/register", data);
//     revalidatePath("/dashboard/users");
//     return res.data;
//   } catch (error: any) {
//     if (axios.isAxiosError(error)) {
//       const message = error.response?.data?.message || "Failed to create user";
//       throw new Error(message);
//     }
//     throw error;
//   }
// }


export async function createUser(data: {
  firstName: string;
  lastName?: string;
  email: string;
  entityType?: "individual" | "company" | null; // ← ADD THIS
  phone: string;
  password: string;
  recaptchaToken?: string; // ✅ NEW
  website?: string; // ✅ NEW: Honeypot
}) {
  try {
    const res = await api.post("/register", {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      recaptchaToken: data.recaptchaToken, // ✅ NEW: Send to backend
      website: data.website, // ✅ NEW: Send honeypot to backend
    });

    revalidatePath("/dashboard/users");
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const response = error.response;
      
      // ✅ NEW: Rate limiting error
      if (response?.status === 429) {
        const message = response.data?.message || "Too many registration attempts. Please try again later.";
        throw new Error(message);
      }
      
      // ✅ NEW: reCAPTCHA verification error
      if (response?.status === 400 && response.data?.errors?.recaptcha) {
        throw new Error(response.data.errors.recaptcha);
      }
      
      // General error with message from backend
      const message = response?.data?.message || "Failed to create user";
      throw new Error(message);
    }
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    let headers = await getAuthHeaderFromCookies();
    if (!headers.Authorization) throw new Error("Unauthorized: No access token found");

    try {
      await api.delete(`/users/${userId}`, { headers });
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        // Token expired — refresh and retry once
        await refreshAccessToken();
        headers = await getAuthHeaderFromCookies();
        await api.delete(`/users/${userId}`, { headers });
      } else {
        throw err;
      }
    }

    revalidatePath("/dashboard/users");
    return { success: true, message: "User deleted successfully" };
  } catch (error: any) {
    console.error("Delete user error:", error);
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;
      const message = data?.message || data?.error || "Failed to delete user";
      throw new Error(message);
    }
    throw error;
  }
}

export async function fetchMe() {
  try {
    const headers = await getAuthHeaderFromCookies();
    const res = await api.get("/me", { headers });
    return res.data;
  } catch (error) {
    console.error("fetchMe error:", error);
    return null;
  }
}

export async function getUserById(userId: string) {
  if (!userId) throw new Error("User ID is required");

  try {
    const res = await api.get(`/users/${encodeURIComponent(userId)}`);
    return res.data; // { data, error } per your controller
  } catch (err: any) {
    console.error("getUserById error:", err?.response?.data || err);
    // Surface a cleaner message while preserving throw behavior like your other actions
    throw new Error(err?.response?.data?.error || "Failed to fetch user");
  }
}

export async function verifyEmailAction(args: { email: string; token: string }) {
  try {
    const payload = {
      email: args.email.trim(),
      token: String(args.token).trim(),
    };

    const { data } = await api.post("/auth/verify-email", payload);

    // Store tokens so the user can submit onboarding immediately
    if (data.accessToken && data.refreshToken) {
      const cookieStore = await cookies();
      cookieStore.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
      cookieStore.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });
      cookieStore.set("userData", JSON.stringify({
        id: data.userId,
        email: data.email,
        role: "USER",
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return {
      success: true,
      userId: data.userId as string,
      email: data.email as string,
    };
  } catch (e: any) {
    return {
      success: false,
      error: e?.response?.data?.error || "Verification failed",
    };
  }
}

export async function resendVerificationAction(email: string) {
  try {
    console.log("[resendVerificationAction] Resending code to:", email);
    await api.post("/auth/resend-verification", { email });
    console.log("[resendVerificationAction] Success");
    return { success: true };
  } catch (error) {
    console.error("[resendVerificationAction] Error:", error);
    return { success: true }; // Don't leak user existence
  }
}

export type UserStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING"
  | "SUSPENDED"
  | "DEACTIVATED"
  | "BANNED";

export type UpdateUserPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: UserStatus;     // ← enum value
  imageUrl?: string;
  emailVerified?: boolean; // ← persisted by your controller
  isApproved?: boolean;    // ← persisted by your controller
  password?: string;       // optional
};

function pruneUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

export async function updateUserById(userId: string, updates: UpdateUserPayload) {
  if (!userId) throw new Error("User ID is required");

  try {
    const body = pruneUndefined(updates);
    const res = await api.put(`/users/${encodeURIComponent(userId)}`, body);

    // keep UI in sync (adjust paths to your routes)
    revalidatePath(`/dashboard/users/${userId}`);
    revalidatePath(`/dashboard/users`);

    return res.data; // { data, error }
  } catch (err: any) {
    console.error("updateUserById error:", err?.response?.data || err);
    throw new Error(err?.response?.data?.error || "Failed to update user");
  }
}