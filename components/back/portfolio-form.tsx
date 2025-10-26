

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { createPortfolio, CreatePortfolioInput, updatePortfolio } from "@/actions/portfolios"

// ⬇️ import your actions


type Portfolio = {
  id: string
  name: string
  description?: string | null
  timeHorizon: string
  riskTolerance: string
  allocationPercentage: number
}

type PortfolioFormProps = {
  portfolio?: Portfolio
  mode: "create" | "edit"
}

export function PortfolioForm({ portfolio, mode }: PortfolioFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: portfolio?.name || "",
    description: portfolio?.description || "",
    timeHorizon: portfolio?.timeHorizon || "",
    riskTolerance: portfolio?.riskTolerance || "",
    allocationPercentage: portfolio?.allocationPercentage?.toString() || "100",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      // Convert and validate number
      const alloc = Number.parseFloat(formData.allocationPercentage || "100")
      const allocationPercentage = Number.isFinite(alloc) ? alloc : 100
      if (allocationPercentage < 0 || allocationPercentage > 100) {
        toast.error("Allocation % must be between 0 and 100.")
        setIsSubmitting(false)
        return
      }

      const payload: CreatePortfolioInput = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        timeHorizon: formData.timeHorizon,
        riskTolerance: formData.riskTolerance,
        allocationPercentage:100, // optional on API, but we send the parsed number
      }

      const res =
        mode === "create"
          ? await createPortfolio(payload)
          : await updatePortfolio(portfolio!.id, payload)

      if (!res.success) {
        toast.error(res.error || "Failed to save portfolio.")
        setIsSubmitting(false)
        return
      }

      toast.success(mode === "create" ? "Portfolio created" : "Portfolio updated")
      router.push("/dashboard/portfolios")
      router.refresh()
    } catch (err) {
      toast.error("An error occurred while saving the portfolio. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Information</CardTitle>
        <CardDescription>
          {mode === "create" ? "Enter the details for the new portfolio" : "Update the portfolio information below"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Portfolio Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Growth Portfolio"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your portfolio strategy and goals"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timeHorizon">Time Horizon *</Label>
              <Select
                value={formData.timeHorizon}
                onValueChange={(value) => handleSelectChange("timeHorizon", value)}
                required
              >
                <SelectTrigger id="timeHorizon">
                  <SelectValue placeholder="Select time horizon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Short-term (1-5 years)">Short-term (1-5 years)</SelectItem>
                  <SelectItem value="Medium-term (5-10 years)">Medium-term (5-10 years)</SelectItem>
                  <SelectItem value="Long-term (10+ years)">Long-term (10+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskTolerance">Risk Tolerance *</Label>
              <Select
                value={formData.riskTolerance}
                onValueChange={(value) => handleSelectChange("riskTolerance", value)}
                required
              >
                <SelectTrigger id="riskTolerance">
                  <SelectValue placeholder="Select risk tolerance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="allocationPercentage">Allocation Percentage</Label>
            <Input
              id="allocationPercentage"
              name="allocationPercentage"
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="100.00"
              value={formData.allocationPercentage}
              onChange={handleChange}
            />
            <p className="text-sm text-muted-foreground">Percentage of total investment allocated to this portfolio</p>
          </div> */}

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create Portfolio"
                : "Update Portfolio"}
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
