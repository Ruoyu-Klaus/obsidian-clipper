import { useEffect, useState } from "react"

function IndexPopup() {
  const [article, setParsedArticle] = useState<any>({})

  useEffect(() => {
    const parsedContentListener = ({ target, article }) => {
      if (target === "popup") {
        setParsedArticle(article)
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

  const handleActive = () => {
    console.log(article)
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h2>Hello World</h2>
      <p>{article.markdownBody && article.markdownBody}</p>
      <button onClick={handleActive}>Active</button>
    </div>
  )
}

export default IndexPopup
