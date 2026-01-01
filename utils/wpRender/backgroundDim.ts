import { CheerioAPI } from "cheerio";
import hexToRgba from "../hexToRgba";

export default function backgroundDim($: CheerioAPI) {
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


  $(".wp-block-cover__background").each((_, el) => {
    const $el = $(el)
    const classes = ($el.attr("class") || "").split(/\s+/)

    const colorClass = classes.find(c => c.startsWith("has-") && c.endsWith("-background-color"))
    let dimClass = classes.find(c => c.startsWith("has-background-dim-"))

    // wordpress doesnt add percentage when using 50% opacity
    if (!dimClass && classes.includes("has-background-dim")) dimClass = "has-background-dim-50"

    if (!colorClass || !dimClass) return

    const colorKey = colorClass
      .replace("has-", "")
      .replace("-background-color", "")

    const hex = colors[colorKey]
    if (!hex) return

    // has-background-dim-70 -> 0.7
    const dimPercent = parseInt(dimClass.replace("has-background-dim-", ""), 10)
    const opacity = Math.min(Math.max(dimPercent / 100, 0), 1)

    const rgba = hexToRgba(hex, opacity)

    $el.attr("style", `background-color: ${rgba}`)
  })
}
