// app/dashboard/migrations/page.tsx
// Admin-only: run data migration to backfill existing portfolios
// to the new multi-portfolio dual-wallet structure

import MigrationsClient from "./components/migration-client";

export default async function MigrationsPage() {
  return <MigrationsClient />;
}