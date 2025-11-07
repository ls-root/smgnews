import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(`https://wp.fiosproject.de/wp-content/uploads/**`),
      new URL("https://secure.gravatar.com/avatar/**"),
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        pathname: '/avatar/**',
        search: "?s=96&d=mm&r=g"
      },
    ]
  }
};

export default nextConfig;
