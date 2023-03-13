import { useEffect, useState } from "react"

// import BoxIn from "~/icons/BoxIn"
import CopyIcon from "~/icons/Copy"
import ObsidianIcon from "~icons/obsidian"
import type { Article, Message } from "~types"

import "~/style/base.css"

function IndexPopup() {
  const [content, setParsedContent] = useState<Article>()
  const [article, setArticle] = useState<string>()
  const [showCopied, setShowCopied] = useState(false)

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
    setShowCopied(true)
  }

  const copyToObsidian = () => {
    document.location.href =
      "obsidian://new?" +
      "file=" +
      encodeURIComponent(" " + content.title) +
      "&content=" +
      encodeURIComponent(article)
  }

  useEffect(() => {
    if (showCopied) {
      setTimeout(() => {
        setShowCopied(false)
      }, 2000)
    }
  }, [showCopied])

  return (
    <div
      className="container flex flex-col p-3 border-8 border-darkPurple bg-lightPurple "
      style={{ width: 720, height: 560 }}>
      <h1 className="leading-normal text-4xl text-center font-bold text-white">
        Obsidian Clipper
      </h1>

      <div className="flex flex-col w-full h-full mt-3 pb-2 ">
        <div className="flex flex-row mb-4 justify-between">
          <div>
            {/* <input
              className="mr-4 p-1 shadow-lg"
              style={{ width: 160, height: 36 }}
              type="text"
              placeholder="Vault Folder eg. /resource"
            />
            <input
              className="p-1 shadow-lg"
              style={{ width: 160, height: 36 }}
              type="text"
              placeholder="Tags eg. #web"
            /> */}
          </div>
          <div>
            {/* <button
              style={{ width: 36, height: 36 }}
              className="mr-4 bg-white border border-grey500 shadow text-center"
              onClick={copyToClipboard}>
              <BoxIn />
            </button> */}
            <button
              style={{ width: 36, height: 36 }}
              className="mr-4 bg-white border border-grey500 shadow"
              onClick={copyToClipboard}>
              <CopyIcon />
            </button>
            <button
              style={{ width: 36, height: 36 }}
              className="bg-white border border-grey500 shadow"
              onClick={copyToObsidian}>
              <ObsidianIcon />
            </button>
            {showCopied && <p className="absolute">Copied!</p>}
          </div>
        </div>
        <textarea
          className="h-full resize-none p-2 rounded"
          value={article}
          onChange={(e) => setArticle(e.target.value)}></textarea>
      </div>
    </div>
  )
}

export default IndexPopup
