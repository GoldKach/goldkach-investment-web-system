

// "use server";

// import { cookies } from "next/headers";

// const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

// async function authHeaderFromCookies(): Promise<HeadersInit> {
//   const jar = await cookies();
//   const token = jar.get("accessToken")?.value;
  
//   const headers: HeadersInit = {
//     "Content-Type": "application/json",
//   };
  
//   if (token) {
//     headers.Authorization = `Bearer ${token}`;
//   }
  
//   return headers;
// }

// export interface DashboardStats {
//   totalUsers: number;
//   activeUsers: number;
//   pendingUsers: number;
//   inactiveUsers: number;
//   totalPortfolios: number;
//   totalDeposits: number;
//   totalWithdrawals: number;
//   totalTransactions: number;
//   totalAUM: number;
//   pendingDeposits: number;
//   approvedDeposits: number;
//   pendingWithdrawals: number;
//   approvedWithdrawals: number;
// }

// export async function getDashboardStats(): Promise<{ success: boolean; data?: DashboardStats; error?: string }> {
//   try {
//     const headers = await authHeaderFromCookies();

//     // Fetch all data in parallel
//     const [usersRes, portfoliosRes, depositsRes, withdrawalsRes] = await Promise.all([
//       fetch(`${BASE_API_URL}/users`, { headers }),
//       fetch(`${BASE_API_URL}/user-portfolios`, { headers }),
//       fetch(`${BASE_API_URL}/deposits`, { headers }),
//       fetch(`${BASE_API_URL}/withdrawals`, { headers }),
//     ]);

//     const users = await usersRes.json();
//     const portfolios = await portfoliosRes.json();
//     const deposits = await depositsRes.json();
//     const withdrawals = await withdrawalsRes.json();

//     const usersData = users.data || [];
//     const portfoliosData = portfolios.data || [];
//     const depositsData = deposits.data || [];
//     const withdrawalsData = withdrawals.data || [];

//     // Calculate statistics
//     const stats: DashboardStats = {
//       totalUsers: usersData.length,
//       activeUsers: usersData.filter((u: any) => u.status === "ACTIVE").length,
//       pendingUsers: usersData.filter((u: any) => u.status === "PENDING").length,
//       inactiveUsers: usersData.filter((u: any) => u.status === "INACTIVE" || u.status === "DEACTIVATED").length,
      
//       totalPortfolios: portfoliosData.length,
      
//       totalDeposits: depositsData.reduce((sum: number, d: any) => sum + (d.amount || 0), 0),
//       totalWithdrawals: withdrawalsData.reduce((sum: number, w: any) => sum + (w.amount || 0), 0),
//       totalTransactions: depositsData.length + withdrawalsData.length,
      
//       pendingDeposits: depositsData.filter((d: any) => d.transactionStatus === "PENDING").length,
//       approvedDeposits: depositsData.filter((d: any) => d.transactionStatus === "APPROVED").length,
      
//       pendingWithdrawals: withdrawalsData.filter((w: any) => w.transactionStatus === "PENDING").length,
//       approvedWithdrawals: withdrawalsData.filter((w: any) => w.transactionStatus === "APPROVED").length,
      
//       totalAUM: portfoliosData.reduce((sum: number, p: any) => sum + (p.portfolioValue || 0), 0),
//     };

//     return { success: true, data: stats };
//   } catch (error: any) {
//     console.error("getDashboardStats error:", error);
//     return { success: false, error: error.message || "Failed to load dashboard statistics" };
//   }
// }







"use server";

import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

async function authHeaderFromCookies(): Promise<HeadersInit> {
  const jar = await cookies();
  const token = jar.get("accessToken")?.value;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  inactiveUsers: number;
  totalPortfolios: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalTransactions: number;
  totalAUM: number;
  pendingDeposits: number;
  approvedDeposits: number;
  pendingWithdrawals: number;
  approvedWithdrawals: number;
}

export interface MonthlyData {
  month: string;
  deposits: number;
  withdrawals: number;
  transactions: number;
  netFlow: number;
  aum: number;
  users: number;
}

export interface DashboardGraphData {
  monthlyTransactions: MonthlyData[];
  userGrowth: Array<{
    month: string;
    newUsers: number;
    activeUsers: number;
    totalUsers: number;
  }>;
  portfolioPerformance: Array<{
    range: string;
    count: number;
    color: string;
  }>;
}

export interface DashboardData {
  stats: DashboardStats;
  graphs: DashboardGraphData;
}

// Helper to get month name from date
function getMonthName(date: Date): string {
  return date.toLocaleString('en-US', { month: 'short' });
}

// Helper to group data by month
function groupByMonth(data: any[], dateField: string = 'createdAt') {
  const monthlyData = new Map<string, any[]>();
  
  data.forEach(item => {
    if (item[dateField]) {
      const date = new Date(item[dateField]);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, []);
      }
      monthlyData.get(monthKey)!.push(item);
    }
  });
  
  return monthlyData;
}

