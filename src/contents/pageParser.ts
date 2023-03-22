import { Readability } from "@mozilla/readability"
import * as DOMPurify from "dompurify"
import Turndown from "turndown"

import type { Article, Message } from "~types"

function parse2MD() {
  const content = DOMPurify.sanitize(document.documentElement.outerHTML)
  const parser = new DOMParser()
  const dom = parser
    .parseFromString(content, "text/html")
    .cloneNode(true) as Document
  const article = getArticle(dom)
  if (!article || !chrome) return

  const markdownContent = getMarkDown(article)

  return { ...article, link: document.URL, markdownContent }
}

function handlePopupOpen(message: Message<string>, sender, sendResponse) {
  if (message.target === "content" && message.payload === "popup opened") {
    sendResponse(parse2MD())
  }
}

window.addEventListener("load", () => {
  chrome.runtime?.onMessage.addListener(handlePopupOpen)
})

function getArticle(dom: Document): Article {
  const reader = new Readability(dom)
  try {
    const article = reader.parse()
    return article
  } catch (error) {
    console.error("error while parsing")
    return null
  }
}

function getMarkDown(article: Article) {
  return new Turndown({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*"
  }).turndown(article.content)
}
