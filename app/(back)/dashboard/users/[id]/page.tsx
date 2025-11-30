import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import { getUserById } from "@/actions/auth"
import { UserDetailPreview } from "@/components/user/user-detail-view";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const u =await getUserById(id);

  const user= u.data;


  return (
    <div className="container px-4 mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        }
      >
        < UserDetailPreview user={user} />
      </Suspense>
    </div>
  )
}