// Generate last 6 months of data
function generateMonthlyGraphData(
  depositsData: any[],
  withdrawalsData: any[],
  usersData: any[],
  portfoliosData: any[]
): MonthlyData[] {
  const months: MonthlyData[] = [];
  const now = new Date();
  
  // Group deposits and withdrawals by month
  const depositsByMonth = groupByMonth(depositsData);
  const withdrawalsByMonth = groupByMonth(withdrawalsData);
  const usersByMonth = groupByMonth(usersData);
  
  // Generate data for last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = getMonthName(date);
    
    const monthDeposits = depositsByMonth.get(monthKey) || [];
    const monthWithdrawals = withdrawalsByMonth.get(monthKey) || [];
    
    const depositsAmount = monthDeposits
      .filter((d: any) => d.transactionStatus === 'APPROVED')
      .reduce((sum: number, d: any) => sum + (d.amount || 0), 0);
    
    const withdrawalsAmount = monthWithdrawals
      .filter((w: any) => w.transactionStatus === 'APPROVED')
      .reduce((sum: number, w: any) => sum + (w.amount || 0), 0);
    
    const transactionCount = monthDeposits.length + monthWithdrawals.length;
    
    // Calculate AUM for this month (cumulative up to this month)
    const usersUpToMonth = usersData.filter((u: any) => {
      const userDate = new Date(u.createdAt);
      return userDate <= date;
    });
    
    const portfoliosUpToMonth = portfoliosData.filter((p: any) => {
      const portfolioDate = new Date(p.createdAt);
      return portfolioDate <= date;
    });
    
    const aumValue = portfoliosUpToMonth.reduce((sum: number, p: any) => sum + (p.portfolioValue || 0), 0);
    
    months.push({
      month: monthName,
      deposits: depositsAmount,
      withdrawals: withdrawalsAmount,
      transactions: transactionCount,
      netFlow: depositsAmount - withdrawalsAmount,
      aum: aumValue,
      users: usersUpToMonth.length,
    });
  }
  
  return months;
}

// Generate user growth data
function generateUserGrowthData(usersData: any[]): DashboardGraphData['userGrowth'] {
  const months: DashboardGraphData['userGrowth'] = [];
  const now = new Date();
  
  const usersByMonth = groupByMonth(usersData);
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = getMonthName(date);
    
    const newUsersThisMonth = usersByMonth.get(monthKey) || [];
    
    const usersUpToMonth = usersData.filter((u: any) => {
      const userDate = new Date(u.createdAt);
      return userDate <= date;
    });
    
    const activeUsersUpToMonth = usersUpToMonth.filter((u: any) => u.status === 'ACTIVE').length;
    
    months.push({
      month: monthName,
      newUsers: newUsersThisMonth.length,
      activeUsers: activeUsersUpToMonth,
      totalUsers: usersUpToMonth.length,
    });
  }
  
  return months;
}

// Generate portfolio performance distribution
function generatePortfolioPerformanceData(portfoliosData: any[]): DashboardGraphData['portfolioPerformance'] {
  const totalPortfolios = portfoliosData.length;
  
  if (totalPortfolios === 0) {
    return [
      { range: "< -10%", count: 0, color: "#dc2626" },
      { range: "-10% to -5%", count: 0, color: "#ea580c" },
      { range: "-5% to 0%", count: 0, color: "#d97706" },
      { range: "0% to 5%", count: 0, color: "#65a30d" },
      { range: "5% to 10%", count: 0, color: "#16a34a" },
      { range: "10% to 15%", count: 0, color: "#059669" },
      { range: "> 15%", count: 0, color: "#047857" },
    ];
  }
  
  // For now, use distribution percentages since we don't have performance data
  // In production, you'd calculate actual performance from portfolio data
  return [
    { range: "< -10%", count: Math.floor(totalPortfolios * 0.05), color: "#dc2626" },
    { range: "-10% to -5%", count: Math.floor(totalPortfolios * 0.08), color: "#ea580c" },
    { range: "-5% to 0%", count: Math.floor(totalPortfolios * 0.15), color: "#d97706" },
    { range: "0% to 5%", count: Math.floor(totalPortfolios * 0.28), color: "#65a30d" },
    { range: "5% to 10%", count: Math.floor(totalPortfolios * 0.25), color: "#16a34a" },
    { range: "10% to 15%", count: Math.floor(totalPortfolios * 0.15), color: "#059669" },
    { range: "> 15%", count: Math.floor(totalPortfolios * 0.04), color: "#047857" },
  ];
}

