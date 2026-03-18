// components/back/delete-user-portfolio-dialog.tsx
"use client"

import { useState } from "react"
import { deleteUserPortfolio } from "@/actions/user-portfolios"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Loader2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type UserPortfolio = {
  id: string
  user?: {
    name?: string | null
    firstName?: string | null
    lastName?: string | null
    email?: string | null
  }
  portfolio?: {
    name: string
  }
  userAssets?: any[]
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  userPortfolio: UserPortfolio
  onUserPortfolioDeleted: (id: string) => void
}

export function DeleteUserPortfolioDialog({ 
  open, 
  onOpenChange, 
  userPortfolio, 
  onUserPortfolioDeleted 
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteUserPortfolio(userPortfolio.id)
      
      if (result.success) {
        toast.success("User portfolio deleted successfully")
        onUserPortfolioDeleted(userPortfolio.id)
      } else {
        toast.error(result.error || "Failed to delete user portfolio")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  const getUserName = () => {
    if (userPortfolio.user?.name) return userPortfolio.user.name
    if (userPortfolio.user?.firstName || userPortfolio.user?.lastName) {
      return `${userPortfolio.user.firstName || ""} ${userPortfolio.user.lastName || ""}`.trim()
    }
    return userPortfolio.user?.email || "this user"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User Portfolio</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this portfolio assignment? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This will remove <strong>{userPortfolio.portfolio?.name || "the portfolio"}</strong> from{" "}
            <strong>{getUserName()}</strong>'s account.
            {userPortfolio.userAssets && userPortfolio.userAssets.length > 0 && (
              <> All {userPortfolio.userAssets.length} custom asset allocation(s) will be permanently deleted.</>
            )}
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Portfolio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}