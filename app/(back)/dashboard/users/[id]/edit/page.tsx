import { Suspense } from "react"
import { UserEditForm } from "@/components/user-edit-form"
import { Spinner } from "@/components/ui/spinner"
import { getUserById } from "@/actions/auth";

export default async function UserEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const u =await getUserById(id);
  
    const user= u.data;
  
    console.log( "userds", user)

  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense
        fallback={
          <div className="flex min-h-[400px] items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        }
      >
        <UserEditForm user={user} />
      </Suspense>
    </div>
  )
}
