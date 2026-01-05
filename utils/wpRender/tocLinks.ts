import { CheerioAPI } from "cheerio";
import wpLinkToRoute from "../wpLinkToRoute";

export default function tocLinks($: CheerioAPI) {
  $(".wp-block-table-of-contents__entry").each((_, el) => {
    const $el = $(el)

    const href = $el.attr("href")
    if (!href) return

    const fixedLink = wpLinkToRoute("toc", href)
    $el.attr("href", fixedLink)
  })
}
