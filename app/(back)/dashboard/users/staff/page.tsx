// // app/dashboard/staff/page.tsx
// import { Suspense } from "react";
// import { getAllStaffAction } from "@/actions/staff";
// import { TableLoading } from "@/components/ui/data-table";
// import StaffListing from "./components/staff-listing";

// async function StaffListingWithData() {
//   const result = await getAllStaffAction();

//   return (
//     <StaffListing
//       staff={result.data ?? []}
//       error={result.error}
//     />
//   );
// }

// export default function StaffPage() {
//   return (
//     <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
//       <Suspense fallback={<TableLoading />}>
//         <StaffListingWithData />
//       </Suspense>
//     </div>
//   );
// }





// app/dashboard/staff/page.tsx
import { Suspense } from "react";
import { getAllStaffAction } from "@/actions/staff";
import StaffListing from "./components/staff-listing";
import { getAllUsers } from "@/actions/auth";
import { CloudCog } from "lucide-react";

async function StaffListingWithData() {

 const r = await getAllUsers();
  const users = r.data;
 
  const allusers =users.filter((user: any) => user.role === "USER");

  console.log(allusers)

  const result = await getAllStaffAction();

  return (
    <StaffListing
      staff={result.data ?? []}
      error={result.error}
    />
  );
}

function StaffTableLoading() {
  return (
    <div className="space-y-4 p-12">
      <div className="h-8 w-48 rounded-lg bg-muted/50 animate-pulse" />
      <div className="rounded-xl border border-border overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0">
            <div className="h-9 w-9 rounded-full bg-muted/50 animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-32 rounded bg-muted/50 animate-pulse" />
              <div className="h-3 w-20 rounded bg-muted/30 animate-pulse" />
            </div>
            <div className="h-5 w-16 rounded-full bg-muted/50 animate-pulse" />
            <div className="h-5 w-24 rounded bg-muted/30 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StaffPage() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <Suspense fallback={<StaffTableLoading />}>
        <StaffListingWithData />
      </Suspense>
    </div>
  );
}