"use client"

import { useState, useEffect } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,
} from "@/components/ui/command"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Loader2, Check, ChevronsUpDown, UploadCloud, FileText, Image as ImageIcon,
  X, CheckCircle,
} from "lucide-react"
import { createDeposit, type Deposit } from "@/actions/deposits"
import { getAllUsers } from "@/actions/auth"
import { cn } from "@/lib/utils"
import { UploadButton } from "@/lib/uploadthing"

type User = {
  id: string
  firstName?: string | null
  lastName?: string | null
  email: string
}

const PAYMENT_METHODS = [
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CASH",          label: "Cash Deposit" },
  { value: "CHEQUE",        label: "Cheque" },
  { value: "OTHER",         label: "Other" },
]

interface CreateDepositDialogProps {
  open:         boolean
  onOpenChange: (open: boolean) => void
  adminId:      string
  adminName:    string
  onSuccess:    (deposit: Deposit) => void
}

export function CreateDepositDialog({
  open, onOpenChange, adminId, adminName, onSuccess,
}: CreateDepositDialogProps) {
  const [isSubmitting,   setIsSubmitting]   = useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  const [users,          setUsers]          = useState<User[]>([])
  const [userOpen,       setUserOpen]       = useState(false)
  const [selectedUserId, setSelectedUserId] = useState("")

  const [amount,         setAmount]         = useState("")
  const [method,         setMethod]         = useState("")
  const [transactionId,  setTransactionId]  = useState("")
  const [referenceNo,    setReferenceNo]    = useState("")
  const [accountNo,      setAccountNo]      = useState("")
  const [accountName,    setAccountName]    = useState("")
  const [description,    setDescription]    = useState("")

  const [proofUrl,       setProofUrl]       = useState<string | null>(null)
  const [proofFileName,  setProofFileName]  = useState<string | null>(null)
  const [uploadingProof, setUploadingProof] = useState(false)

  const selectedUser = users.find(u => u.id === selectedUserId)
  const getUserName  = (u: User) =>
    [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email

  useEffect(() => {
    if (!open) return
    setIsLoadingUsers(true)
    getAllUsers()
      .then((res) => { if (res.data) setUsers(res.data) })
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setIsLoadingUsers(false))

    setSelectedUserId("")
    setAmount(""); setMethod(""); setTransactionId(""); setReferenceNo("")
    setAccountNo(""); setAccountName(""); setDescription("")
    setProofUrl(null); setProofFileName(null)
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    if (!selectedUserId) { toast.error("Please select a client."); return }
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) { toast.error("Please enter a valid amount."); return }

    setIsSubmitting(true)
    try {
      const result = await createDeposit(
        {
          userId:        selectedUserId,
          depositTarget: "MASTER",
          amount:        amt,
          method:        method        || null,
          transactionId: transactionId || null,
          referenceNo:   referenceNo   || null,
          accountNo:     accountNo     || null,
          description:   [description, accountName ? `Account Name: ${accountName}` : ""].filter(Boolean).join(" | ") || null,
          proofUrl:      proofUrl      ?? null,
          proofFileName: proofFileName ?? null,
        },
        { include: ["user", "masterWallet"] }
      )

      if (!result.success || !result.data) {
        toast.error(result.error || "Failed to create deposit")
        return
      }

      toast.success("Deposit registered successfully and is pending approval.")

      onSuccess(result.data)
      onOpenChange(false)
    } catch {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isPdf = proofFileName?.toLowerCase().endsWith(".pdf")
  const inputCls = "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white text-xl">
            Register New Deposit
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Record an external deposit on behalf of a client. The deposit will be PENDING until approved.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">

          {/* Deposited By (logged-in admin) */}
          <div className="space-y-1.5">
            <Label className="text-slate-700 dark:text-slate-300 font-medium">Deposited By</Label>
            <div className="flex items-center gap-3 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-700 dark:text-blue-400 font-semibold text-sm shrink-0">
                {adminName?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{adminName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Logged-in user</p>
              </div>
            </div>
          </div>

          {/* Client selector */}
          <div className="space-y-1.5">
            <Label className="text-slate-700 dark:text-slate-300 font-medium">
              Client <span className="text-rose-500">*</span>
            </Label>
            <Popover open={userOpen} onOpenChange={setUserOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  disabled={isLoadingUsers}
                >
                  {isLoadingUsers ? (
                    <span className="flex items-center gap-2 text-slate-400">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                    </span>
                  ) : selectedUser ? (
                    <span className="flex flex-col items-start text-left">
                      <span className="font-medium">{getUserName(selectedUser)}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{selectedUser.email}</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">Select client…</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <Command className="bg-transparent">
                  <CommandInput
                    placeholder="Search by name or email…"
                    className="text-slate-900 dark:text-white"
                  />
                  <CommandEmpty className="text-slate-500 dark:text-slate-400 text-sm py-4 text-center">
                    No user found.
                  </CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-y-auto">
                    {users.map((u) => (
                      <CommandItem
                        key={u.id}
                        value={`${getUserName(u)} ${u.email}`}
                        onSelect={() => { setSelectedUserId(u.id); setUserOpen(false) }}
                        className="text-slate-900 dark:text-white cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Check className={cn("mr-2 h-4 w-4 text-green-500", selectedUserId === u.id ? "opacity-100" : "opacity-0")} />
                        <div>
                          <p className="font-medium">{getUserName(u)}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-800" />

          {/* Amount + Method */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300 font-medium">
                Amount (USD) <span className="text-rose-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300 font-medium">Payment Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className={inputCls}>
                  <SelectValue placeholder="Select method…" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem
                      key={m.value}
                      value={m.value}
                      className="text-slate-900 dark:text-white"
                    >
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Transaction ID + Reference No */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300 font-medium">Transaction ID</Label>
              <Input
                placeholder="e.g. TXN123456"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className={cn(inputCls, "font-mono")}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300 font-medium">Reference Number</Label>
              <Input
                placeholder="e.g. REF-2025-001"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                className={cn(inputCls, "font-mono")}
              />
            </div>
          </div>

          {/* Account No + Bank Account Name (bank transfer only) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300 font-medium">Account Number</Label>
              <Input
                placeholder="Sender's account"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                className={inputCls}
              />
            </div>
            {method === "BANK_TRANSFER" && (
              <div className="space-y-1.5">
                <Label className="text-slate-700 dark:text-slate-300 font-medium">Bank Account Name</Label>
                <Input
                  placeholder="Name on bank account"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className={inputCls}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-slate-700 dark:text-slate-300 font-medium">Description / Notes</Label>
            <Textarea
              placeholder="Any additional notes about this deposit…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={cn(inputCls, "resize-none")}
            />
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-800" />

          {/* Proof of Payment Upload */}
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
              <UploadCloud className="h-4 w-4" />
              Proof of Payment (Receipt)
            </Label>
            <p className="text-xs text-slate-400 dark:text-slate-500">Upload a receipt image or PDF. Max 8 MB.</p>

            {proofUrl ? (
              <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10">
                <div className="flex items-center gap-3">
                  {isPdf ? (
                    <FileText className="h-8 w-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      {proofFileName || "Proof uploaded"}
                    </p>
                    <a
                      href={proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 dark:text-emerald-500 underline"
                    >
                      View file
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => { setProofUrl(null); setProofFileName(null) }}
                    className="text-slate-500 hover:text-slate-900 dark:hover:text-white h-7 w-7 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4 flex flex-col items-center gap-3">
                {uploadingProof ? (
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm">Uploading…</span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                      Drag & drop or click to upload a receipt (JPG, PNG, PDF)
                    </p>
                    <UploadButton
                      endpoint="depositProof"
                      onUploadBegin={() => setUploadingProof(true)}
                      onClientUploadComplete={(res) => {
                        setUploadingProof(false)
                        if (res?.[0]) {
                          setProofUrl(res[0].url)
                          setProofFileName(res[0].name)
                          toast.success("Receipt uploaded successfully")
                        }
                      }}
                      onUploadError={(error) => {
                        setUploadingProof(false)
                        toast.error(`Upload failed: ${error.message}`)
                      }}
                      appearance={{
                        button: "bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-sm px-4 py-2 rounded-md",
                        allowedContent: "text-slate-400 dark:text-slate-500 text-xs",
                      }}
                    />
                  </>
                )}
              </div>
            )}

            {proofUrl && !isPdf && (
              <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proofUrl}
                  alt="Proof of payment"
                  className="w-full object-contain max-h-48"
                />
              </div>
            )}
          </div>

          {/* Status note */}
          <div className="flex items-center gap-2 p-3 rounded-lg border border-yellow-400/40 bg-yellow-50 dark:border-yellow-500/30 dark:bg-yellow-500/10">
            <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-400/50 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30 shrink-0">
              PENDING
            </Badge>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              This deposit will be saved as <strong>Pending</strong>. You can review it and approve or reject it from the deposits list.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedUserId || !amount}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isSubmitting ? "Registering…" : "Register Deposit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
