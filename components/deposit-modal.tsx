"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Copy, Check } from "lucide-react"

interface DepositModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: DepositFormData) => void
}

export interface DepositFormData {
  method: string
  amount: string
  transactionId: string
}

const bankDetails = {
  bankName: "STANBIC BANK UGANDA LIMITED",
  accountName: "GoldKach Uganda Ltd",
  accountNumberUGX: "9030024940933",
  accountNumberUSD: "9030024940992",
  swiftCode: "SBICUGKK",
  address: "Plot 17 HANNINGTON ROAD, CRESTED TOWERS, SHORT ...",
}

export function DepositModal({ open, onOpenChange, onSubmit }: DepositModalProps) {
  const [formData, setFormData] = useState<DepositFormData>({
    method: "",
    amount: "",
    transactionId: "",
  })
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    setFormData({ method: "", amount: "", transactionId: "" })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-h-screen overflow-hidden bg-slate-950 border-slate-800 flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white"></DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 p-2 flex-1 min-h-0 overflow-hidden">
          {/* Left Side - Deposit Form */}
          <div className="border border-slate-700 rounded-lg p-2 bg-slate-900 overflow-y-auto">
            <h2 className="text-white text-lg font-semibold mb-2">Deposit Funds</h2>
            <p className="text-slate-400 text-sm mb-6">Choose method and enter amount</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Deposit Method</label>
                <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Choose method" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Amount</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Transaction ID</label>
                <Input
                  type="text"
                  placeholder="Enter transaction ID"
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2">
                Submit
              </Button>
            </form>
          </div>

          {/* Right Side - Bank Transfer Instructions */}
          <div className="border border-slate-700 rounded-lg p-6 bg-slate-900 overflow-y-auto">
            <h2 className="text-white text-lg font-semibold mb-6">Deposit Instructions</h2>

            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm font-medium">Bank Name</label>
                <div className="flex items-center justify-between bg-slate-800 rounded p-3 mt-2">
                  <span className="text-white text-sm">{bankDetails.bankName}</span>
                  <button
                    onClick={() => handleCopy(bankDetails.bankName, "bank")}
                    className="text-slate-400 hover:text-white transition"
                  >
                    {copiedField === "bank" ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-sm font-medium">Account Name</label>
                <div className="flex items-center justify-between bg-slate-800 rounded p-3 mt-2">
                  <span className="text-white text-sm">{bankDetails.accountName}</span>
                  <button
                    onClick={() => handleCopy(bankDetails.accountName, "account")}
                    className="text-slate-400 hover:text-white transition"
                  >
                    {copiedField === "account" ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-sm font-medium">Account Number (UGX)</label>
                <div className="flex items-center justify-between bg-slate-800 rounded p-3 mt-2">
                  <span className="text-white text-sm">{bankDetails.accountNumberUGX}</span>
                  <button
                    onClick={() => handleCopy(bankDetails.accountNumberUGX, "ugx")}
                    className="text-slate-400 hover:text-white transition"
                  >
                    {copiedField === "ugx" ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-sm font-medium">Account Number (USD)</label>
                <div className="flex items-center justify-between bg-slate-800 rounded p-3 mt-2">
                  <span className="text-white text-sm">{bankDetails.accountNumberUSD}</span>
                  <button
                    onClick={() => handleCopy(bankDetails.accountNumberUSD, "usd")}
                    className="text-slate-400 hover:text-white transition"
                  >
                    {copiedField === "usd" ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-sm font-medium">Swift Code</label>
                <div className="flex items-center justify-between bg-slate-800 rounded p-3 mt-2">
                  <span className="text-white text-sm">{bankDetails.swiftCode}</span>
                  <button
                    onClick={() => handleCopy(bankDetails.swiftCode, "swift")}
                    className="text-slate-400 hover:text-white transition"
                  >
                    {copiedField === "swift" ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-sm font-medium">Address</label>
                <div className="flex items-center justify-between bg-slate-800 rounded p-3 mt-2">
                  <span className="text-white text-sm">{bankDetails.address}</span>
                  <button
                    onClick={() => handleCopy(bankDetails.address, "address")}
                    className="text-slate-400 hover:text-white transition"
                  >
                    {copiedField === "address" ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
