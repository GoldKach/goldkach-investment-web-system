


// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//     output: 'standalone', // This is important for Docker!
    
//    eslint: {
//     // Warning: This allows production builds to successfully complete even if
//     // your project has ESLint errors.
//     ignoreDuringBuilds: true,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "**",
//       },
//             { protocol: "https", hostname: "utfs.io", pathname: "/f/**" },

//       {
//         protocol: "https",
//         hostname: "ylhpxhcgr4.ufs.sh",
//         pathname: "/f/**",
//       },
//             { protocol: "https", hostname: "utfs.io", pathname: "/f/**" },

//     ],
//   },
// };

// export default nextConfig;





import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove output: 'standalone' - it causes Windows symlink issues
  
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      { 
        protocol: "https", 
        hostname: "utfs.io", 
        pathname: "/f/**" 
      },
      {
        protocol: "https",
        hostname: "ylhpxhcgr4.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;