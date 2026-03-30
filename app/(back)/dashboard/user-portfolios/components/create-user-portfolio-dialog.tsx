// components/back/create-user-portfolio-dialog.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2, Check, ChevronsUpDown, AlertCircle, Wallet, Ban } from "lucide-react"
import { cn } from "@/lib/utils"
import { createUserPortfolio } from "@/actions/user-portfolios"
import { getAllUsers } from "@/actions/auth"
import { getPortfolios } from "@/actions/portfolios"
import { getPortfolioAssets } from "@/actions/portfolioassets"
import { getMasterWalletByUser } from "@/actions/master-wallets"

type User = {
  id: string
  name?: string | null
  firstName?: string | null
  lastName?: string | null
  email: string
}

type Portfolio = {
  id: string
  name: string
  description?: string | null
  assets?: Array<{
    id: string
    portfolioId: string
    assetId: string
    defaultAllocationPercentage: number
    defaultCostPerShare: number
    stock: number
    costPrice: number
    closeValue: number
    lossGain: number
    asset: {
      id: string
      symbol: string
      description: string
      closePrice: number
      sector?: string
    }
  }>
}

type AssetAllocation = {
  assetId: string
  symbol: string
  description: string
  defaultAllocationPercentage: number
  defaultCostPerShare: number
  closePrice: number
  // User-specific values
  allocationPercentage: number
  costPerShare: number
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserPortfolioCreated: (userPortfolio: any) => void
}

