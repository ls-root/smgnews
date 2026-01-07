import { WpApiRoot } from "@/types/wpRest/WpApiRoot";

export default async function getWPRoot() {
  if (!process.env.NEXT_PUBLIC_WP_REST_ENDPOINT) {
    throw new Error("NEXT_PUBLIC_WP_REST_ENDPOINT is not defined");
  }

  const wpResponse = await fetch(process.env.NEXT_PUBLIC_WP_REST_ENDPOINT)

  if (!wpResponse.ok) {
    throw new Error(`Failed to fetch WP root: ${wpResponse.status} ${wpResponse.statusText}`)
  }

  const wpAPIRoot: WpApiRoot = await wpResponse.json()

  if (!wpAPIRoot._links?.up?.length) {
    throw new Error("Invalid WP API root response: missing _links.up")
  }

  const wpJsonRoot = wpAPIRoot._links.up[0].href
  const wpRoot = wpJsonRoot.replace(/\wp-json\/?$/, "")
  return wpRoot
}
