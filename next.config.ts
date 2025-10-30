import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://wp.fiosproject.de/wp-content/uploads/**")]
  }
};

export default nextConfig;
