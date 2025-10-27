import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import { UserDetailView } from "@/components/user/user-detail-view"
import { getUserById } from "@/actions/auth"

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const u =await getUserById(id);

  const user= u.data;

  console.log( "userds", user)

  return (
    <div className="container px-4 mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        }
      >
        <UserDetailView user={user} />
      </Suspense>
    </div>
  )
}
