"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import {
  ArrowUpRight,
  TrendingUp,
  Wallet,
  DollarSign,
  Activity,
  Shield,
  Target,
  Briefcase,
  CreditCard,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data based on the Prisma schema
const portfolioData = [
  { date: "Jan", value: 45000, deposits: 5000, withdrawals: 2000 },
  { date: "Feb", value: 48000, deposits: 3000, withdrawals: 1500 },
  { date: "Mar", value: 52000, deposits: 6000, withdrawals: 2500 },
  { date: "Apr", value: 49000, deposits: 2000, withdrawals: 5000 },
  { date: "May", value: 55000, deposits: 8000, withdrawals: 2000 },
  { date: "Jun", value: 58500, deposits: 4500, withdrawals: 1000 },
]

const assetAllocation = [
  { name: "Technology", value: 35, amount: 20475 },
  { name: "Healthcare", value: 25, amount: 14625 },
  { name: "Finance", value: 20, amount: 11700 },
  { name: "Energy", value: 12, amount: 7020 },
  { name: "Consumer", value: 8, amount: 4680 },
]

const assetPerformance = [
  { symbol: "AAPL", costPrice: 5000, closeValue: 6200, lossGain: 1200, percentage: 24 },
  { symbol: "MSFT", costPrice: 4500, closeValue: 5100, lossGain: 600, percentage: 13.3 },
  { symbol: "GOOGL", costPrice: 3800, closeValue: 4100, lossGain: 300, percentage: 7.9 },
  { symbol: "JNJ", costPrice: 4200, closeValue: 4050, lossGain: -150, percentage: -3.6 },
  { symbol: "XOM", costPrice: 3000, closeValue: 2850, lossGain: -150, percentage: -5 },
]

const recentTransactions = [
  { id: "1", type: "Deposit", amount: 4500, status: "APPROVED", date: "2024-01-15", method: "Bank Transfer" },
  { id: "2", type: "Withdrawal", amount: 1000, status: "APPROVED", date: "2024-01-14", method: "Bank Transfer" },
  { id: "3", type: "Deposit", amount: 8000, status: "PENDING", date: "2024-01-13", method: "Mobile Money" },
  { id: "4", type: "Withdrawal", amount: 2000, status: "APPROVED", date: "2024-01-12", method: "Bank Transfer" },
]

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

const userData = {
  id: "user_123",
  name: "John Doe",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  imageUrl: "https://ylhpxhcgr4.ufs.sh/f/ZVlDsNdibGfFLkXm6f8jxEOgRvuoCGdTw7N05shB2kHlF1LU",
  role: "USER",
  status: "ACTIVE",
  isApproved: true,
  createdAt: "2024-01-01",
}

const entityOnboardingData = {
  entityType: "individual",
  fullName: "John Doe",
  dateOfBirth: "1990-05-15",
  tin: "123-45-6789",
  homeAddress: "123 Main St, New York, NY 10001",
  employmentStatus: "Employed",
  occupation: "Software Engineer",
  companyName: "Tech Corp",
  primaryGoal: "Long-term wealth accumulation",
  timeHorizon: "10+ years",
  riskTolerance: "Moderate",
  investmentExperience: "Intermediate",
  isPEP: "No",
  sourceOfWealth: "Employment Income",
  expectedInvestment: "$50,000 - $100,000",
  isApproved: true,
}

const walletData = {
  id: "wallet_123",
  accountNumber: "ACC-2024-001234",
  balance: 58500,
  bankFee: 30,
  transactionFee: 10,
  feeAtBank: 10,
  totalFees: 50,
  netAssetValue: 58350,
  status: "ACTIVE",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-15",
}