export async function getDashboardStats(): Promise<{ 
  success: boolean; 
  data?: DashboardStats; 
  error?: string 
}> {
  try {
    const headers = await authHeaderFromCookies();

    // Fetch all data in parallel
    const [usersRes, portfoliosRes, depositsRes, withdrawalsRes] = await Promise.all([
      fetch(`${BASE_API_URL}/users`, { headers }),
      fetch(`${BASE_API_URL}/user-portfolios`, { headers }),
      fetch(`${BASE_API_URL}/deposits`, { headers }),
      fetch(`${BASE_API_URL}/withdrawals`, { headers }),
    ]);

    const users = await usersRes.json();
    const portfolios = await portfoliosRes.json();
    const deposits = await depositsRes.json();
    const withdrawals = await withdrawalsRes.json();

    const usersData = users.data || [];
    const portfoliosData = portfolios.data || [];
    const depositsData = deposits.data || [];
    const withdrawalsData = withdrawals.data || [];

    // Calculate statistics
    const stats: DashboardStats = {
      totalUsers: usersData.length,
      activeUsers: usersData.filter((u: any) => u.status === "ACTIVE").length,
      pendingUsers: usersData.filter((u: any) => u.status === "PENDING").length,
      inactiveUsers: usersData.filter((u: any) => u.status === "INACTIVE" || u.status === "DEACTIVATED").length,
      
      totalPortfolios: portfoliosData.length,
      
      totalDeposits: depositsData.reduce((sum: number, d: any) => sum + (d.amount || 0), 0),
      totalWithdrawals: withdrawalsData.reduce((sum: number, w: any) => sum + (w.amount || 0), 0),
      totalTransactions: depositsData.length + withdrawalsData.length,
      
      pendingDeposits: depositsData.filter((d: any) => d.transactionStatus === "PENDING").length,
      approvedDeposits: depositsData.filter((d: any) => d.transactionStatus === "APPROVED").length,
      
      pendingWithdrawals: withdrawalsData.filter((w: any) => w.transactionStatus === "PENDING").length,
      approvedWithdrawals: withdrawalsData.filter((w: any) => w.transactionStatus === "APPROVED").length,
      
      totalAUM: portfoliosData.reduce((sum: number, p: any) => sum + (p.portfolioValue || 0), 0),
    };

    return { success: true, data: stats };
  } catch (error: any) {
    console.error("getDashboardStats error:", error);
    return { success: false, error: error.message || "Failed to load dashboard statistics" };
  }
}

export async function getDashboardData(): Promise<{ 
  success: boolean; 
  data?: DashboardData; 
  error?: string 
}> {
  try {
    const headers = await authHeaderFromCookies();

    // Fetch all data in parallel
    const [usersRes, portfoliosRes, depositsRes, withdrawalsRes] = await Promise.all([
      fetch(`${BASE_API_URL}/users`, { headers }),
      fetch(`${BASE_API_URL}/user-portfolios`, { headers }),
      fetch(`${BASE_API_URL}/deposits`, { headers }),
      fetch(`${BASE_API_URL}/withdrawals`, { headers }),
    ]);

    const users = await usersRes.json();
    const portfolios = await portfoliosRes.json();
    const deposits = await depositsRes.json();
    const withdrawals = await withdrawalsRes.json();

    const usersData = users.data || [];
    const portfoliosData = portfolios.data || [];
    const depositsData = deposits.data || [];
    const withdrawalsData = withdrawals.data || [];

    // Calculate statistics
    const stats: DashboardStats = {
      totalUsers: usersData.length,
      activeUsers: usersData.filter((u: any) => u.status === "ACTIVE").length,
      pendingUsers: usersData.filter((u: any) => u.status === "PENDING").length,
      inactiveUsers: usersData.filter((u: any) => u.status === "INACTIVE" || u.status === "DEACTIVATED").length,
      
      totalPortfolios: portfoliosData.length,
      
      totalDeposits: depositsData.reduce((sum: number, d: any) => sum + (d.amount || 0), 0),
      totalWithdrawals: withdrawalsData.reduce((sum: number, w: any) => sum + (w.amount || 0), 0),
      totalTransactions: depositsData.length + withdrawalsData.length,
      
      pendingDeposits: depositsData.filter((d: any) => d.transactionStatus === "PENDING").length,
      approvedDeposits: depositsData.filter((d: any) => d.transactionStatus === "APPROVED").length,
      
      pendingWithdrawals: withdrawalsData.filter((w: any) => w.transactionStatus === "PENDING").length,
      approvedWithdrawals: withdrawalsData.filter((w: any) => w.transactionStatus === "APPROVED").length,
      
      totalAUM: portfoliosData.reduce((sum: number, p: any) => sum + (p.portfolioValue || 0), 0),
    };

    // Generate graph data
    const graphs: DashboardGraphData = {
      monthlyTransactions: generateMonthlyGraphData(
        depositsData,
        withdrawalsData,
        usersData,
        portfoliosData
      ),
      userGrowth: generateUserGrowthData(usersData),
      portfolioPerformance: generatePortfolioPerformanceData(portfoliosData),
    };

    return { 
      success: true, 
      data: { stats, graphs } 
    };
  } catch (error: any) {
    console.error("getDashboardData error:", error);
    return { success: false, error: error.message || "Failed to load dashboard data" };
  }
}