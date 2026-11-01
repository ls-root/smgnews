/**
 * Returns all configured WordPress REST API endpoints.
 */
export function getWpEndpoints(): string[] {
  const endpoints = (process.env.NEXT_PUBLIC_WP_REST_ENDPOINT ?? "")
    .split(",")
    .map(endpoint => endpoint.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  if (endpoints.length === 0) {
    throw new Error("NEXT_PUBLIC_WP_REST_ENDPOINT is not defined");
  }

  return endpoints;
}

/**
 * Returns the main WordPress REST API endpoint (the first configured entry).
 */
export function getMainEndpoint(): string {
  return getWpEndpoints()[0];
}

export default getMainEndpoint;
