// hooks/useAccessToken.ts
"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

/**
 * Waits for Zustand persist middleware to finish rehydrating
 * from localStorage before returning the accessToken.
 */
export function useAccessToken() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [hydrated, setHydrated] = useState(
    () => useAuthStore.persist?.hasHydrated?.() ?? false
  );

  useEffect(() => {
    if (hydrated) return;

    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    // In case it already finished between render and this effect
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return unsub;
  }, []);

  return {
    accessToken: hydrated ? accessToken : null,
    hydrated,
  };
}