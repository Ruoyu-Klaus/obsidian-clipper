import { Readability } from "@mozilla/readability"
import * as DOMPurify from "dompurify"
import Turndown from "turndown"

import { POPUP_OPEN_EVENT } from "~const"
import { Article, MESSAGE_TARGET, Message } from "~types"
import { getFirstLineContent } from "~utils"

function handlePopupOpen(message: Message<string>, sender, sendResponse) {
  if (
    message.target === MESSAGE_TARGET.CONTENT &&
    message.payload === POPUP_OPEN_EVENT
  ) {
    let content = parseSelectedContent() || document.documentElement.outerHTML
    content = DOMPurify.sanitize(content)
    const parser = new DOMParser()
    const dom = parser
      .parseFromString(content, "text/html")
      .cloneNode(true) as Document
    const article = parseArticle(dom)
    if (!article) return

    const markdownContent = getMarkDown(article.content)

    if (!article.title) {
      const firstLineMatch = getFirstLineContent(markdownContent)
      article.title = firstLineMatch.replace(/^#+\s/, "")
    }

    sendResponse({ ...article, link: document.URL, markdownContent })
  }
}

function parseArticle(dom: Document): Article {
  const reader = new Readability(dom)
  try {
    const article = reader.parse()
    return article
  } catch (error) {
    console.error("error while parsing")
    return null
  }
}

function parseSelectedContent() {
  const selection = window.getSelection()
  const container = document.createElement("div")
  if (selection.rangeCount) {
    for (let i = 0, len = selection.rangeCount; i < len; ++i) {
      container.appendChild(selection.getRangeAt(i).cloneContents())
    }
  }
  return container.innerHTML
}

function getMarkDown(serializedElement: string) {
  return new Turndown({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*"
  }).turndown(serializedElement)
}

window.addEventListener("load", () => {
  chrome.runtime?.onMessage.addListener(handlePopupOpen)
})
