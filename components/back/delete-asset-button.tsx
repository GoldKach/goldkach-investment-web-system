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
import { toast } from "sonner"
import { deleteAsset } from "@/actions/assets"

type DeleteAssetButtonProps = {
  assetId: string
  assetSymbol: string
  variant?: "ghost" | "outline" | "destructive"
}

export function DeleteAssetButton({ assetId, assetSymbol, variant = "ghost" }: DeleteAssetButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
    await deleteAsset(assetId)
    //   await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Asset deleted successfully")

      setOpen(false)
      router.push("/dashboard/assets")
      router.refresh()
    } catch (error) {
      toast.error("An error occurred while deleting the asset. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {variant === "ghost" ? (
          <Button variant="ghost" size="icon" title="Delete asset">
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant={variant}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{assetSymbol}</strong> from your portfolio. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Asset"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
