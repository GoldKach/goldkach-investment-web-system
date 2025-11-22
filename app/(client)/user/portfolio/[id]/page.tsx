// // app/portfolio/[id]/page.tsx
// import { getSession } from "@/actions/auth";
// import { getUserPortfolioById } from "@/actions/user-portfolios";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import { PortfolioDetailPage } from "../components/detailed";

// interface PortfolioDetailPageProps {
//   params: {
//     id: string;
//   };
// }

// export default async function PortfolioDetail({ params }: { params: Promise<{ id: string }> }) {
//     const { id } = await params
//   // Get session and handle authentication
//   const session = await getSession();
  
//   if (!session?.user) {
//     redirect("/login");
//   }

//   const userId = session.user.id;

//   // Fetch specific portfolio
//   const result = await getUserPortfolioById(id);

//   // Handle errors
//   if (result.error || !result.data) {
//     return (
//       <div className="p-6 flex items-center justify-center min-h-screen">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle>Portfolio Not Found</CardTitle>
//             <CardDescription>
//               {result.error || "Unable to load portfolio data. The portfolio may not exist or you don't have access to it."}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Link href="/portfolio">
//               <Button className="w-full">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Portfolios
//               </Button>
//             </Link>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // Verify user owns this portfolio
//   if (result.data.userId !== userId) {
//     return (
//       <div className="p-6 flex items-center justify-center min-h-screen">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle>Access Denied</CardTitle>
//             <CardDescription>
//               You don't have permission to view this portfolio.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Link href="/portfolio">
//               <Button className="w-full">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Portfolios
//               </Button>
//             </Link>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return <PortfolioDetailPage portfolioData={result.data} />;
// }



// app/portfolio/[id]/page.tsx
import { getSession } from "@/actions/auth";
import { getUserPortfolioById } from "@/actions/user-portfolios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UserPortfolioDetail } from "@/components/user-portfolio-detail";

interface PortfolioDetailPageParams {
  params: Promise<{ id: string }>;
}

export default async function PortfolioDetail({ params }: PortfolioDetailPageParams) {
  const { id } = await params;
  
  // Get session and handle authentication
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch specific portfolio
  const result = await getUserPortfolioById(id);
  console.log(result);

  // Handle errors
  if (result.error || !result.data) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Portfolio Not Found</CardTitle>
            <CardDescription>
              {result.error || "Unable to load portfolio data. The portfolio may not exist or you don't have access to it."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/portfolio">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portfolios
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verify user owns this portfolio
  if (result.data.userId !== userId) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to view this portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/portfolio">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portfolios
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <UserPortfolioDetail userPortfolio={result.data} />;
}