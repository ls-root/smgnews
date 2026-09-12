import type { NextConfig } from "next";

function wpUrl() {
  try {
    return new URL(process.env.WP_HOME ?? "http://localhost:8080");
  } catch {
    return new URL("http://localhost:8080");
  }
}

const wp = wpUrl();
const wpHost = {
  hostname: wp.hostname,
  ...(wp.port ? { port: wp.port } : {}),
  pathname: "/**" as const,
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", ...wpHost },
      { protocol: "https", ...wpHost },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/avatar/**",
      },
    ]
  },
  output: "standalone"
};

export default nextConfig;
