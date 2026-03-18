// app/dashboard/topup-events/page.tsx
import { listTopupEvents } from "@/actions/topup-events";
import TopupEventsClient from "./components/topup-client";

export default async function TopupEventsPage() {
  const res = await listTopupEvents({ pageSize: 50 });
  const events = res.data ?? [];
  const meta   = res.meta  ?? null;
  return <TopupEventsClient initialEvents={events} initialMeta={meta} />;
}