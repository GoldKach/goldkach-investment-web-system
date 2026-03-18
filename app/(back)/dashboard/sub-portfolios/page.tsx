// app/dashboard/sub-portfolios/page.tsx

import SubPortfoliosClient from "./components/subportfolio-client";


export default async function SubPortfoliosPage() {
  // Loads all sub-portfolios system-wide (admin view)
  // Pass userPortfolioId as a query param from the URL if filtering by portfolio
  return <SubPortfoliosClient />;
}