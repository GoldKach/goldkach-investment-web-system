import { LoginForm } from "@/components/front-end/forms/login-form";
import { ThemeToggle } from "@/components/front-end/theme-toggle";


export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/20" />
        <div className="relative z-10 text-center space-y-6 max-w-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm mb-4">
            <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground">Welcome to InvestPro</h1>
          <p className="text-lg text-primary-foreground/90 leading-relaxed">
            Your trusted platform for smart investing. Access real-time market data, advanced analytics, and portfolio
            management tools.
          </p>
          <div className="flex items-center justify-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">$2.5B+</div>
              <div className="text-sm text-primary-foreground/80">Assets Under Management</div>
            </div>
            <div className="h-12 w-px bg-primary-foreground/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">50K+</div>
              <div className="text-sm text-primary-foreground/80">Active Investors</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
