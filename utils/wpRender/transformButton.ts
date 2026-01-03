import { CheerioAPI } from "cheerio";

export default function transformButton($: CheerioAPI) {
  $(".wp-block-button.is-style-outline").each((_, el) => {
    const $el = $(el)

    $el.find("a.wp-element-button").css("background-color", "transparent border: 1px solid #343941")
    $el.find("a.wp-element-button").css("border", "1px solid #343941")
  })
}
