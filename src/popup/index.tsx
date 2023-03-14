import { useEffect, useState } from "react"

// import BoxIn from "~/icons/BoxIn"
import CopyIcon from "~/icons/Copy"
import CloseIcon from "~icons/Close"
import ObsidianIcon from "~icons/Obsidian"
import type { Article, Message } from "~types"

import "~/style/base.css"

import IconButton from "~components/IconButton"
import MultiDropDown from "~components/MultiDropDown"
import GearIcon from "~icons/Gear"

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
      className="container flex flex-col p-3 border border-gray-600 bg-darkBlue "
      style={{ width: 400, height: 600 }}>
      <div className="flex items-center justify-between p-1 py-2 border-b dark:border-gray-600">
        <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
          <div className="flex items-center space-x-1 sm:pr-4">
            <h1 className=" leading-normal text-2xl text-center font-bold text-white">
              Obsidian Clipper
            </h1>
          </div>
          <div className="flex flex-wrap items-center space-x-1 sm:pl-4"></div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="p-1 rounded cursor-pointer sm:ml-auto text-gray-400 hover:text-white hover:bg-gray-600">
            <GearIcon />
          </button>
          <button
            type="button"
            className="p-1 rounded cursor-pointer sm:ml-auto text-gray-400 hover:text-white hover:bg-gray-600">
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full h-full mt-3 pb-2 ">
        <div className="flex flex-row mb-4 justify-between ">
          <div>
            <MultiDropDown />
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
          <div className="flex flex-row gap-2 relative">
            <IconButton onClick={copyToClipboard}>
              <CopyIcon color="#edf2f7" />
              {showCopied && (
                <p style={{ top: 38 }} className="absolute text-xs text-white">
                  Copied!
                </p>
              )}
            </IconButton>

            <IconButton onClick={copyToObsidian}>
              <ObsidianIcon color="#edf2f7" />
            </IconButton>
          </div>
        </div>

        <div className="h-full py-2  bg-darkGrey rounded-lg">
          <textarea
            className=" px-2 h-full resize-none w-full text-sm text-gray-300 bg-darkGrey  focus:ring-0 focus:border-0 outline-none overflow-auto"
            value={article}
            spellCheck={false}
            onChange={(e) => setArticle(e.target.value)}></textarea>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
