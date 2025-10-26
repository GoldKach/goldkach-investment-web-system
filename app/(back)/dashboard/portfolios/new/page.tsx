import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { PortfolioForm } from "@/components/back/portfolio-form"

export default function NewPortfolioPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/portfolios">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolios
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Create Portfolio</h1>
        <p className="text-muted-foreground">Add a new portfolio to your investment strategy</p>
      </div>

      <PortfolioForm mode="create" />
    </div>
  )
}
