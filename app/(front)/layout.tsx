import { Header } from "@/components/front-end/header";
import { Footer } from "@/components/front-end/footer";

export default function FrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
