"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { deleteUserPortfolio } from "@/actions/user-portfolios"

interface DeleteUserPortfolioButtonProps {
  userPortfolioId: string
  userName: string
  portfolioName: string
}

export async function DeleteUserPortfolioButton({
  userPortfolioId,
  userName,
  portfolioName,
}: DeleteUserPortfolioButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    deleteUserPortfolio(userPortfolioId)
    // TODO: Replace with actual API call to delete user portfolio
    console.log("Deleting user portfolio:", userPortfolioId)

    // Close dialog and redirect
    setOpen(false)
    router.push("/dashboard/user-portfolios")
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Delete user portfolio">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User Portfolio Assignment?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove the portfolio assignment for <strong>{userName}</strong> from{" "}
            <strong>{portfolioName}</strong>? This action cannot be undone and will also delete all associated user
            portfolio assets.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
            Delete Assignment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
