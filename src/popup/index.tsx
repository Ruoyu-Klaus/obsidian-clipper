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

const vaultFolderOptions = [
  { displayName: "/", folder: "default" },
  { displayName: "/resource", folder: "resource" }
]

function IndexPopup() {
  const [content, setParsedContent] = useState<Article>()
  const [article, setArticle] = useState<string>()
  const [showCopied, setShowCopied] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState(vaultFolderOptions[0])

  useEffect(() => {
    const notifyContent = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      })
      const message: Message<string> = {
        target: "content",
        payload: "popup opened"
      }
      const response: Article = await chrome.tabs.sendMessage(tab.id, message)
      if (!response) return
      setParsedContent(response)
      setArticle("# " + response.title + "\n" + response.markdownContent)
    }

    if (chrome) {
      notifyContent()
    }
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(article)
    setShowCopied(true)
  }

  const copyToObsidian = () => {
    const getFileName = (title) => {
      return title.replace(":", "").replace(/\//g, "-").replace(/\\/g, "-")
    }

    const assembleURL = () => {
      let filePath = "name=" + encodeURIComponent(getFileName(content.title))
      if (selectedFolder.folder !== "default") {
        filePath =
          "file=" +
          encodeURIComponent(
            selectedFolder.folder + "/" + getFileName(content.title)
          )
      }
      return (
        "obsidian://new?" + filePath + "&content=" + encodeURIComponent(article)
      )
    }
    document.location.href = assembleURL()
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
      id={"root"}
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
            onClick={() => {
              // go to option page
              chrome.runtime.openOptionsPage()
              window.close()
            }}
            type="button"
            className="p-1 rounded cursor-pointer sm:ml-auto text-gray-400 hover:text-white hover:bg-blue-800 focus:ring-blue-900">
            <GearIcon />
          </button>
          <button
            onClick={() => window.close()}
            type="button"
            className="p-1 rounded cursor-pointer sm:ml-auto text-gray-400 hover:text-white hover:bg-blue-800 focus:ring-blue-900">
            <CloseIcon />
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full h-full mt-3 pb-2 ">
        <div className="flex flex-row mb-4 justify-between ">
          <div>
            <MultiDropDown
              values={vaultFolderOptions}
              onItemClick={(item) => {
                setSelectedFolder(item)
              }}
            />
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
