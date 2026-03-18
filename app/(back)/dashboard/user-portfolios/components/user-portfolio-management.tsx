// components/back/user-portfolio-management.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Eye, Pencil, Trash2, TrendingUp, TrendingDown, Info } from "lucide-react"
import { CreateUserPortfolioDialog } from "./create-user-portfolio-dialog"
import { DeleteUserPortfolioDialog } from "./delete-user-portfolio-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { PortfolioSetupGuide } from "./portfolio-setup-guide"
import { ViewUserPortfolioDialog } from "./view-user-portfolio-dialogue"

type UserPortfolio = {
  id: string
  userId: string
  portfolioId: string
  portfolioValue: number
  createdAt?: string
  updatedAt?: string
  user?: {
    id: string
    name?: string | null
    firstName?: string | null
    lastName?: string | null
    email?: string | null
  }
  portfolio?: {
    id: string
    name: string
    description?: string | null
  }
  userAssets?: any[]
}

type Props = {
  initialUserPortfolios: UserPortfolio[]
}

export function UserPortfolioManagement({ initialUserPortfolios }: Props) {
  const [userPortfolios, setUserPortfolios] = useState<UserPortfolio[]>(initialUserPortfolios)
  const [createOpen, setCreateOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedUserPortfolio, setSelectedUserPortfolio] = useState<UserPortfolio | null>(null)
  const [showGuide, setShowGuide] = useState(true)

  const handleView = (userPortfolio: UserPortfolio) => {
    setSelectedUserPortfolio(userPortfolio)
    setViewOpen(true)
  }

  const handleDelete = (userPortfolio: UserPortfolio) => {
    setSelectedUserPortfolio(userPortfolio)
    setDeleteOpen(true)
  }

  const handleUserPortfolioCreated = (newUserPortfolio: UserPortfolio) => {
    setUserPortfolios([newUserPortfolio, ...userPortfolios])
    setCreateOpen(false)
  }

  const handleUserPortfolioDeleted = (deletedId: string) => {
    setUserPortfolios(userPortfolios.filter(up => up.id !== deletedId))
    setDeleteOpen(false)
    setSelectedUserPortfolio(null)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—"
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString))
  }

  const getUserName = (up: UserPortfolio) => {
    if (up.user?.name) return up.user.name
    if (up.user?.firstName || up.user?.lastName) {
      return `${up.user.firstName || ""} ${up.user.lastName || ""}`.trim()
    }
    return "—"
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">User Portfolios</h1>
          <p className="text-muted-foreground mt-2">
            Manage user portfolio assignments with custom allocations
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Assign Portfolio
        </Button>
      </div>

      {/* Setup Guide */}
      <Collapsible open={showGuide} onOpenChange={setShowGuide} className="mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                <CardTitle>Need Help Getting Started?</CardTitle>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {showGuide ? "Hide Guide" : "Show Guide"}
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <PortfolioSetupGuide currentStep="user-portfolios" />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Card>
        <CardHeader>
          <CardTitle>All User Portfolios</CardTitle>
          <CardDescription>
            Each user can have different allocation percentages and cost basis for the same assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userPortfolios.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No user portfolios found</p>
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Assign First Portfolio
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Portfolio</TableHead>
                    <TableHead className="text-right">Portfolio Value</TableHead>
                    <TableHead className="text-right">Assets</TableHead>
                    <TableHead className="text-right">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPortfolios.map((up) => (
                    <TableRow key={up.id}>
                      <TableCell className="font-medium">
                        {getUserName(up)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {up.user?.email || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{up.portfolio?.name || "—"}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(up.portfolioValue)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">
                          {up.userAssets?.length || 0} assets
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {formatDate(up.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(up)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(up)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateUserPortfolioDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onUserPortfolioCreated={handleUserPortfolioCreated}
      />

      {selectedUserPortfolio && (
        <>
          <ViewUserPortfolioDialog
            open={viewOpen}
            onOpenChange={setViewOpen}
            userPortfolio={selectedUserPortfolio}
            onDelete={() => {
              setViewOpen(false)
              setDeleteOpen(true)
            }}
          />

          <DeleteUserPortfolioDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            userPortfolio={selectedUserPortfolio}
            onUserPortfolioDeleted={handleUserPortfolioDeleted}
          />
        </>
      )}
    </>
  )
}