// import AdminDashboard from '@/components/back/super-admin-dashboard';
// import { getDashboardStats } from '@/actions/dashboard';
// import { redirect } from 'next/navigation';

// export default async function DashboardPage() {
//   const result = await getDashboardStats();

//   if (!result.success) {
//     console.error("Failed to load dashboard data:", result.error);
//     // You might want to redirect to login or show an error page
//   }

//   return (
//     <div>
//       <AdminDashboard stats={result.data} />
//     </div>
//   );
// }









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