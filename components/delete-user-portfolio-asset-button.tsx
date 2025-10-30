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

interface DeleteUserPortfolioAssetButtonProps {
  userPortfolioAssetId: string
  assetSymbol: string
  userPortfolioName: string
  variant?: "ghost" | "destructive"
}

export function DeleteUserPortfolioAssetButton({
  userPortfolioAssetId,
  assetSymbol,
  userPortfolioName,
  variant = "ghost",
}: DeleteUserPortfolioAssetButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Replace with actual API call
    console.log("Deleting user portfolio asset:", userPortfolioAssetId)

    router.push("/user-portfolio-assets")
    router.refresh()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {variant === "ghost" ? (
          <Button variant="ghost" size="icon" title="Delete user portfolio asset">
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the user portfolio asset <strong>{assetSymbol}</strong> from{" "}
            <strong>{userPortfolioName}</strong>. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
