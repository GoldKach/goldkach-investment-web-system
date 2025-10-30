

// app/(dashboard)/user-portfolios/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, Calendar, User as UserIcon, Briefcase, DollarSign } from "lucide-react";
import { DeleteUserPortfolioButton } from "@/components/back/delete-user-portfolio-button";
import { getUserPortfolioById } from "@/actions/user-portfolios";

function asDate(v: unknown): Date {
  // handle Date or ISO string from API
  return v instanceof Date ? v : new Date(String(v));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);
}

export default async function UserPortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;
  // Ask API to include user & portfolio so we have names/emails/etc.
  const res = await getUserPortfolioById(id, { user: true, portfolio: true } );
  if (!res.success || !res.data) notFound();

  const up = res.data as any;

  const createdAt = asDate(up.createdAt);
  const updatedAt = asDate(up.updatedAt);

  const userName =
    up.user?.name ||
    [up.user?.firstName, up.user?.lastName].filter(Boolean).join(" ") ||
    up.user?.email ||
    "Unknown User";

  const userEmail = up.user?.email ?? "—";
  const portfolioName = up.portfolio?.name ?? "—";
  const portfolioDescription = up.portfolio?.description ?? "—";

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/user-portfolios">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Portfolios
          </Link>
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">User Portfolio Details</h1>
            <p className="text-muted-foreground">View detailed information about this user portfolio assignment</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/dashboard/user-portfolios/${up.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <DeleteUserPortfolioButton
              userPortfolioId={up.id}
              userName={userName}
              portfolioName={portfolioName}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              User Information
            </CardTitle>
            <CardDescription>Details about the user</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Name</div>
              <div className="text-lg font-semibold">{userName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Email</div>
              <div className="text-lg">{userEmail}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">User ID</div>
              <div className="font-mono text-sm">{up.user?.id ?? "—"}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Portfolio Information
            </CardTitle>
            <CardDescription>Details about the assigned portfolio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Portfolio Name</div>
              <div className="text-lg font-semibold">{portfolioName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Description</div>
              <div className="text-sm">{portfolioDescription}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Portfolio ID</div>
              <div className="font-mono text-sm">{up.portfolio?.id ?? "—"}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Portfolio Value
            </CardTitle>
            <CardDescription>Current value of the user's portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(Number(up.portfolioValue) || 0)}</div>
            <p className="text-sm text-muted-foreground mt-2">Total value of all assets in this user portfolio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timeline
            </CardTitle>
            <CardDescription>Important dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Created</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{createdAt.toLocaleDateString()}</Badge>
                <span className="text-sm text-muted-foreground">{createdAt.toLocaleTimeString()}</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Last Updated</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{updatedAt.toLocaleDateString()}</Badge>
                <span className="text-sm text-muted-foreground">{updatedAt.toLocaleTimeString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Record Information</CardTitle>
          <CardDescription>System identifiers and metadata</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">User Portfolio ID</div>
              <div className="font-mono text-sm bg-muted p-2 rounded">{up.id}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Unique Constraint</div>
              <div className="text-sm">
                <Badge variant="secondary">userId + portfolioId</Badge>
                <p className="text-muted-foreground mt-1">Prevents duplicate user-portfolio assignments</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
