

// components/withdraw-modal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertCircle, DollarSign, CreditCard, Building2 } from "lucide-react";

interface WithdrawalModalProps {
  availableBalance: number;
  user: {
    id: string;
    walletId: string;
    accountNumber: string;
  };
  onSubmit?: (data: WithdrawalFormData) => void;
  isSubmitting?: boolean;
}

export interface WithdrawalFormData {
  walletId: string;
  userId: string;
  amount: string;
  referenceNo: string;
  method: string;
  bankName: string;
  bankAccountName: string;
  bankBranch: string;
  AccountNo: string;
  AccountName?: string;
  description?: string;
}

export function WithdrawalModal({
  availableBalance,
  user,
  onSubmit,
  isSubmitting,
}: WithdrawalModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<WithdrawalFormData>({
    walletId: user.walletId,
    userId: user.id,
    amount: "",
    referenceNo: user.accountNumber,
    method: "Bank Transfer",
    bankName: "",
    bankAccountName: "",
    bankBranch: "",
    AccountNo: user.accountNumber,
    AccountName: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.walletId || !formData.userId) {
      alert("Missing wallet/user information. Please contact support.");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    if (amount > availableBalance) {
      alert(`Insufficient balance. Available: $${availableBalance.toLocaleString()}`);
      return;
    }

    if (
      !formData.bankName.trim() ||
      !formData.bankAccountName.trim() ||
      !formData.bankBranch.trim() ||
      !formData.AccountName?.trim()
    ) {
      alert("Please fill in all required bank details.");
      return;
    }

    onSubmit?.(formData);

    // reset
    setFormData({
      walletId: user.walletId,
      userId: user.id,
      amount: "",
      referenceNo: user.accountNumber,
      method: "Bank Transfer",
      bankName: "",
      bankAccountName: "",
      bankBranch: "",
      AccountNo: user.accountNumber,
      AccountName: "",
      description: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          disabled={!user.walletId || availableBalance <= 0}
        >
          Create Withdrawal Request
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 p-6 [&>button]:text-slate-500 dark:[&>button]:text-slate-400">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white text-xl">
            Create Withdrawal Request
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Available Balance Display */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <Label className="text-slate-600 dark:text-slate-400 text-sm">Available Balance</Label>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  ${availableBalance.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <Label className="text-slate-600 dark:text-slate-400 text-sm">Account Number</Label>
                <p className="text-slate-900 dark:text-white font-mono text-sm mt-1">{user.accountNumber}</p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg">
            <h4 className="text-amber-700 dark:text-amber-400 font-medium mb-2 flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              Important
            </h4>
            <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-xs">
              <li>• Ensure all bank details are accurate</li>
              <li>• Withdrawal processing takes 2-5 business days</li>
              <li>• You cannot cancel after submission</li>
            </ul>
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount" className="text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4" />
              Withdrawal Amount <span className="text-red-500">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              max={availableBalance}
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Method & Reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="method" className="text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4" />
                Method <span className="text-red-500">*</span>
              </Label>
              <Input
                id="method"
                placeholder="e.g., Bank Transfer"
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                disabled={isSubmitting}
                required
              />
            </div>
            <div>
              <Label htmlFor="referenceNo" className="text-slate-900 dark:text-white mb-2 block">
                Reference No <span className="text-red-500">*</span>
              </Label>
              <Input
                id="referenceNo"
                placeholder="Reference number"
                value={formData.referenceNo}
                onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Bank Details Section */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-5">
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Bank Details
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName" className="text-slate-900 dark:text-white mb-2 block">
                    Bank Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bankName"
                    placeholder="e.g., STANBIC BANK"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bankBranch" className="text-slate-900 dark:text-white mb-2 block">
                    Bank Branch <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bankBranch"
                    placeholder="e.g., Main Branch"
                    value={formData.bankBranch}
                    onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bankAccountName" className="text-slate-900 dark:text-white mb-2 block">
                  Account Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bankAccountName"
                  placeholder="Account holder name"
                  value={formData.bankAccountName}
                  onChange={(e) =>
                    setFormData({ ...formData, bankAccountName: e.target.value })
                  }
                  className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <Label htmlFor="AccountNo" className="text-slate-900 dark:text-white mb-2 block">
                  Bank Account Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="AccountNo"
                  placeholder="Bank account number"
                  value={formData.AccountNo}
                  onChange={(e) => setFormData({ ...formData, AccountNo: e.target.value })}
                  className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  disabled={isSubmitting}
                  required
                />
                <p className="text-slate-500 text-xs mt-1">Default: {user.accountNumber}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-slate-900 dark:text-white mb-2 block">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Add any additional notes"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 min-h-[80px] resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Withdrawal Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}