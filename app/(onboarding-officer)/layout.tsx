import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/auth";
import OOShell from "@/components/onboarding-officer/oo-shell";

export const dynamic = "force-dynamic";

export default async function OnboardingOfficerLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  if (session.user?.role !== "ONBOARDING_OFFICER") {
    if (session.user?.role === "SUPER_ADMIN" || session.user?.role === "ADMIN" || session.user?.role === "MANAGER") {
      redirect("/dashboard");
    }
    if (session.user?.role === "AGENT") redirect("/agent");
    if (session.user?.role === "CLIENT_RELATIONS") redirect("/cr");
    if (session.user?.role === "ACCOUNT_MANAGER") redirect("/accountant");
    if (session.user?.role === "USER") redirect("/user");
    redirect("/unauthorized");
  }

  return <OOShell user={session.user}>{children}</OOShell>;
}
