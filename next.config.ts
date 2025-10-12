// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;



// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;





import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
            { protocol: "https", hostname: "utfs.io", pathname: "/f/**" },

      {
        protocol: "https",
        hostname: "ylhpxhcgr4.ufs.sh",
        pathname: "/f/**",
      },
            { protocol: "https", hostname: "utfs.io", pathname: "/f/**" },

    ],
  },
};

export default nextConfig;
