// components/providers/zustand-hydration.tsx
"use client";

import { useEffect, useState, ReactNode } from "react";

/**
 * Wraps any component that reads from Zustand persisted store.
 * Prevents SSR/client hydration mismatch by only rendering
 * children after the client has mounted and the store has rehydrated.
 */
export function ZustandHydration({ 
  children, 
  fallback = null 
}: { 
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}