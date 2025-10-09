import { ForgotPasswordForm } from "@/components/front-end/forms/forgot-password-form";
import HeroCarousel from "@/components/front-end/hero-couresel";
import { ThemeToggle } from "@/components/front-end/theme-toggle";


export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <ForgotPasswordForm />
        </div>
      </div>

      {/* Right side - Branding */}
      <HeroCarousel/>
      {/* <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/20" />
        <div className="relative z-10 text-center space-y-6 max-w-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm mb-4">
            <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground">Secure Account Recovery</h1>
          <p className="text-lg text-primary-foreground/90 leading-relaxed">
            Your security is our priority. We'll send you a secure link to reset your password and regain access to your
            investment portfolio.
          </p>
          <div className="flex items-center justify-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">256-bit</div>
              <div className="text-sm text-primary-foreground/80">Encryption</div>
            </div>
            <div className="h-12 w-px bg-primary-foreground/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">24/7</div>
              <div className="text-sm text-primary-foreground/80">Security Monitoring</div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}
