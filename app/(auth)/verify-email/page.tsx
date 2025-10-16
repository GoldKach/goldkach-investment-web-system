import VerifyEmailForm from "@/components/front-end/forms/verify-email";
import HeroCarousel from "@/components/front-end/hero-couresel";
import { ThemeToggle } from "@/components/front-end/theme-toggle";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <VerifyEmailForm />
        </div>
      </div>
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/20" />
        <HeroCarousel />
      </div>
    </div>
  );
}
