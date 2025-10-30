

// app/(dashboard)/user-portfolios/[id]/edit/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { UserPortfolioForm } from "@/components/back/user-portfolio-form";
import { getUserPortfolioById } from "@/actions/user-portfolios";

export default async function EditUserPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const res = await getUserPortfolioById(id, { user: true, portfolio: true });
  if (!res.success || !res.data) notFound();

  const up = res.data as {
    id: string; userId: string; portfolioId: string; portfolioValue?: number;
  };

  const initial = {
    id: up.id,
    userId: up.userId,
    portfolioId: up.portfolioId,
    portfolioValue: up.portfolioValue ?? 0,
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      <Button variant="ghost" asChild className="mb-4">
        <Link href={`/dashboard/user-portfolios/${id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Details
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit User Portfolio</CardTitle>
          <CardDescription>Update the user portfolio assignment details</CardDescription>
        </CardHeader>
        <CardContent>
          <UserPortfolioForm userPortfolio={initial} users={[]} portfolios={[]} />
        </CardContent>
      </Card>
    </div>
  );
}

