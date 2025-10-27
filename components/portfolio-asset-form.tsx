// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // Mock data for portfolios and assets - replace with actual database query
// const mockPortfolios = [
//   { id: "1", name: "Growth Portfolio" },
//   { id: "2", name: "Balanced Portfolio" },
//   { id: "3", name: "Conservative Portfolio" },
// ]

// const mockAssets = [
//   { id: "1", symbol: "AAPL", description: "Apple Inc." },
//   { id: "2", symbol: "GOOGL", description: "Alphabet Inc." },
//   { id: "3", symbol: "MSFT", description: "Microsoft Corporation" },
//   { id: "4", symbol: "AMZN", description: "Amazon.com Inc." },
// ]

// interface PortfolioAssetFormProps {
//   initialData?: {
//     id: string
//     portfolioId: string
//     assetId: string
//     lossGain: number
//     closeValue: number
//     costPrice: number
//     stock: number
//   }
//   mode: "create" | "edit"
// }

// export function PortfolioAssetForm({ initialData, mode }: PortfolioAssetFormProps) {
//   const router = useRouter()
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const [formData, setFormData] = useState({
//     portfolioId: initialData?.portfolioId || "",
//     assetId: initialData?.assetId || "",
//     stock: initialData?.stock.toString() || "",
//     costPrice: initialData?.costPrice.toString() || "",
//     closeValue: initialData?.closeValue.toString() || "",
//     lossGain: initialData?.lossGain.toString() || "",
//   })

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     // TODO: Replace with actual API call
//     console.log("Form submitted:", formData)

//     // Redirect to portfolio assets list
//     router.push("/portfolio-assets")
//   }

//   const handleChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{mode === "create" ? "New Portfolio Asset" : "Edit Portfolio Asset"}</CardTitle>
//         <CardDescription>
//           {mode === "create" ? "Add a new asset to a portfolio" : "Update the portfolio asset details"}
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="portfolioId">Portfolio</Label>
//             <Select
//               value={formData.portfolioId}
//               onValueChange={(value) => handleChange("portfolioId", value)}
//               disabled={mode === "edit"}
//             >
//               <SelectTrigger id="portfolioId">
//                 <SelectValue placeholder="Select a portfolio" />
//               </SelectTrigger>
//               <SelectContent>
//                 {mockPortfolios.map((portfolio) => (
//                   <SelectItem key={portfolio.id} value={portfolio.id}>
//                     {portfolio.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="assetId">Asset</Label>
//             <Select
//               value={formData.assetId}
//               onValueChange={(value) => handleChange("assetId", value)}
//               disabled={mode === "edit"}
//             >
//               <SelectTrigger id="assetId">
//                 <SelectValue placeholder="Select an asset" />
//               </SelectTrigger>
//               <SelectContent>
//                 {mockAssets.map((asset) => (
//                   <SelectItem key={asset.id} value={asset.id}>
//                     {asset.symbol} - {asset.description}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="flex gap-4">
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Saving..." : mode === "create" ? "Create Portfolio Asset" : "Update Portfolio Asset"}
//             </Button>
//             <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
//               Cancel
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }



"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// ✅ Server action that posts to /portfolioassets
import { createPortfolioAsset } from "@/actions/portfolioassets"

type MinimalAsset = {
  id: string
  symbol: string
  description?: string | null
}

type MinimalPortfolio = {
  id: string
  name: string
}

interface PortfolioAssetFormProps {
  mode: "create" | "edit"
  assets?: MinimalAsset[] | null
  portfolios?: MinimalPortfolio[] | null
  initialData?: {
    id: string
    portfolioId: string
    assetId: string
  }
}

export function PortfolioAssetForm({
  mode,
  assets,
  portfolios,
  initialData,
}: PortfolioAssetFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Normalize to arrays so we never blow up on .map
  const assetOptions = useMemo(() => assets ?? [], [assets])
  const portfolioOptions = useMemo(() => portfolios ?? [], [portfolios])

  const [formData, setFormData] = useState({
    portfolioId: initialData?.portfolioId ?? "",
    assetId: initialData?.assetId ?? "",
  })

  const handleChange = (field: "portfolioId" | "assetId", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.portfolioId || !formData.assetId) {
      toast.error("Please select both a portfolio and an asset.")
      return
    }

    setIsSubmitting(true)
    try {
      if (mode === "create") {
        const res = await createPortfolioAsset({
          portfolioId: formData.portfolioId,
          assetId: formData.assetId,
        })
        if (!res.success) {
          toast.error(res.error || "Failed to add asset to portfolio.")
          return
        }
        toast.success("Asset added to portfolio.")
      } else {
        // If you want to support changing the link on edit, add an update endpoint.
        toast.info("Nothing to update — this form only links a portfolio and an asset.")
      }

      router.push("/dashboard/portfolioassets")
      router.refresh()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const noData = portfolioOptions.length === 0 || assetOptions.length === 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "New Portfolio Asset" : "Edit Portfolio Asset"}</CardTitle>
        <CardDescription>
          {mode === "create" ? "Add a new asset to a portfolio" : "Update the portfolio asset details"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="portfolioId">Portfolio</Label>
            <Select
              value={formData.portfolioId}
              onValueChange={(value) => handleChange("portfolioId", value)}
              disabled={isSubmitting || mode === "edit" || portfolioOptions.length === 0}
            >
              <SelectTrigger id="portfolioId">
                <SelectValue placeholder={portfolioOptions.length ? "Select a portfolio" : "No portfolios available"} />
              </SelectTrigger>
              <SelectContent>
                {portfolioOptions.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetId">Asset</Label>
            <Select
              value={formData.assetId}
              onValueChange={(value) => handleChange("assetId", value)}
              disabled={isSubmitting || mode === "edit" || assetOptions.length === 0}
            >
              <SelectTrigger id="assetId">
                <SelectValue placeholder={assetOptions.length ? "Select an asset" : "No assets available"} />
              </SelectTrigger>
              <SelectContent>
                {assetOptions.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.symbol} — {a.description ?? ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting || noData || !formData.portfolioId || !formData.assetId}>
              {isSubmitting ? "Saving..." : mode === "create" ? "Create Portfolio Asset" : "Update Portfolio Asset"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
