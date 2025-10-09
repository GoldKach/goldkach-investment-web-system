// components/providers/AuthProvider.tsx
"use client";

import { useEffect } from "react";
// import axios from "axios";
import { useSessionStore } from "@/store/authStore";
import axios from "axios";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useSessionStore();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // Call your backend /me; it should read the httpOnly cookie (accessToken)
        const res = await axios.get(`${BASE_API_URL}/me`, { withCredentials: true });
        const user = res.data?.user ?? res.data?.data?.user ?? res.data;
        if (mounted) setUser(user ?? null);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [setUser, setLoading]);

  return <>{children}</>;
}
