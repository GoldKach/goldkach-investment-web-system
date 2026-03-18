

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { InactivityProvider } from "@/components/providers/InactivityProvider";
import { ZustandHydration } from "@/components/providers/zustand-hydration";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: " GoldKach",
  description: "GoldKach - Your Trusted Financial Partner",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ZustandHydration>
               <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
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
