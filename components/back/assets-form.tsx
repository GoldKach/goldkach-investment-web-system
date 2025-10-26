// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { toast } from "sonner"

// type Asset = {
//   id: string
//   symbol: string
//   description: string
//   sector: string
//   allocationPercentage: number
//   costPerShare: number
//   closePrice: number
// }

// type AssetFormProps = {
//   asset?: Asset
//   mode: "create" | "edit"
// }

// export function AssetForm({ asset, mode }: AssetFormProps) {
//   const router = useRouter()
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const [formData, setFormData] = useState({
//     symbol: asset?.symbol || "",
//     description: asset?.description || "",
//     sector: asset?.sector || "",
//     allocationPercentage: asset?.allocationPercentage?.toString() || "0",
//     costPerShare: asset?.costPerShare?.toString() || "0",
//     closePrice: asset?.closePrice?.toString() || "0",
//   })

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubmitting(true)

//     try {
//       // Simulate API call - replace with actual database mutation
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       toast.success("success")

//       router.push("/assets")
//       router.refresh()
//     } catch (error) {
//       toast.error("An error occurred. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }))
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Asset Information</CardTitle>
//         <CardDescription>
//           {mode === "create" ? "Enter the details for the new asset" : "Update the asset information below"}
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="symbol">Symbol *</Label>
//             <Input
//               id="symbol"
//               name="symbol"
//               placeholder="e.g., AAPL"
//               value={formData.symbol}
//               onChange={handleChange}
//               required
//               className="font-mono"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description">Description *</Label>
//             <Textarea
//               id="description"
//               name="description"
//               placeholder="e.g., Apple Inc."
//               value={formData.description}
//               onChange={handleChange}
//               required
//               rows={3}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="sector">Sector *</Label>
//             <Input
//               id="sector"
//               name="sector"
//               placeholder="e.g., Technology"
//               value={formData.sector}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="grid gap-4 md:grid-cols-3">
//             <div className="space-y-2">
//               <Label htmlFor="allocationPercentage">Allocation %</Label>
//               <Input
//                 id="allocationPercentage"
//                 name="allocationPercentage"
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 max="100"
//                 placeholder="0.00"
//                 value={formData.allocationPercentage}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="costPerShare">Cost/Share</Label>
//               <Input
//                 id="costPerShare"
//                 name="costPerShare"
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 placeholder="0.00"
//                 value={formData.costPerShare}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="closePrice">Close Price</Label>
//               <Input
//                 id="closePrice"
//                 name="closePrice"
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 placeholder="0.00"
//                 value={formData.closePrice}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="flex gap-4 pt-4">
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting
//                 ? mode === "create"
//                   ? "Creating..."
//                   : "Updating..."
//                 : mode === "create"
//                   ? "Create Asset"
//                   : "Update Asset"}
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


"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createAsset, updateAsset } from "@/actions/assets";

type Asset = {
  id: string;
  symbol: string;
  description: string;
  sector: string;
  allocationPercentage: number;
  costPerShare: number;
  closePrice: number;
};

type AssetFormProps = {
  asset?: Asset;
  mode: "create" | "edit";
};

export function AssetForm({ asset, mode }: AssetFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    symbol: asset?.symbol || "",
    description: asset?.description || "",
    sector: asset?.sector || "",
    allocationPercentage: asset?.allocationPercentage?.toString() || "0",
    costPerShare: asset?.costPerShare?.toString() || "0",
    closePrice: asset?.closePrice?.toString() || "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Build payload (normalize + number conversion)
      const payload = {
        symbol: formData.symbol.trim().toUpperCase(),
        description: formData.description.trim(),
        sector: formData.sector.trim(),
        allocationPercentage: Number.parseFloat(formData.allocationPercentage || "0") || 0,
        costPerShare: Number.parseFloat(formData.costPerShare || "0") || 0,
        closePrice: Number.parseFloat(formData.closePrice || "0") || 0,
      };

      if (!payload.symbol || !payload.description || !payload.sector) {
        toast.error("Please fill in symbol, description and sector.");
        setIsSubmitting(false);
        return;
      }

      const res =
        mode === "create"
          ? await createAsset(payload)
          : await updateAsset(asset!.id, payload);

      if (!res.success) {
        toast.error(res.error || "Something went wrong.");
        setIsSubmitting(false);
        return;
      }

      toast.success(mode === "create" ? "Asset created." : "Asset updated.");
      router.push("/dashboard/assets");
      router.refresh();
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Information</CardTitle>
        <CardDescription>
          {mode === "create" ? "Enter the details for the new asset" : "Update the asset information below"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol *</Label>
            <Input
              id="symbol"
              name="symbol"
              placeholder="e.g., AAPL"
              value={formData.symbol}
              onChange={handleChange}
              required
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="e.g., Apple Inc."
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sector">Sector *</Label>
            <Input
              id="sector"
              name="sector"
              placeholder="e.g., Technology"
              value={formData.sector}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="allocationPercentage">Allocation %</Label>
              <Input
                id="allocationPercentage"
                name="allocationPercentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="0.00"
                value={formData.allocationPercentage}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPerShare">Cost/Share</Label>
              <Input
                id="costPerShare"
                name="costPerShare"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.costPerShare}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="closePrice">Close Price</Label>
              <Input
                id="closePrice"
                name="closePrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.closePrice}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create Asset"
                : "Update Asset"}
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
