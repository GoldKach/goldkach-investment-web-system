"use client"

import type React from "react"

import { Check, Crown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface PricingPlan {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: string[]
  popular?: boolean
  icon: React.ReactNode
  savings?: string
}

const plans: PricingPlan[] = [
  {
    id: "daily",
    name: "Daily Pass",
    price: 2.99,
    period: "day",
    description: "Perfect for a movie night",
    icon: <Zap className="w-6 h-6" />,
    features: ["Access to all content", "HD streaming quality", "Watch on 1 device", "24-hour access"],
  },
  {
    id: "weekly",
    name: "Weekly",
    price: 9.99,
    period: "week",
    description: "Great for binge-watching",
    icon: <Zap className="w-6 h-6" />,
    features: [
      "Access to all content",
      "Full HD streaming",
      "Watch on 2 devices",
      "7-day access",
      "Download for offline",
    ],
  },
  {
    id: "monthly",
    name: "Monthly",
    price: 29.99,
    period: "month",
    description: "Most popular choice",
    popular: true,
    icon: <Crown className="w-6 h-6" />,
    savings: "Save 30%",
    features: [
      "Access to all content",
      "4K Ultra HD streaming",
      "Watch on 4 devices",
      "30-day access",
      "Download for offline",
      "Early access to new releases",
      "Ad-free experience",
    ],
  },
  {
    id: "annual",
    name: "Annual",
    price: 299.99,
    period: "year",
    description: "Best value for movie lovers",
    icon: <Crown className="w-6 h-6" />,
    savings: "Save 50%",
    features: [
      "Access to all content",
      "4K Ultra HD streaming",
      "Watch on unlimited devices",
      "365-day access",
      "Download for offline",
      "Early access to new releases",
      "Ad-free experience",
      "Exclusive behind-the-scenes content",
      "Priority customer support",
    ],
  },
]

export function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string>("monthly")

  return (
    <section className="py-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Choose Your Plan</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible subscription options to fit your viewing habits. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-card rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                plan.popular ? "border-accent shadow-lg shadow-accent/20" : "border-border hover:border-accent/50"
              } ${selectedPlan === plan.id ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              {plan.savings && (
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground text-xs font-bold rounded-full shadow-lg">
                  {plan.savings}
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/10 text-accent rounded-lg">{plan.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setSelectedPlan(plan.id)}
                  variant={selectedPlan === plan.id ? "default" : "outline"}
                  className="w-full mb-6"
                >
                  {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a 7-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  )
}
