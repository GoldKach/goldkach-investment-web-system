import { PriceHistoryManager } from "./components/price-history-manager";

export const dynamic = "force-dynamic";

export default function AssetPriceHistoryPage() {
  return (
    <div className="container mx-auto py-8 px-8 space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Asset Price History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Set correct historical close prices per date, then regenerate client reports with accurate data.
        </p>
      </div>
      <PriceHistoryManager />
    </div>
  );
}
