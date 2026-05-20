import { RegisterForm } from "@/components/front-end/forms/register-form";
import HeroCarousel from "@/components/front-end/hero-couresel";
import { ThemeToggle } from "@/components/front-end/theme-toggle";
import { getPublicAgentInfoAction, type PublicAgentInfo } from "@/actions/staff";

interface Props {
  searchParams: Promise<{ agent?: string }>;
}

export default async function RegisterPage({ searchParams }: Props) {
  const { agent } = await searchParams;

  let agentInfo: PublicAgentInfo | null = null;
  if (agent) {
    const res = await getPublicAgentInfoAction(agent);
    if (res.success) agentInfo = res.data;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-1 bg-transparent items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10" />
        <HeroCarousel/>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>
        <div className="w-full px-8">
          <RegisterForm agentRef={agent} agentInfo={agentInfo} />
        </div>
      </div>
    </div>
  )
}
