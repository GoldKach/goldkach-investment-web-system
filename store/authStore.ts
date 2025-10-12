// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

/** ================== Axios base ================== */
const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface RetriableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

/** ================== Interceptors ================== */
// Attach access token from store
api.interceptors.request.use(
  (config) => {
    const state = useAuthStore.getState();
    if (state.accessToken) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${state.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh on 401, then retry once
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const state = useAuthStore.getState();
        if (state.refreshToken) {
          const res = await axios.post(`${BASE_API_URL}/refresh-token`, {
            refreshToken: state.refreshToken,
          });

          const { accessToken } = res.data;
          state.setTokens(accessToken, state.refreshToken);

          originalRequest.headers = originalRequest.headers ?? {};
          (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

/** ================== Types ================== */
interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  imageUrl?: string;
  status?: "PENDING" | "ACTIVE" | "INACTIVE" | "SUSPENDED" | "DEACTIVATED" | "BANNED";
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void;
  initialize: () => Promise<void>;
  login: (credentials: { identifier: string; password: string }) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

/** ================== Store ================== */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },

      initialize: async () => {
        set({ isLoading: true });
        try {
          const { accessToken } = get();
          if (accessToken) {
            const res = await api.get("/me", {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            // Backend could return either { data: user } or { user }
            const user: User = res.data?.data ?? res.data?.user ?? null;
            if (user) {
              set({ user, isAuthenticated: true });
            } else {
              set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
              });
            }
          }
        } catch {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // IMPORTANT: backend expects { identifier, password }
      login: async ({ identifier, password }) => {
        set({ isLoading: true });
        try {
          const res = await api.post("/login", { identifier, password });
          const { user, accessToken, refreshToken } = res.data.data;

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const res = await api.post("/register", userData);
          // If your backend logs in immediately after register:
          const { user, accessToken, refreshToken } = res.data.data || {};
          if (user && accessToken && refreshToken) {
            set({
              user,
              accessToken,
              refreshToken,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // If register does not return tokens, just stop loading.
            set({ isLoading: false });
          }
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          const { accessToken } = get();
          if (accessToken) {
            await api.post(
              "/logout",
              {},
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
          }
        } catch (err) {
          // swallow; we'll clear state anyway
          console.error("Logout error:", err);
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      // Persist tokens only; user is fetched on initialize()
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

/** Export the axios instance if you want to reuse it */
export { api };
