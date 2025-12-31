import { CheerioAPI } from "cheerio";

export default function coverPositioning($: CheerioAPI) {
  $('.wp-block-cover')
    .filter((_, el) => {
      const classes = ($(el).attr("class") || "").split(/\s+/)
      return classes.some(c => c.startsWith("is-position-"))
    })
    .each((_, el) => {
      const $el = $(el)
      const positionClass = ($el.attr("class") || "")
        .split(/\s+/)
        .filter(c => c.startsWith("is-position-"))[0]

      if (!positionClass) return

      const parts = positionClass.split("-")
      const verticalPart = parts[2]
      const horizontalPart = parts[3]

      const top = verticalPart === "top" ? 0 : verticalPart === "center" ? 50 : 100
      const left = horizontalPart === "left" ? 0 : horizontalPart === "center" ? 50 : 100

      const translateX = horizontalPart === "center" ? -50 : horizontalPart === "right" ? -100 : 0
      const translateY = verticalPart === "center" ? -50 : verticalPart === "bottom" ? -100 : 0

      const $inner = $el.find(".wp-block-cover__inner-container")

      $inner.attr(
        "style",
        `
          top: ${top}%;
          left: ${left}%;
          transform: translate(
            ${translateX}%,
            ${translateY}%
          );
          text-align: ${horizontalPart === "center" ? "center" : horizontalPart === "left" ? "left" : "right"}
        `)
    })

}
