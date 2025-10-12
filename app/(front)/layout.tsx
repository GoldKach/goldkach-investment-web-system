import { Header } from "@/components/front-end/header";
import { Footer } from "@/components/front-end/footer";
import { getSession } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function FrontLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
      if (session && session.user.role=="ADMIN"){
        redirect("/dashboard")
      }  else if (session && session.user.role=="USER") redirect("/user");
  return (
    <>
      {children}
    </>
  );
}
