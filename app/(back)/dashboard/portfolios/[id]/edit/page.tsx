import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { PortfolioForm } from "@/components/back/portfolio-form"
import { getPortfolioById } from "@/actions/portfolios"


export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  
      const id = (await params).id;
         const portfolioData = await getPortfolioById(id);
         const portfolio = portfolioData.data
  
    if (!portfolio) {
      notFound()
    }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href={`/dashboard/portfolios`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Edit Portfolio</h1>
        <p className="text-muted-foreground">Update the details for {portfolio.name}</p>
      </div>

      <PortfolioForm portfolio={portfolio} mode="edit" />
    </div>
  )
}
