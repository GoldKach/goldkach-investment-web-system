// // app/actions/auth.ts
// "use server"

// import axios from "axios"
// import { revalidatePath } from "next/cache"
// import { cookies } from 'next/headers'
// import { redirect } from 'next/navigation'

// const BASE_API_URL = process.env.API_URL || ""
// const api = axios.create({
//     baseURL: BASE_API_URL,
//     timeout: 10000,
//     headers: {
//         'Content-Type': 'application/json'
//     }
// })

// // Types
// interface LoginResponse {
//     success: boolean;
//     data?: {
//         user: {
//             id: string;
//             email: string;
//             role: string;
//             firstName?: string;
//             lastName?: string;
//         };
//         accessToken: string;
//         refreshToken: string;
//     };
//     error?: string;
// }

// // Helper function to set cookies
// const setCookies = async (
//     accessToken: string, 
//     refreshToken: string,
//     userData: any
// ) => {
//     const cookieStore =await cookies();
    
//     // Set access token
//     cookieStore.set('accessToken', accessToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'lax',
//         maxAge: 60 * 60 * 24 * 7 // 1 week
//     });

//     // Set refresh token
//     cookieStore.set('refreshToken', refreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'lax',
//         maxAge: 60 * 60 * 24 * 30 // 30 days
//     });

//     // Store user data in a session cookie
//     cookieStore.set('userData', JSON.stringify(userData), {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: 'lax',
//     });
// };

// // Helper function to clear cookies
// const clearCookies = async () => {
//     const cookieStore = await cookies();
//     cookieStore.delete('accessToken');
//     cookieStore.delete('refreshToken');
//     cookieStore.delete('userData');
// };

// export async function loginUser(data: { 
//     email: string, 
//     password: string 
// }): Promise<LoginResponse> {
//     try {
//         const response = await api.post("/login", data);
//         const { user, accessToken, refreshToken } = response.data.data;

//         // Set cookies
//         await setCookies(accessToken, refreshToken, user);
        
//         return {
//             success: true,
//             data: {
//                 user,
//                 accessToken,
//                 refreshToken
//             }
//         };
//     } catch (error: any) {
//         console.error('Login error:', error);
//         return {
//             success: false,
//             error: error.response?.data?.message || 'Login failed. Please try again.'
//         };
//     }
// }

// export async function logoutUser() {
//     try {
//         // Get the access token from cookies
//         const cookieStore = await cookies();
//         const accessToken = cookieStore.get('accessToken');

//         if (accessToken) {
//             // Make API call to backend logout endpoint
//             await api.post("/logout", {}, {
//                 headers: {
//                     Authorization: `Bearer ${accessToken.value}`
//                 }
//             });
//         }

//         // Clear all cookies
//         await clearCookies();

//         return {
//             success: true
//         };
//     } catch (error) {
//         console.error('Logout error:', error);
        
//         // Still clear cookies even if API call fails
//         await clearCookies();

//         return {
//             success: false,
//             error: 'Logout failed, but session was cleared'
//         };
//     }
// }

// export async function getSession() {
//     const cookieStore =await cookies();
//     const accessToken = cookieStore.get('accessToken');
//     const userData = cookieStore.get('userData');

//     if (!accessToken || !userData) {
//         return null;
//     }

//     try {
//         return {
//             user: JSON.parse(userData.value),
//             accessToken: accessToken.value
//         };
//     } catch (error) {
//         console.error('Session parsing error:', error);
//         return null;
//     }
// }

// export async function refreshAccessToken() {
//     try {
//         const cookieStore =await cookies();
//         const refreshToken = cookieStore.get('refreshToken');

//         if (!refreshToken) {
//             throw new Error('No refresh token found');
//         }

//         const response = await api.post("/refresh-token", {
//             refreshToken: refreshToken.value
//         });

//         const { accessToken: newAccessToken } = response.data;

//         // Update only the access token cookie
//         cookieStore.set('accessToken', newAccessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax',
//             maxAge: 60 * 60 * 24 * 7 // 1 week
//         });

