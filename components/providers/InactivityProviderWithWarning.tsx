// components/providers/InactivityProviderWithWarning.tsx
"use client";

import { useState, useCallback } from "react";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface InactivityProviderWithWarningProps {
  children: React.ReactNode;
  timeout?: number; // in milliseconds
  warningTime?: number; // how many ms before timeout to show warning
}

export function InactivityProviderWithWarning({ 
  children, 
  timeout = 60 * 60 * 1000, // 1 hour default
  warningTime = 5 * 60 * 1000 // 5 minutes before logout
}: InactivityProviderWithWarningProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(5 * 60); // 5 minutes in seconds

  const { resetTimer } = useInactivityLogout({
    timeout,
    onLogout: () => {
      toast.error("You have been logged out due to inactivity", {
        description: "Please log in again to continue",
        duration: 5000,
      });
    },
    enabled: true,
  });

  const handleStayLoggedIn = useCallback(() => {
    setShowWarning(false);
    resetTimer(); // Reset the inactivity timer
    toast.success("Session extended", {
      description: "You can continue working",
    });
  }, [resetTimer]);

  return (
    <>
      {children}
      
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Session About to Expire</AlertDialogTitle>
            <AlertDialogDescription>
              You will be automatically logged out in {Math.floor(countdown / 60)} minutes 
              due to inactivity. Do you want to stay logged in?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Logout Now</AlertDialogCancel>
            <AlertDialogAction onClick={handleStayLoggedIn}>
              Stay Logged In
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}