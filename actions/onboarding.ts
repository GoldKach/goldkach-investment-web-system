// "use server";

// import axios from "axios";
// import { cookies } from "next/headers";

// const BASE_API_URL = process.env.API_URL || "";
// const api = axios.create({
//   baseURL: BASE_API_URL,
//   timeout: 12000,
//   headers: { "Content-Type": "application/json" },
// });

// async function authHeaderFromCookies() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("accessToken")?.value;
//   return token ? { Authorization: `Bearer ${token}` } : {};
// }

// // Submit onboarding
// export async function submitOnboarding(form: any) {
//   try {
//     const headers = await authHeaderFromCookies();
//     if (!headers.Authorization) {
//       return { success: false, error: "Not authenticated." };
//     }
//     const res = await api.post("/onboarding", form, { headers });
//     return { success: true, data: res.data.data };
//   } catch (e: any) {
//     const msg = e?.response?.data?.error || "Failed to submit onboarding.";
//     return { success: false, error: msg };
//   }
// }

// // Optionally load existing (to prefill/lock)
// export async function fetchMyOnboarding() {
//   try {
//     const headers = await authHeaderFromCookies();
//     if (!headers.Authorization) return { success: true, data: null };

//     const res = await api.get("/onboarding/me", { headers });
//     return { success: true, data: res.data.data };
//   } catch {
//     return { success: false, error: "Failed to load onboarding." };
//   }
// }



// app/(whatever)/actions/onboarding.ts
"use server";

import axios from "axios";

const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||"http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 12000,
  headers: { "Content-Type": "application/json" },
});

// Submit onboarding (expects userId passed in)
export async function submitOnboarding(form: any, userId: string) {
  if (!userId) return { success: false, error: "Missing userId." };
  try {
    const res = await api.post("/onboarding", { ...form, userId });
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to submit onboarding.";
    return { success: false, error: msg };
  }
}

// Load my onboarding (expects userId passed in)
export async function fetchMyOnboarding(userId: string) {
  if (!userId) return { success: true, data: null };
  try {
    const res = await api.get("/onboarding/me", { params: { userId } });
    return { success: true, data: res.data?.data };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to load onboarding.";
    return { success: false, error: msg };
  }
}

// Validate TIN (optional helper)
export async function validateTin(tin: string, userId?: string) {
  if (!tin) return { success: false, error: "TIN is required." };
  try {
    const res = await api.post("/onboarding/validate-tin", { tin, userId });
    return { success: true, isUnique: !!res.data?.isUnique };
  } catch (e: any) {
    const msg = e?.response?.data?.error || "Failed to validate TIN.";
    return { success: false, error: msg };
  }
}