//         return {
//             success: true,
//             accessToken: newAccessToken
//         };
//     } catch (error) {
//         console.error('Token refresh error:', error);
//         // If refresh fails, clear all cookies and redirect to login
//         await clearCookies();
//         redirect('/login');
//     }
// }

// export async function getAllUsers(){
//   try {
//     const response = await api.get("/users");
//     const users=response.data;
//         return users;
    
//   } catch (error) {
//     console.log(error)
    
//   }
// }

// export async function createUser(data:any) {
//     try {
//         const response = await api.post("/register", data);
//       revalidatePath("/dashboard/users")
        
//         return response.data;
//       } catch (error) {
//         if (axios.isAxiosError(error)) {
//           // Type-safe error handling
//           const message = 
//             error.response?.data?.message || "Failed to create user";
//           throw new Error(message);
          
//         }
//         throw error;
//       }
// }
// export async function deleteUser(userId: string) {
//     try {
//         // Get the access token from cookies
//         const cookieStore = await cookies();
//         const accessToken = cookieStore.get('accessToken');

//         if (!accessToken) {
//             throw new Error("Unauthorized: No access token found");
//         }

//         // Make API call to delete user
//         await api.delete(`/users/${userId}`, {
//             headers: {
//                 Authorization: `Bearer ${accessToken.value}`
//             }
//         });

//         // Revalidate users list
//         revalidatePath("/dashboard/users");

//         return { success: true, message: "User deleted successfully" };
//     } catch (error) {
//         console.error("Delete user error:", error);
//         // return {
//         //     success: false,
//         //     error: error.response?.data?.message || "Failed to delete user"
//         // };
//     }
// }

//   export async function deleteContact(id:string){
//     console.log("deleted");
//     return{
//       ok:true
//     }
//   }




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

/** ========= Cookie Helpers ========= **/
const setCookies = async (
  accessToken: string,
  refreshToken: string,
  userData: BackendUser
) => {
  const cookieStore = await cookies();

  // Access token (short-lived)
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  // Refresh token (longer-lived)
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  // User data (httpOnly to keep it server-side only)
  cookieStore.set("userData", JSON.stringify(userData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // session cookie
  });
};

const clearCookies = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("userData");
};

/** ========= Auth Actions ========= **/
export async function loginUser(data: {
  identifier: string; // email OR phone
  password: string;
}): Promise<LoginResponse> {
  try {
    // Your Express backend expects { identifier, password }
    const res = await api.post("/login", data);
    const { user, accessToken, refreshToken } = res.data.data as LoginSuccessPayload;

    await setCookies(accessToken, refreshToken, user);

    return { success: true, data: { user, accessToken, refreshToken } };
  } catch (error: any) {
    console.error("Login error:", error?.response?.data || error);
    return {
      success: false,
      error: error?.response?.data?.error || "Login failed. Please try again.",
    };
  }
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
    await clearCookies(); // clear anyway
    return { success: false, error: "Logout failed, but session was cleared" };
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const userData = cookieStore.get("userData");

  if (!accessToken || !userData) return null;

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

/** ========= API Helpers Using Cookies ========= **/
async function getAuthHeaderFromCookies() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

/** ========= Example CRUD Calls ========= **/
export async function getAllUsers() {
  try {
    const headers = await getAuthHeaderFromCookies();
    const res = await api.get("/users", { headers });
    return res.data;
  } catch (error) {
    console.error("getAllUsers error:", error);
    throw error;
  }
}

export async function createUser(data: any) {
  try {
    // Public register endpoint (no auth header)
    const res = await api.post("/register", data);
    // If you want to auto-refresh the users list in UI:
    revalidatePath("/dashboard/users");
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to create user";
      throw new Error(message);
    }
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    const headers = await getAuthHeaderFromCookies();
    if (!headers.Authorization) throw new Error("Unauthorized: No access token found");

    await api.delete(`/users/${userId}`, { headers });
    revalidatePath("/dashboard/users");
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
}

/** ========= Optional: me endpoint via backend ========= **/
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
