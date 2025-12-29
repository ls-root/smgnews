import { CheerioAPI } from "cheerio";

export default function captionOutsideTable($: CheerioAPI) {
  const figure = $("figure.wp-block-table")
  const caption = figure.find("figcaption")
  // move outside
  figure.after(caption)
}
