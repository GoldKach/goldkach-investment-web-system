// components/providers/InactivityProvider.tsx
"use client";

import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import { toast } from "sonner";

interface InactivityProviderProps {
  children: React.ReactNode;
  timeout?: number; // in milliseconds
}

export function InactivityProvider({ 
  children, 
  timeout = 60 * 60 * 1000 // 1 hour default
}: InactivityProviderProps) {
  
  useInactivityLogout({
    timeout,
    onLogout: () => {
      toast.error("You have been logged out due to inactivity", {
        description: "Please log in again to continue",
        duration: 5000,
      });
    },
    enabled: true,
  });

  return <>{children}</>;
}