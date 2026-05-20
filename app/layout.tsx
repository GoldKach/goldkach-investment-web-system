

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { InactivityProvider } from "@/components/providers/InactivityProvider";
import { ZustandHydration } from "@/components/providers/zustand-hydration";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: " GoldKach",
  description: "GoldKach - Your Trusted Financial Partner",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <ZustandHydration>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="goldkach-theme"
          disableTransitionOnChange
        ></ThemeProvider>
        <Toaster />
         <InactivityProvider timeout={60 * 60 * 1000}> {/* 1 hour */}
         {children}
       </InactivityProvider>

        </ZustandHydration>
      
        
      </body>
    </html>
  );
}
