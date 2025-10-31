


// components/user-portfolio-asset-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPortfolioAsset } from "@/actions/portfolioassets";
import { toast } from "sonner";

type PortfolioOption = { id: string; name: string };
type AssetOption = {
  id: string;
  symbol: string;
  description?: string;
  sector?: string;
  costPerShare?: number;
  closePrice?: number;
};

interface UserPortfolioAssetFormProps {
  initialData?: {
    id: string;
    portfolioId: string;
    assetId: string;
  };
  mode: "create" | "edit";
  portfolios?: PortfolioOption[];
  assets?: AssetOption[];
}

export function UserPortfolioAssetForm({
  initialData,
  mode,
  portfolios = [],
  assets = [],
}: UserPortfolioAssetFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    portfolioId: initialData?.portfolioId || "",
    assetId: initialData?.assetId || "",
  });

  const selectedAsset = assets.find(a => a.id === formData.assetId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.portfolioId || !formData.assetId) {
      toast.error("Please select both a portfolio and an asset.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (mode === "create") {
        const res = await createPortfolioAsset(formData);
        if (!res.success) {
          toast.error(res.error || "Failed to add asset to portfolio.");
          setIsSubmitting(false);
          return;
        }
        toast.success("Asset linked to portfolio!");
        router.push("/dashboard/asset-allocation");
      } else {
        toast.success("Saved changes.");
        router.push(`/dashboard/user-portfolio-assets/${initialData?.id}`);
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "New User Portfolio Asset" : "Edit User Portfolio Asset"}</CardTitle>
        <CardDescription>Select the user portfolio and portfolio asset to link.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Portfolio */}
          <div className="space-y-2">
            <Label htmlFor="portfolioId">User Portfolio</Label>
            <Select
              value={formData.portfolioId}
              onValueChange={(value) => setFormData((p) => ({ ...p, portfolioId: value }))}
              disabled={mode === "edit"}
            >
              <SelectTrigger id="portfolioId">
                <SelectValue placeholder="Select a user portfolio" />
              </SelectTrigger>
              <SelectContent>
                {portfolios.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Asset */}
          <div className="space-y-2">
            <Label htmlFor="assetId">Portfolio Asset</Label>
            <Select
              value={formData.assetId}
              onValueChange={(value) => setFormData((p) => ({ ...p, assetId: value }))}
              disabled={mode === "edit"}
            >
              <SelectTrigger id="assetId">
                <SelectValue placeholder="Select an asset" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.symbol} — {a.description ?? "Asset"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Optional: show quick facts about the selected asset */}
            {selectedAsset && (
              <div className="text-sm text-muted-foreground mt-1">
                <div>Sector: {selectedAsset.sector ?? "—"}</div>
                <div>Cost/Share: {selectedAsset.costPerShare ?? "—"}</div>
                <div>Close Price: {selectedAsset.closePrice ?? "—"}</div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting || !formData.portfolioId || !formData.assetId}>
              {isSubmitting ? "Saving..." : mode === "create" ? "Allocate Asset" : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
