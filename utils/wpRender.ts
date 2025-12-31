import * as cheerio from "cheerio";
import captionOutsideTable from "./wpRender/captionOutsideTable";
import backgroundDim from "./wpRender/backgroundDim";

// parts of the wordpress renderer are located at /app/globals.css
export default function wpRender(html: string) {
  const $ = cheerio.load(html)

  captionOutsideTable($)
  backgroundDim($)

  return $.html()
}
