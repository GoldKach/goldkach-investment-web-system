import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getSession } from "@/actions/auth";
import { getUserById } from "@/actions/auth";
import { fetchMyIndividualOnboarding, fetchMyCompanyOnboarding } from "@/actions/onboarding";
import { getPortfolioSummary } from "@/actions/portfolio-summary";
import { ClientProfileView } from "@/components/agent/client-profile-view";
import { PortfolioList } from "@/components/agent/portfolio-list";
import { ErrorSection } from "@/components/agent/error-section";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ clientId: string }>;
}

export default async function ClientProfilePage({ params }: Props) {
  const { clientId } = await params;

  const session = await getSession();
  if (!session) redirect("/login");

  // Parallel fetch — portfolio failure is isolated
  let clientData: any = null;
  let clientFailed = false;

  try {
    const res = await getUserById(clientId);
    clientData = res?.data ?? null;
    if (!clientData) clientFailed = true;
  } catch {
    clientFailed = true;
  }

  const [individualRes, companyRes, summaryRes] = await Promise.allSettled([
    fetchMyIndividualOnboarding(clientId),
    fetchMyCompanyOnboarding(clientId),
    getPortfolioSummary(clientId),
  ]);

  if (clientFailed || !clientData) {
    return (
      <div className="space-y-4">
        <BackLink />
        <ErrorSection message="Failed to load client profile." />
      </div>
    );
  }

  const client = clientData;
  const individualOnboarding =
    individualRes.status === "fulfilled" ? individualRes.value?.data ?? null : null;
  const companyOnboarding =
    companyRes.status === "fulfilled" ? companyRes.value?.data ?? null : null;

  const portfolioSummary =
    summaryRes.status === "fulfilled" && summaryRes.value?.success
      ? summaryRes.value.data
      : null;
  const portfolioError =
    summaryRes.status === "rejected"
      ? "Failed to load portfolios."
      : summaryRes.status === "fulfilled" && !summaryRes.value?.success
      ? summaryRes.value?.error ?? "Failed to load portfolios."
      : null;

  const displayName = `${client.firstName} ${client.lastName}`;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <BackLink />
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">{displayName}</h1>
          <p className="text-sm text-slate-400">{client.email}</p>
        </div>
      </div>

      <ClientProfileView
        client={client}
        individualOnboarding={individualOnboarding}
        companyOnboarding={companyOnboarding}
      />

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">Portfolios</h2>
        {portfolioError ? (
          <ErrorSection message={portfolioError} />
        ) : (
          <PortfolioList
            portfolios={portfolioSummary?.portfolios ?? []}
            clientId={clientId}
          />
        )}
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/agent"
      className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
    >
      <ChevronLeft className="h-4 w-4" />
      Back to clients
    </Link>
  );
}
