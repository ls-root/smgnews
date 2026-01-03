import { CheerioAPI } from "cheerio";

export default function buttonColor($: CheerioAPI) {
  const colors: Record<string, string> = {
    "black": "#000000",
    "cyan-bluish-gray": "#abb8c3",
    "white": "#ffffff",
    "pale-pink": "#f78da7",
    "vivid-red": "#cf2e2e",
    "luminous-vivid-orange": "#ff6900",
    "luminous-vivid-amber": "#fcb900",
    "light-green-cyan": "#7bdcb5",
    "vivid-green-cyan": "#00d084",
    "pale-cyan-blue": "#8ed1fc",
    "vivid-cyan-blue": "#0693e3",
    "vivid-purple": "#9b51e0",
  }

  $(".wp-element-button.wp-block-button__link").each((_, el) => {
    const $el = $(el)
    const classes = ($el.attr("class") || "").split(/\s+/)

    const isOutline = $el.parent().hasClass("is-style-outline")

    let bgKey
    const bgClass = classes.find(c => c.startsWith("has-") && c.endsWith("-background-color"))
    if (!bgClass) {
      bgKey = null
    } else {
      bgKey = bgClass.replace("has-", "").replace("-background-color", "")
    }
    const bgColor = bgKey ? colors[bgKey] : null

    const textClass = classes.find(c => c.startsWith("has-") && c.endsWith("-color"))
    const textKey = textClass?.replace("has-", "").replace("-color", "")

    if (bgColor) {
      $el.css("background-color", bgColor)
    } else {
      $el.css("background-color", "transparent")
    }

    if (isOutline) {
      const borderColor = textKey ? colors[textKey] : null
      $el.css("border", `2px solid ${borderColor}`)
    }

    if (textKey) {
      $el.css("color", colors[textKey])
    } else if (!isOutline) {
      $el.css("color", "white")
    }
  })
}
