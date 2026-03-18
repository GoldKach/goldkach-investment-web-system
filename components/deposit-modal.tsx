// components/deposit-modal.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreditCard, AlertCircle, Banknote, Hash } from "lucide-react"

interface DepositModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: DepositFormData) => void
  isSubmitting?: boolean
  walletId: string
  user: {
    id: string
    walletId?: string
    wallet?: {
      accountNumber?: string
    }
  }
}

export interface DepositFormData {
  method: string
  amount: string
  transactionId: string
  userId: string
  walletId: string
}

export function DepositModal({ open, walletId, user, onOpenChange, onSubmit, isSubmitting }: DepositModalProps) {
  const [formData, setFormData] = useState<DepositFormData>({
    method: "",
    amount: "",
    transactionId: "",
    userId: user.id,
    walletId: walletId || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.walletId) {
      newErrors.walletId = "Wallet ID not found. Please contact support."
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    }

    if (parseFloat(formData.amount) < 10) {
      newErrors.amount = "Minimum deposit is $10"
    }

    if (!formData.method) {
      newErrors.method = "Please select a payment method"
    }

    if (!formData.transactionId) {
      newErrors.transactionId = "Transaction ID is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit?.(formData)
      // Reset form
      setFormData({
        method: "",
        amount: "",
        transactionId: "",
        userId: user.id,
        walletId: walletId || "",
      })
      setErrors({})
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col bg-slate-900 dark:bg-slate-900 bg-white border-slate-700 dark:border-slate-700 border-slate-200 text-white dark:text-white text-slate-900 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-700 dark:border-slate-700 border-slate-200">
          <DialogTitle className="text-2xl font-bold text-white dark:text-white text-slate-900">
            Create Deposit Request
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-slate-400 dark:text-slate-400 text-slate-600 text-sm mb-6">
            Fill in the details below to submit your deposit request
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Deposit Method */}
            <div>
              <Label htmlFor="method" className="text-slate-300 dark:text-slate-300 text-slate-700 mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Method <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.method} 
                onValueChange={(value) => handleChange("method", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-slate-800 dark:bg-slate-800 bg-slate-100 border-slate-700 dark:border-slate-700 border-slate-300 text-white dark:text-white text-slate-900">
                  <SelectValue placeholder="Choose payment method" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 dark:bg-slate-800 bg-white border-slate-700 dark:border-slate-700 border-slate-200 text-white dark:text-white text-slate-900">
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  {/* <SelectItem value="mobile_money">Mobile Money (MTN/Airtel)</SelectItem> */}
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                </SelectContent>
              </Select>
              {errors.method && (
                <p className="text-red-400 text-xs mt-1">{errors.method}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount" className="text-slate-300 dark:text-slate-300 text-slate-700 mb-2 flex items-center gap-2">
                <Banknote className="h-4 w-4" />
                Amount ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="10"
                placeholder="Enter amount (minimum $10)"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                className="bg-slate-800 dark:bg-slate-800 bg-slate-100 border-slate-700 dark:border-slate-700 border-slate-300 text-white dark:text-white text-slate-900 placeholder:text-slate-500"
                disabled={isSubmitting}
              />
              {errors.amount ? (
                <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
              ) : (
                <p className="text-slate-500 text-xs mt-1">Minimum deposit: $10</p>
              )}
            </div>

            {/* Transaction ID */}
            <div>
              <Label htmlFor="transactionId" className="text-slate-300 dark:text-slate-300 text-slate-700 mb-2 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Transaction ID / Reference <span className="text-red-500">*</span>
              </Label>
              <Input
                id="transactionId"
                type="text"
                placeholder="Enter transaction reference number"
                value={formData.transactionId}
                onChange={(e) => handleChange("transactionId", e.target.value)}
                className="bg-slate-800 dark:bg-slate-800 bg-slate-100 border-slate-700 dark:border-slate-700 border-slate-300 text-white dark:text-white text-slate-900 placeholder:text-slate-500"
                disabled={isSubmitting}
              />
              {errors.transactionId ? (
                <p className="text-red-400 text-xs mt-1">{errors.transactionId}</p>
              ) : (
                <p className="text-slate-500 text-xs mt-1">
                  Reference number from your bank/mobile money transfer
                </p>
              )}
            </div>

            {/* Account Number Display */}
            {user.wallet?.accountNumber && (
              <div className="p-4 bg-slate-800/50 dark:bg-slate-800/50 bg-slate-100 rounded-lg border border-slate-700 dark:border-slate-700 border-slate-200">
                <p className="text-slate-400 dark:text-slate-400 text-slate-600 text-xs mb-1">Depositing to Account:</p>
                <p className="text-white dark:text-white text-slate-900 font-mono text-lg">{user.wallet.accountNumber}</p>
              </div>
            )}

            {/* Important Notice */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <h4 className="text-amber-400 font-medium mb-2 flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                Important
              </h4>
              <ul className="space-y-1 text-slate-300 dark:text-slate-300 text-slate-700 text-xs">
                <li>• Complete payment before submitting this form</li>
                <li>• Keep your transaction ID safe</li>
                <li>• Processing takes 24-48 hours</li>
                <li>• Contact support if not approved within 48 hours</li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-2">
              <Button 
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-slate-700 dark:border-slate-700 border-slate-300 text-slate-400 dark:text-slate-400 text-slate-700 hover:text-white dark:hover:text-white hover:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-800 hover:bg-slate-100"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}