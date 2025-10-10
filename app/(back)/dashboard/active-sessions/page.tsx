import { ActiveSessions } from "@/components/back/active-sessions";

export default function ActiveSessionsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Active Sessions</h1>
        <p className="text-muted-foreground mt-2">Monitor and manage all active user sessions in real-time</p>
      </div>
      <ActiveSessions />
    </div>
  )
}
