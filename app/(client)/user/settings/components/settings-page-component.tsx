// app/user/settings/components/settings-page-content.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserSettings } from "@/actions/user-settings";
import { User, Lock, Settings } from "lucide-react";
import { ProfileTab } from "./profile-tab";
import { SecurityTab } from "./security-tab";
import { AccountTab } from "./account-tab";

interface SettingsPageContentProps {
  user: UserSettings;
}

export function SettingsPageContent({ user }: SettingsPageContentProps) {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Account Settings
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileTab user={user} />
            </TabsContent>

            <TabsContent value="security">
              <SecurityTab user={user} />
            </TabsContent>

            <TabsContent value="account">
              <AccountTab user={user} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}