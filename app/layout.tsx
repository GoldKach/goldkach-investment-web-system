

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { InactivityProvider } from "@/components/providers/InactivityProvider";
import { ZustandHydration } from "@/components/providers/zustand-hydration";
import { PWAInstallProvider } from "@/components/pwa/pwa-install-context";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "GoldKach Investment Platform",
  description: "GoldKach - Your Trusted Investment Partner. Manage portfolios, track returns, and grow your wealth.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GoldKach",
    startupImage: "/icons/icon-512x512.png",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": "GoldKach",
    "apple-mobile-web-app-title": "GoldKach",
    "msapplication-TileColor": "#080c1f",
    "msapplication-TileImage": "/icons/icon-144x144.png",
    "theme-color": "#080c1f",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#080c1f" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
      </head>
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
        <PWAInstallProvider>
          <InactivityProvider timeout={60 * 60 * 1000}>
            {children}
          </InactivityProvider>
        </PWAInstallProvider>
        </ZustandHydration>
      
        
      </body>
    </html>
  );
}
