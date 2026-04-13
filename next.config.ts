// // import type { NextConfig } from "next";

// // const nextConfig: NextConfig = {
// //   /* config options here */
// // };

// // export default nextConfig;



// // import type { NextConfig } from "next";

// // const nextConfig: NextConfig = {
// //   /* config options here */
// // };

// // export default nextConfig;





// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//    eslint: {
//     ignoreDuringBuilds: true,
//   },
//   // Suppress Node.js deprecation warnings from third-party packages (e.g. url.parse in axios)
//   serverExternalPackages: [],
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "**",
//       },
//       { protocol: "https", hostname: "utfs.io", pathname: "/f/**" },
//       {
//         protocol: "https",
//         hostname: "ylhpxhcgr4.ufs.sh",
//         pathname: "/f/**",
//       },
//     ],
//   },
// };

// export default nextConfig;





import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "44fdr4q6-3000.euw.devtunnels.ms",
        "44fdr4q6-8000.euw.devtunnels.ms",
      ],
    },
  },
  serverExternalPackages: [],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      { protocol: "https", hostname: "utfs.io", pathname: "/f/**" },
      {
        protocol: "https",
        hostname: "ylhpxhcgr4.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;