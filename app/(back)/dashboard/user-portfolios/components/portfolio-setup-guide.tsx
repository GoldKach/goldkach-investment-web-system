// components/back/portfolio-setup-guide.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Folder, 
  Package, 
  Users, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

type Props = {
  currentStep?: "portfolios" | "assets" | "user-portfolios"
}

export function PortfolioSetupGuide({ currentStep }: Props) {
  const steps = [
    {
      id: "portfolios",
      icon: Folder,
      title: "1. Create Portfolios",
      description: "Create portfolio templates (e.g., 'Growth Portfolio', 'Balanced Portfolio')",
      link: "/dashboard/portfolios",
      linkText: "Manage Portfolios",
    },
    {
      id: "assets",
      icon: Package,
      title: "2. Add Assets to Portfolios",
      description: "Add stocks/assets to each portfolio with default allocations",
      link: "/dashboard/portfolio-assets",
      linkText: "Manage Portfolio Assets",
    },
    {
      id: "user-portfolios",
      icon: Users,
      title: "3. Assign to Users",
      description: "Assign portfolios to users with custom allocation percentages",
      link: "/dashboard/user-portfolios",
      linkText: "Assign Portfolios",
    },
  ]

  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-blue-900 dark:text-blue-100">
            Portfolio Setup Workflow
          </CardTitle>
        </div>
        <CardDescription className="text-blue-700 dark:text-blue-300">
          Follow these steps to properly set up and assign portfolios to users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isCurrentStep = currentStep === step.id
            const isCompleted = false // You can add logic to check completion

            return (
              <div key={step.id}>
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      isCurrentStep
                        ? "bg-blue-600 text-white"
                        : isCompleted
                        ? "bg-green-600 text-white"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                        {step.title}
                      </h3>
                      {isCurrentStep && (
                        <Badge variant="default" className="text-xs">
                          Current Step
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {step.description}
                    </p>
                    <Button
                      variant={isCurrentStep ? "default" : "outline"}
                      size="sm"
                      asChild
                    >
                      <Link href={step.link}>
                        {step.linkText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="ml-5 mt-2 mb-2 h-8 w-0.5 bg-blue-200 dark:bg-blue-800" />
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-white dark:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
            📝 Important Notes:
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
            <li>Portfolios must have at least one asset before assignment</li>
            <li>Each user can have different allocations for the same portfolio</li>
            <li>Asset allocations should typically total 100%</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}