import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Pencil } from "lucide-react"
import { DeletePortfolioButton } from "@/components/back/delete-portfolio-button"
import { getPortfolioById } from "@/actions/portfolios"
import PortfolioDetail from "@/components/back/portfolio-detail-page"





export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  
      const id = (await params).id;
       const portfolioData = await getPortfolioById(id);
       const portfolio = portfolioData.data;

  // Replace with actual database query
  

  if (!portfolio) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
        <PortfolioDetail portfolio={portfolio} />
    
    </div>
  )
}
