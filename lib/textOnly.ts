const jsdom = require("jsdom")

/**
 * get only the text of an html string
 * @param {string} html - html you want to get the text of
 */
export default function textOnly(html: string) {
  const dom = new jsdom.JSDOM(html)
  return dom.window.document.querySelector("p").textContent
}
