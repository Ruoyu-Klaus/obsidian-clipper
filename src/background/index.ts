import type { Article, Message } from "~types"

export {}
let _article: Article

if (chrome) {
  function notify(message: Message<Article>) {
    const { target, payload } = message
    if (target === "background" && payload.markdownContent) {
      _article = payload
    }
  }

  function sendArticleToPopup(message: Message<string>) {
    const { target, payload } = message
    if (target === "background" && payload === "popup opened") {
      console.log("_article")

      const message: Message<Article> = { target: "popup", payload: _article }
      chrome.runtime.sendMessage(message)
    }
  }

  chrome.action.onClicked.addListener(async function (tab) {
    chrome.scripting.executeScript
  })

  chrome.runtime.onMessage.addListener(notify)
  chrome.runtime.onMessage.addListener(sendArticleToPopup.bind(this))
}
