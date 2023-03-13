import { useEffect, useState } from "react"

import type { Article, Message } from "~types"

import "../style/base.css"

function IndexPopup() {
  const [content, setParsedContent] = useState<any>({})
  const [article, setArticle] = useState<string>()

  useEffect(() => {
    const parsedContentListener = (message: Message<Article>) => {
      const { target, payload } = message
      if (target === "popup") {
        setParsedContent(payload)
        setArticle("# " + payload.title + "\n" + payload.markdownContent)
      }
    }
    if (chrome) {
      const message: Message<string> = {
        target: "background",
        payload: "popup opened"
      }
      chrome.runtime.sendMessage(message)
      chrome.runtime.onMessage.addListener(parsedContentListener)
    }
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(article)
  }

  return (
    <div
      style={{
        width: "400px",
        height: "500px",
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <textarea
        style={{ height: 500, resize: "none" }}
        value={article}
        onChange={(e) => setArticle(e.target.value)}></textarea>
      <button onClick={copyToClipboard}>Copy To Clipboard</button>
    </div>
  )
}

export default IndexPopup
