import { CheerioAPI } from "cheerio";

export default function transformAccordion($: CheerioAPI) {
  $(".wp-block-accordion-item").each((_, el) => {
    const $el = $(el)

    const isOpen = $el.attr("data-wp-context")?.includes('"openByDefault": true')

    const $heading = $el.find(".wp-block-accordion-heading")
    const $button = $el.find("button")
    const $panel = $el.find(".wp-block-accordion-panel").first()

    const details = $("<details></details>").attr("class", $el.attr("class"))
    if (isOpen) details.attr("open", "")

    const summary = $("<summary></summary>")
      .attr("class", $heading.attr("class"))
      .append($button.contents())

    const panel = $("<div></div>")
      .attr("class", $panel.attr("class"))
      .append($panel.contents())

    details.append(summary, panel)

    $el.replaceWith(details)
  })
}
