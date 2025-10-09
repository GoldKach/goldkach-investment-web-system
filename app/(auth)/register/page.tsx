import { RegisterForm } from "@/components/front-end/forms/register-form"
import { RegisterHeroCarousel } from "@/components/front-end/register-hero"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-navy-950">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left side - Register Form */}
        <div className="flex items-center justify-center p-8">
          <RegisterForm />
        </div>

        {/* Right side - Hero Carousel */}
        <div className="hidden lg:block relative overflow-hidden">
          <RegisterHeroCarousel />
        </div>
      </div>
    </div>
  )
}
