import type { NextConfig } from "next";

function parseUrl(value: string | undefined) {
  try {
    return value ? new URL(value) : undefined;
  } catch {
    return undefined;
  }
}

const wp = parseUrl(process.env.WP_HOME) ?? new URL("http://localhost:8080");

const wpHosts = new Map<string, URL>();
wpHosts.set(`${wp.hostname}:${wp.port}`, wp);

for (const endpoint of (process.env.NEXT_PUBLIC_WP_REST_ENDPOINT ?? "").split(",")) {
  const url = parseUrl(endpoint.trim());
  if (url) wpHosts.set(`${url.hostname}:${url.port}`, url);
}

const wpImagePatterns = [...wpHosts.values()].flatMap((url) => {
  const host = {
    hostname: url.hostname,
    ...(url.port ? { port: url.port } : {}),
    pathname: "/**" as const,
  };

  return [
    { protocol: "http" as const, ...host },
    { protocol: "https" as const, ...host },
  ];
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...wpImagePatterns,
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/avatar/**",
      }
    ]
  },
  output: "standalone"
};

export default nextConfig;