export function CreateUserPortfolioDialog({ open, onOpenChange, onUserPortfolioCreated }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(false)

  const [users, setUsers] = useState<User[]>([])
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])

  const [selectedUserId, setSelectedUserId] = useState("")
  const [selectedPortfolioId, setSelectedPortfolioId] = useState("")
  const [amountInvested, setAmountInvested] = useState("")
  const [bankFee, setBankFee] = useState("30")
  const [transactionFee, setTransactionFee] = useState("10")
  const [feeAtBank, setFeeAtBank] = useState("10")
  const [assetAllocations, setAssetAllocations] = useState<AssetAllocation[]>([])

  const [userOpen, setUserOpen] = useState(false)
  const [portfolioOpen, setPortfolioOpen] = useState(false)

  // Master wallet balance for the selected user
  const [masterBalance, setMasterBalance] = useState<number | null>(null)
  const [loadingBalance, setLoadingBalance] = useState(false)

  // Load users and portfolios on mount
  useEffect(() => {
    if (open) {
      loadUsers()
      loadPortfolios()
      setAmountInvested("")
      setBankFee("30"); setTransactionFee("10"); setFeeAtBank("10")
      setMasterBalance(null)
    }
  }, [open])

  // Fetch master wallet balance when user changes
  useEffect(() => {
    if (!selectedUserId) { setMasterBalance(null); return }
    setLoadingBalance(true)
    getMasterWalletByUser(selectedUserId)
      .then((res) => {
        if (res.success && res.data) {
          setMasterBalance(Number(res.data.masterWallet?.balance ?? 0))
        } else {
          setMasterBalance(0)
        }
      })
      .catch(() => setMasterBalance(0))
      .finally(() => setLoadingBalance(false))
  }, [selectedUserId])

  // When portfolio is selected, populate asset allocations with defaults
  useEffect(() => {
    if (selectedPortfolioId) {
      const portfolio = portfolios.find(p => p.id === selectedPortfolioId)
      if (portfolio?.assets && portfolio.assets.length > 0) {
        const allocations: AssetAllocation[] = portfolio.assets.map(pa => ({
          assetId: pa.assetId,
          symbol: pa.asset.symbol,
          description: pa.asset.description,
          defaultAllocationPercentage: pa.defaultAllocationPercentage,
          defaultCostPerShare: pa.defaultCostPerShare,
          closePrice: pa.asset.closePrice,
          // Initialize with defaults - user can customize these
          allocationPercentage: pa.defaultAllocationPercentage,
          costPerShare: pa.defaultCostPerShare,
        }))
        setAssetAllocations(allocations)
      } else {
        // Portfolio has no assets
        setAssetAllocations([])
        toast.error("This portfolio has no assets. Please add assets to the portfolio first.", {
          duration: 5000,
        })
      }
    } else {
      setAssetAllocations([])
    }
  }, [selectedPortfolioId, portfolios])

  const loadUsers = async () => {
    setIsLoadingUsers(true)
    try {
      const res = await getAllUsers()
      if (res.data) {
        setUsers(res.data)
      }
    } catch (error) {
      toast.error("Failed to load users")
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const loadPortfolios = async () => {
    setIsLoadingPortfolios(true)
    try {
      const res = await getPortfolios()
      if (res.success && res.data) {
        // For each portfolio, fetch its portfolio assets
        const portfoliosWithAssets = await Promise.all(
          res.data.map(async (portfolio: any) => {
            try {
              // Fetch portfolio assets for this specific portfolio
              const assetsRes = await getPortfolioAssets(portfolio.id)
              
              if (assetsRes.success && assetsRes.data) {
                return {
                  ...portfolio,
                  assets: assetsRes.data || []
                }
              }
              return { ...portfolio, assets: [] }
            } catch (error) {
              console.error(`Failed to fetch assets for portfolio ${portfolio.id}:`, error)
              return { ...portfolio, assets: [] }
            }
          })
        )
        
        console.log('Portfolios with assets:', portfoliosWithAssets) // Debug log
        setPortfolios(portfoliosWithAssets)
      }
    } catch (error) {
      console.error('Failed to load portfolios:', error)
      toast.error("Failed to load portfolios")
    } finally {
      setIsLoadingPortfolios(false)
    }
  }

  const handleAllocationChange = (assetId: string, field: "allocationPercentage" | "costPerShare", value: string) => {
    setAssetAllocations(prev =>
      prev.map(a =>
        a.assetId === assetId
          ? { ...a, [field]: parseFloat(value) || 0 }
          : a
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!selectedUserId || !selectedPortfolioId) {
      toast.error("Please select both user and portfolio")
      return
    }

    if (assetAllocations.length === 0) {
      toast.error("Selected portfolio has no assets")
      return
    }

    const amount = parseFloat(amountInvested)
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount to invest.")
      return
    }
    if (masterBalance !== null && masterBalance <= 0) {
      toast.error("This user has no funds in their master wallet. Please deposit first.")
      return
    }
    if (masterBalance !== null && amount > masterBalance) {
      toast.error(`Amount exceeds available balance ($${masterBalance.toLocaleString()}).`)
      return
    }

    // Validate allocations
    const totalAllocation = assetAllocations.reduce((sum, a) => sum + a.allocationPercentage, 0)
    if (Math.abs(totalAllocation - 100) > 0.01 && totalAllocation > 0) {
      toast.warning(`Total allocation is ${totalAllocation.toFixed(2)}% (typically should be 100%)`)
    }

    setIsSubmitting(true)
    try {
      const payload = {
        userId:          selectedUserId,
        portfolioId:     selectedPortfolioId,
        customName:      selectedPortfolio?.name ?? "My Portfolio",
        amountInvested:  amount,
        bankFee:         parseFloat(bankFee)        || 30,
        transactionFee:  parseFloat(transactionFee) || 10,
        feeAtBank:       parseFloat(feeAtBank)      || 10,
        assetAllocations: assetAllocations.map(a => ({
          assetId:              a.assetId,
          allocationPercentage: a.allocationPercentage,
          costPerShare:         a.costPerShare,
        })),
      }

      const res = await createUserPortfolio(payload)

      if (!res.success) {
        toast.error(res.error || "Failed to create user portfolio")
        setIsSubmitting(false)
        return
      }

      toast.success("Portfolio assigned successfully with custom allocations")
      onUserPortfolioCreated(res.data)
      
      // Reset form
      setSelectedUserId("")
      setSelectedPortfolioId("")
      setAssetAllocations([])
    } catch (error) {
      console.error("Create user portfolio error:", error)
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getUserName = (user: User) => {
    if (user.name) return user.name
    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim()
    }
    return user.email
  }

  const selectedUser = users.find(u => u.id === selectedUserId)
  const selectedPortfolio = portfolios.find(p => p.id === selectedPortfolioId)
  const totalAllocation = assetAllocations.reduce((sum, a) => sum + a.allocationPercentage, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Assign Portfolio to User</DialogTitle>
          <DialogDescription className="text-base">
            Select a user and portfolio, then customize allocation percentages and cost basis for each asset
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Selection */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Select User *</Label>
            <Popover open={userOpen} onOpenChange={setUserOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={userOpen}
                  className="w-full justify-between"
                  disabled={isLoadingUsers}
                >
                  {isLoadingUsers ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading users...
                    </span>
                  ) : selectedUser ? (
                    <span>{getUserName(selectedUser)}</span>
                  ) : (
                    "Select user..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search users..." />
                  <CommandEmpty>No user found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={`${getUserName(user)} ${user.email}`}
                        onSelect={() => {
                          setSelectedUserId(user.id)
                          setUserOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedUserId === user.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{getUserName(user)}</span>
                          <span className="text-sm text-muted-foreground">{user.email}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Portfolio Selection */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Select Portfolio *</Label>
            <Popover open={portfolioOpen} onOpenChange={setPortfolioOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={portfolioOpen}
                  className="w-full justify-between"
                  disabled={isLoadingPortfolios}
                >
                  {isLoadingPortfolios ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading portfolios...
                    </span>
                  ) : selectedPortfolio ? (
                    <span>{selectedPortfolio.name}</span>
                  ) : (
                    "Select portfolio..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search portfolios..." />
                  <CommandEmpty>No portfolio found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {portfolios.map((portfolio) => (
                      <CommandItem
                        key={portfolio.id}
                        value={portfolio.name}
                        onSelect={() => {
                          setSelectedPortfolioId(portfolio.id)
                          setPortfolioOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedPortfolioId === portfolio.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{portfolio.name}</span>
                          {portfolio.description && (
                            <span className="text-sm text-muted-foreground">{portfolio.description}</span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Amount to Invest + Balance Guard */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Amount to Invest *</Label>

            {/* Balance banner */}
            {selectedUserId && (
              loadingBalance ? (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking available balance…
                </div>
              ) : masterBalance !== null && masterBalance <= 0 ? (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-amber-400 bg-amber-50 dark:bg-amber-950 text-sm text-amber-700 dark:text-amber-300">
                  <Ban className="h-4 w-4 shrink-0" />
                  No funds available — Please deposit to this account first before allocating to a portfolio.
                </div>
              ) : masterBalance !== null ? (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-green-400 bg-green-50 dark:bg-green-950 text-sm text-green-700 dark:text-green-300">
                  <Wallet className="h-4 w-4 shrink-0" />
                  Available master wallet balance: <span className="font-semibold">${masterBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              ) : null
            )}

            <Input
              type="number"
              step="0.01"
              min="0"
              max={masterBalance ?? undefined}
              value={amountInvested}
              onChange={(e) => setAmountInvested(e.target.value)}
              placeholder="0.00"
              disabled={!selectedUserId || loadingBalance || (masterBalance !== null && masterBalance <= 0)}
            />

            {masterBalance !== null && masterBalance > 0 && parseFloat(amountInvested) > masterBalance && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Amount exceeds available balance (${masterBalance.toLocaleString()}).
              </p>
            )}
          </div>

          {/* Fee Rates */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Fee Rates for This Portfolio</Label>
            <p className="text-sm text-muted-foreground">These fee rates apply specifically to this user's portfolio.</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="bankFee" className="text-sm">Bank Fee %</Label>
                <Input
                  id="bankFee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={bankFee}
                  onChange={(e) => setBankFee(e.target.value)}
                  placeholder="30"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="transactionFee" className="text-sm">Transaction Fee %</Label>
                <Input
                  id="transactionFee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={transactionFee}
                  onChange={(e) => setTransactionFee(e.target.value)}
                  placeholder="10"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="feeAtBank" className="text-sm">Fee at Bank %</Label>
                <Input
                  id="feeAtBank"
                  type="number"
                  step="0.01"
                  min="0"
                  value={feeAtBank}
                  onChange={(e) => setFeeAtBank(e.target.value)}
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Asset Allocations - This is where the magic happens! */}
          {selectedPortfolioId && assetAllocations.length === 0 && (
            <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="space-y-2">
                    <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                      This portfolio has no assets
                    </p>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Before you can assign this portfolio to a user, you need to add assets to it first.
                    </p>
                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onOpenChange(false)
                          // Navigate to portfolio management
                          window.location.href = "/dashboard/portfolios"
                        }}
                      >
                        Go to Portfolio Management
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {assetAllocations.length > 0 && (
            <Card className="border-2">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Customize Asset Allocations</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      💡 Set custom allocation percentages and cost basis for this specific user
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium text-muted-foreground">Total:</span>
                    <Badge 
                      variant={Math.abs(totalAllocation - 100) < 0.01 ? "default" : "destructive"}
                      className="text-lg px-4 py-1"
                    >
                      {totalAllocation.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {assetAllocations.map((allocation) => (
                  <div
                    key={allocation.assetId}
                    className="p-6 border-2 rounded-lg hover:border-primary/50 transition-colors space-y-4"
                  >
                    {/* Asset Header */}
                    <div className="flex items-center justify-between pb-3 border-b">
                      <div>
                        <div className="text-xl font-mono font-bold">{allocation.symbol}</div>
                        <div className="text-sm text-muted-foreground">{allocation.description}</div>
                      </div>
                      <Badge variant="outline" className="text-sm">
                        Current: ${allocation.closePrice.toFixed(2)}
                      </Badge>
                    </div>

                    {/* Allocation Grid */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Default Values Column */}
                      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                          Portfolio Defaults (Reference)
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">Default Allocation %</Label>
                            <div className="text-2xl font-bold">{allocation.defaultAllocationPercentage}%</div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Default Cost/Share</Label>
                            <div className="text-2xl font-bold">${allocation.defaultCostPerShare.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>

                      {/* User Custom Values Column */}
                      <div className="space-y-4 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                        <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">
                          User-Specific Values *
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`alloc-${allocation.assetId}`} className="text-sm font-semibold">
                              User Allocation %
                            </Label>
                            <Input
                              id={`alloc-${allocation.assetId}`}
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              value={allocation.allocationPercentage}
                              onChange={(e) =>
                                handleAllocationChange(allocation.assetId, "allocationPercentage", e.target.value)
                              }
                              className="text-xl font-bold h-12 mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`cost-${allocation.assetId}`} className="text-sm font-semibold">
                              User Cost/Share
                            </Label>
                            <Input
                              id={`cost-${allocation.assetId}`}
                              type="number"
                              step="0.01"
                              min="0"
                              value={allocation.costPerShare}
                              onChange={(e) =>
                                handleAllocationChange(allocation.assetId, "costPerShare", e.target.value)
                              }
                              className="text-xl font-bold h-12 mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {Math.abs(totalAllocation - 100) > 0.01 && totalAllocation > 0 && (
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
                    <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                    <span className="text-sm font-medium text-yellow-600">
                      Total allocation is {totalAllocation.toFixed(2)}%. Consider adjusting to 100%.
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={
              isSubmitting ||
              !selectedUserId ||
              !selectedPortfolioId ||
              loadingBalance ||
              (masterBalance !== null && masterBalance <= 0) ||
              (masterBalance !== null && parseFloat(amountInvested) > masterBalance)
            }>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Assigning..." : "Assign Portfolio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}