export function DashboardContent() {
  const totalBalance = walletData.balance
  const netAssetValue = walletData.netAssetValue
  const totalDeposits = 28500
  const totalWithdrawals = 11500
  const portfolioChange = 5500
  const portfolioChangePercent = 10.4

  return (
    <div className="flex-1 space-y-6 p-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Wallet balance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Asset Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${netAssetValue.toLocaleString()}</div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUpRight className="mr-1 h-3 w-3" />+{portfolioChangePercent}% ($
                  {portfolioChange.toLocaleString()})
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalDeposits.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time deposits</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalWithdrawals.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time withdrawals</p>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Your portfolio value over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: "Portfolio Value",
                    color: "hsl(var(--chart-1))",
                  },
                  deposits: {
                    label: "Deposits",
                    color: "hsl(var(--chart-2))",
                  },
                  withdrawals: {
                    label: "Withdrawals",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={portfolioData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-value)"
                      fill="var(--color-value)"
                      fillOpacity={0.2}
                      name="Portfolio Value"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Deposits vs Withdrawals Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Deposits vs Withdrawals</CardTitle>
              <CardDescription>Monthly transaction trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  deposits: {
                    label: "Deposits",
                    color: "hsl(var(--chart-2))",
                  },
                  withdrawals: {
                    label: "Withdrawals",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={portfolioData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="deposits"
                      stroke="var(--color-deposits)"
                      strokeWidth={2}
                      name="Deposits"
                    />
                    <Line
                      type="monotone"
                      dataKey="withdrawals"
                      stroke="var(--color-withdrawals)"
                      strokeWidth={2}
                      name="Withdrawals"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Asset Allocation Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Distribution across sectors</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Allocation",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetAllocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {assetAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Asset Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Performance</CardTitle>
                <CardDescription>Gain/Loss by asset</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    lossGain: {
                      label: "Gain/Loss",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={assetPerformance}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="symbol" className="text-xs" />
                      <YAxis className="text-xs" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="lossGain" name="Gain/Loss ($)" radius={[4, 4, 0, 0]}>
                        {assetPerformance.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.lossGain >= 0 ? "hsl(var(--chart-2))" : "hsl(var(--destructive))"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Asset Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Assets</CardTitle>
              <CardDescription>Detailed breakdown of your holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assetPerformance.map((asset) => (
                  <div key={asset.symbol} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{asset.symbol}</p>
                      <p className="text-xs text-muted-foreground">
                        Cost: ${asset.costPrice.toLocaleString()} • Current: ${asset.closeValue.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-semibold ${asset.lossGain >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {asset.lossGain >= 0 ? "+" : ""}${asset.lossGain.toLocaleString()}
                      </div>
                      <div className={`text-xs ${asset.percentage >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {asset.percentage >= 0 ? "+" : ""}
                        {asset.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Wallet Details
              </CardTitle>
              <CardDescription>Account information and fee breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Account Number</p>
                  <p className="font-mono text-lg font-semibold">{walletData.accountNumber}</p>
                  <Badge variant={walletData.status === "ACTIVE" ? "default" : "secondary"}>{walletData.status}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-2xl font-bold">${walletData.balance.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Available funds</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Net Asset Value</p>
                  <p className="text-2xl font-bold">${walletData.netAssetValue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">After fees</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Fees</p>
                  <p className="text-2xl font-bold">${walletData.totalFees.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">All charges</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-medium mb-4">Fee Breakdown</p>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Bank Fee</span>
                    <span className="font-semibold">${walletData.bankFee}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Transaction Fee</span>
                    <span className="font-semibold">${walletData.transactionFee}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Fee at Bank</span>
                    <span className="font-semibold">${walletData.feeAtBank}</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Last updated: {new Date(walletData.updatedAt).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest deposits and withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{transaction.type}</p>
                        <Badge
                          variant={transaction.status === "APPROVED" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {transaction.method} • {transaction.date}
                      </p>
                    </div>
                    <div
                      className={`text-sm font-semibold ${transaction.type === "Deposit" ? "text-green-600" : "text-red-600"}`}
                    >
                      {transaction.type === "Deposit" ? "+" : "-"}${transaction.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={userData.imageUrl || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback>
                      {userData.firstName[0]}
                      {userData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-semibold">{userData.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={userData.status === "ACTIVE" ? "default" : "secondary"}>{userData.status}</Badge>
                      {userData.isApproved && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Shield className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{userData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{userData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Since:</span>
                    <span className="font-medium">{new Date(userData.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investment Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Investment Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Primary Goal</p>
                  <p className="font-medium">{entityOnboardingData.primaryGoal}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Time Horizon</p>
                    <Badge variant="outline">{entityOnboardingData.timeHorizon}</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground">Risk Tolerance</p>
                    <Badge variant="outline">{entityOnboardingData.riskTolerance}</Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Experience Level</p>
                  <p className="font-medium">{entityOnboardingData.investmentExperience}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Expected Investment</p>
                  <p className="font-medium">{entityOnboardingData.expectedInvestment}</p>
                </div>
              </CardContent>
            </Card>

            {/* KYC/Onboarding Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  KYC Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Entity Type</span>
                  <Badge>{entityOnboardingData.entityType}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Employment</p>
                  <p className="font-medium">{entityOnboardingData.occupation}</p>
                  <p className="text-xs text-muted-foreground">{entityOnboardingData.companyName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Source of Wealth</p>
                  <p className="font-medium">{entityOnboardingData.sourceOfWealth}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">TIN</p>
                  <p className="font-mono text-xs">{entityOnboardingData.tin}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-muted-foreground">PEP Status</span>
                  <Badge variant={entityOnboardingData.isPEP === "No" ? "outline" : "destructive"}>
                    {entityOnboardingData.isPEP}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
