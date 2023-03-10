import { Readability } from "@mozilla/readability"
import Turndown from "turndown"

function notifyExtension() {
  const content = document.documentElement.outerHTML
  const parser = new DOMParser()
  const dom = parser.parseFromString(content, "text/html")
  if (chrome) {
    const reader = new Readability(dom)
    const article = reader.parse()
    if (dom.documentElement.nodeName == "parsererror") {
      console.error("error while parsing")
      return
    }
    const markdownBody = new Turndown({
      headingStyle: "atx",
      hr: "---",
      bulletListMarker: "-",
      codeBlockStyle: "fenced",
      emDelimiter: "*"
    }).turndown(article.content)

    chrome.runtime.sendMessage({
      target: "background",
      article: { ...article, markdownBody }
    })
  }
}

export {}

window.addEventListener("load", () => {
  notifyExtension()
})
