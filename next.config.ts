import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(`https://wp.fiosproject.de/wp-content/uploads/**`),
      new URL("https://secure.gravatar.com/avatar/**"),
      new URL("https://localhost:8080/wp-content/uploads/**"),
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        pathname: '/avatar/**',
        search: "?s=96&d=mm&r=g"
      }
    ]
  },
  output: "standalone"
};

export default nextConfig;
