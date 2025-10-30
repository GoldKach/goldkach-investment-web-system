"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for dropdowns - replace with actual database queries
const mockUserPortfolios = [
  { id: "1", name: "John's Growth Portfolio" },
  { id: "2", name: "Jane's Balanced Portfolio" },
  { id: "3", name: "Bob's Conservative Portfolio" },
]

const mockPortfolioAssets = [
  { id: "1", portfolioName: "Growth Portfolio", assetSymbol: "AAPL" },
  { id: "2", portfolioName: "Growth Portfolio", assetSymbol: "GOOGL" },
  { id: "3", portfolioName: "Balanced Portfolio", assetSymbol: "MSFT" },
]

interface UserPortfolioAssetFormProps {
  initialData?: {
    id: string
    userPortfolioId: string
    portfolioAssetId: string
    costPrice: number
    stock: number
    closeValue: number
    lossGain: number
  }
  mode: "create" | "edit"
}

export function UserPortfolioAssetForm({ initialData, mode }: UserPortfolioAssetFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    userPortfolioId: initialData?.userPortfolioId || "",
    portfolioAssetId: initialData?.portfolioAssetId || "",
    costPrice: initialData?.costPrice || 0,
    stock: initialData?.stock || 0,
    closeValue: initialData?.closeValue || 0,
    lossGain: initialData?.lossGain || 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Replace with actual API call
    console.log("Form data:", formData)

    if (mode === "create") {
      router.push("/user-portfolio-assets")
    } else {
      router.push(`/user-portfolio-assets/${initialData?.id}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "New User Portfolio Asset" : "Edit User Portfolio Asset"}</CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Fill in the details to create a new user portfolio asset"
            : "Update the user portfolio asset information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userPortfolioId">User Portfolio</Label>
            <Select
              value={formData.userPortfolioId}
              onValueChange={(value) => setFormData({ ...formData, userPortfolioId: value })}
              disabled={mode === "edit"}
            >
              <SelectTrigger id="userPortfolioId">
                <SelectValue placeholder="Select a user portfolio" />
              </SelectTrigger>
              <SelectContent>
                {mockUserPortfolios.map((up) => (
                  <SelectItem key={up.id} value={up.id}>
                    {up.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {mode === "edit" && (
              <p className="text-sm text-muted-foreground">User portfolio cannot be changed after creation</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolioAssetId">Portfolio Asset</Label>
            <Select
              value={formData.portfolioAssetId}
              onValueChange={(value) => setFormData({ ...formData, portfolioAssetId: value })}
              disabled={mode === "edit"}
            >
              <SelectTrigger id="portfolioAssetId">
                <SelectValue placeholder="Select a portfolio asset" />
              </SelectTrigger>
              <SelectContent>
                {mockPortfolioAssets.map((pa) => (
                  <SelectItem key={pa.id} value={pa.id}>
                    {pa.portfolioName} - {pa.assetSymbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {mode === "edit" && (
              <p className="text-sm text-muted-foreground">Portfolio asset cannot be changed after creation</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="costPrice">Cost Price</Label>
            <Input
              id="costPrice"
              type="number"
              step="0.01"
              placeholder="15000.00"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: Number.parseFloat(e.target.value) || 0 })}
              required
            />
            <p className="text-sm text-muted-foreground">
              Calculated as: asset.allocationPercentage × user.wallet.netAssetValue
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              step="0.01"
              placeholder="100.00"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number.parseFloat(e.target.value) || 0 })}
              required
            />
            <p className="text-sm text-muted-foreground">Calculated as: costPrice ÷ asset.costPerShare</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="closeValue">Close Value</Label>
            <Input
              id="closeValue"
              type="number"
              step="0.01"
              placeholder="17500.50"
              value={formData.closeValue}
              onChange={(e) => setFormData({ ...formData, closeValue: Number.parseFloat(e.target.value) || 0 })}
              required
            />
            <p className="text-sm text-muted-foreground">Calculated as: asset.closePrice × stock</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lossGain">Loss/Gain</Label>
            <Input
              id="lossGain"
              type="number"
              step="0.01"
              placeholder="2500.50"
              value={formData.lossGain}
              onChange={(e) => setFormData({ ...formData, lossGain: Number.parseFloat(e.target.value) || 0 })}
              required
            />
            <p className="text-sm text-muted-foreground">Calculated as: closeValue - costPrice</p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                  ? "Create User Portfolio Asset"
                  : "Update User Portfolio Asset"}
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
