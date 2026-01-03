import * as cheerio from "cheerio";
import captionOutsideTable from "./wpRender/captionOutsideTable";
import backgroundDim from "./wpRender/backgroundDim";
import coverPositioning from "./wpRender/coverPositioning";
import transformAccordion from "./wpRender/transformAccordion";

// parts of the wordpress renderer are located at /app/globals.css
export default function wpRender(html: string) {
  const $ = cheerio.load(html)

  captionOutsideTable($)
  backgroundDim($)
  coverPositioning($)
  transformAccordion($)

  return $.html()
}
