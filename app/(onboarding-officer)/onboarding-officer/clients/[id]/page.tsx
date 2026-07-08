import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getSession, getUserById } from "@/actions/auth";
import { getOnboardingByUserId } from "@/actions/onboarding-admin";
import { getAMLRiskAssessment } from "@/actions/aml-risk-assessment";
import { OOClientOnboardingView } from "@/components/onboarding-officer/oo-client-onboarding-view";
import { AMLRiskAssessmentForm } from "@/components/shared/aml-risk-assessment-form";

export const dynamic = "force-dynamic";

export default async function OOClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  async function ClientData() {
    const session = await getSession();
    if (!session?.user) redirect("/login");

    const [userRes, onboardingRes, amlRes] = await Promise.all([
      getUserById(id),
      getOnboardingByUserId(id),
      getAMLRiskAssessment(id),
    ]);

    const user = userRes?.data;
    if (!user) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <h2 className="text-xl font-bold">Client Not Found</h2>
          <p className="text-muted-foreground text-sm">The client you're looking for doesn't exist.</p>
          <Link href="/onboarding-officer/clients">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Clients
            </Button>
          </Link>
        </div>
      );
    }

    const onboardingData = onboardingRes.success ? (onboardingRes.data ?? null) : null;
    const amlData = amlRes.success ? (amlRes.data?.data ?? null) : null;

    const clientName =
      onboardingData?.data?.fullName ||
      onboardingData?.data?.companyName ||
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.email;

    const currentUser = {
      name: [session.user!.firstName, session.user!.lastName].filter(Boolean).join(" "),
      role: session.user!.role,
    };

    return (
      <div className="space-y-6">
        <OOClientOnboardingView user={user} onboardingData={onboardingData} />
        <AMLRiskAssessmentForm
          userId={user.id}
          clientName={clientName}
          initialData={amlData}
          currentUser={currentUser}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/onboarding-officer/clients">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Client Onboarding Details</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Review onboarding information and approve or reject</p>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        }
      >
        <ClientData />
      </Suspense>
    </div>
  );
}
