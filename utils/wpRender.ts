import * as cheerio from "cheerio";
import captionOutsideTable from "./wpRender/captionOutsideTable";
import backgroundDim from "./wpRender/backgroundDim";
import coverPositioning from "./wpRender/coverPositioning";
import transformAccordion from "./wpRender/transformAccordion";
import transformButton from "./wpRender/transformButton";
import buttonColor from "./wpRender/buttonColor";
import tocLinks from "./wpRender/tocLinks";

// parts of the wordpress renderer are located at /app/globals.css
export default function wpRender(html: string) {
  const $ = cheerio.load(html)

  captionOutsideTable($)
  backgroundDim($)
  coverPositioning($)
  transformAccordion($)
  transformButton($)
  buttonColor($)
  tocLinks($)

  return $.html()
}
