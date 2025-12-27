




import AdminDashboard from '@/components/back/super-admin-dashboard';
import { getDashboardData } from '@/actions/dashboard';

export default async function DashboardPage() {
  const result = await getDashboardData();

  if (!result.success) {
    console.error("Failed to load dashboard data:", result.error);
  }

  return (
    <div>
      <AdminDashboard 
        stats={result.data?.stats} 
        graphs={result.data?.graphs}
      />
    </div>
  );
}