"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserSettings } from "@/actions/user-settings";
import { User, Lock, Shield } from "lucide-react";
import { ProfileTab } from "./profile-tab";
import { SecurityTab } from "./security-tab";

interface SettingsPageContentProps {
  user: UserSettings;
}

export function SettingsPageContent({ user }: SettingsPageContentProps) {
  const initials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14 border-2 border-border">
          <AvatarImage src={user.imageUrl || ""} alt={fullName} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{fullName}</h1>
            <Badge
              variant="outline"
              className={
                user.status === "ACTIVE"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs"
              }
            >
              {user.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            {user.email}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="security" className="w-full">
        <TabsList className="bg-muted/50 border border-border">
          <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-card">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-card">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="security">
            <SecurityTab user={user} />
          </TabsContent>
          <TabsContent value="profile">
            <ProfileTab user={user} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
