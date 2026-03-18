

import { getPortfolios } from "@/actions/portfolios";
import PortfoliosClient from "./components/portfolio-client";

export default async function PortfoliosPage() {
  const res = await getPortfolios({ include: "assets" });
  const portfolios = res.data ?? [];
  return <PortfoliosClient initialPortfolios={portfolios} />;
}