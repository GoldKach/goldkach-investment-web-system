// hooks/useInactivityLogout.ts
"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/actions/auth";

interface UseInactivityLogoutOptions {
  timeout?: number; // in milliseconds, default 1 hour
  onLogout?: () => void;
  enabled?: boolean;
}

export function useInactivityLogout(options: UseInactivityLogoutOptions = {}) {
  const {
    timeout = 60 * 60 * 1000, // 1 hour in milliseconds
    onLogout,
    enabled = true,
  } = options;

  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(async () => {
    console.log("🔒 Auto-logout due to inactivity");
    
    // Call custom logout handler if provided
    if (onLogout) {
      onLogout();
    }

    // Clear session
    await logoutUser();
    
    // Redirect to login with message
    router.push("/login?reason=inactivity");
  }, [onLogout, router]);

  const resetTimer = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, timeout);

    // Optional: Show warning 5 minutes before logout
    const warningTime = timeout - 5 * 60 * 1000; // 5 minutes before
    if (warningTime > 0) {
      warningTimeoutRef.current = setTimeout(() => {
        console.log("⚠️ Warning: You will be logged out in 5 minutes due to inactivity");
        // You can show a toast/notification here
      }, warningTime);
    }
  }, [timeout, handleLogout]);

  useEffect(() => {
    if (!enabled) return;

    // Events to track user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // Reset timer on any activity
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Start initial timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [enabled, resetTimer]);

  return {
    resetTimer, // Expose manual reset if needed
  };
}