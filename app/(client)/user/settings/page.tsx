// // app/user/settings/page.tsx
// import { redirect } from "next/navigation";
// import { fetchMe, getAllUsers, getSession } from "@/actions/auth";
// import { SettingsPageContent } from "./components/settings-page-component";

// export default async function SettingsPage() {
//  const session = await getSession();
//    const r = await getAllUsers();
//      const users = r.data;
   
//    const user = users?.find((u:any) => u.id === session?.user?.id);  
 
//    if (!session?.user) {
//      redirect("/login");
//    }
 
//    const userId = session.user.id;

//   // ✅ Just use fetchMe - it already works!
// //   const result = await fetchMe();

//   if (!user) {
//     return (
//       <div className="p-6 flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
//             Error Loading Settings
//           </h1>
//           <p className="text-slate-600 dark:text-slate-400">
//             Unable to load your profile. Please try logging in again.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return <SettingsPageContent user={user} />;
// }



// app/user/settings/page.tsx
import { redirect } from "next/navigation";
import { getAllUsers, getSession } from "@/actions/auth";
import { SettingsPageContent } from "./components/settings-page-component";

export default async function SettingsPage() {
  // 1. Session check first
  const session = await getSession();
  if (!session?.user) redirect("/login");

  // 2. Get full user data (with wallet etc.) same pattern as dashboard layout
  const r = await getAllUsers();
  const users = r?.data;
  const user = users?.find((u: any) => u.id === session.user.id);

  if (!user) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Error Loading Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Unable to load your profile. Please try logging in again.
          </p>
        </div>
      </div>
    );
  }

  return <SettingsPageContent user={user} />;
}