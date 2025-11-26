const jsdom = require("jsdom")

export default function textOnly(html: string) {
  const dom = new jsdom.JSDOM(html)
  return dom.window.document.querySelector("p").textContent
}
