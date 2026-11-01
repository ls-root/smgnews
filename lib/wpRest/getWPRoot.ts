const WP_JSON_SEGMENT = /\/wp-json(?:\/|$)/i;

/**
 * Returns the WordPress site root derived from NEXT_PUBLIC_WP_REST_ENDPOINT,
 * e.g. "http://localhost:8080/wp-json/wp/v2" -> "http://localhost:8080".
 */
export default async function getWPRoot(): Promise<string> {
  const endpoint = process.env.NEXT_PUBLIC_WP_REST_ENDPOINT
    ?.split(",")[0]
    ?.trim();

  if (!endpoint) {
    throw new Error("NEXT_PUBLIC_WP_REST_ENDPOINT is not defined");
  }

  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    throw new Error(`Invalid NEXT_PUBLIC_WP_REST_ENDPOINT: ${endpoint}`);
  }

  let basePath = "";

  const wpJsonMatch = url.pathname.match(WP_JSON_SEGMENT);
  if (wpJsonMatch?.index !== undefined) {
    // Everything before "/wp-json" is the site root 
    basePath = url.pathname.slice(0, wpJsonMatch.index);
  } else if (url.searchParams.has("rest_route")) {
    // Plain-permalink setups use ".../index.php?rest_route=/wp/v2".
    basePath = url.pathname;
  }

  // "index.php" is part of the REST route, not the site root.
  basePath = basePath.replace(/\/index\.php$/i, "");

  return `${url.origin}${basePath}`.replace(/\/+$/, "");
}
