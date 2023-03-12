import { useEffect, useState } from "react"

import "../style/base.css"

function IndexPopup() {
  const [content, setParsedContent] = useState<any>({})
  const article = "# " + content.title + "\n" + content.markdownBody

  useEffect(() => {
    const parsedContentListener = ({ target, article }) => {
      if (target === "popup") {
        setParsedContent(article)
      }
    }
    if (chrome) {
      chrome.runtime.sendMessage({
        target: "background",
        payload: "popup opened"
      })
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
        value={article}></textarea>
      <button onClick={copyToClipboard}>Copy To Clipboard</button>
    </div>
  )
}

export default IndexPopup
