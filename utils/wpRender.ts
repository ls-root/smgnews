import * as cheerio from "cheerio";
import captionOutsideTable from "./wpRender/captionOutsideTable";

// parts of the wordpress renderer are located at /app/globals.css
export default function wpRender(html: string) {
  const $ = cheerio.load(html)

  captionOutsideTable($)

  return $.html()
}
