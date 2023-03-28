import MDEditor from "@uiw/react-md-editor"
import { useEffect, useState } from "react"

// import BoxIn from "~/icons/BoxIn"
import CopyIcon from "~/icons/Copy"
import CloseIcon from "~icons/Close"
import GearIcon from "~icons/Gear"
import ObsidianIcon from "~icons/Obsidian"

import "~/style/base.css"

import IconButton from "~components/IconButton"
import MultiDropDown from "~components/MultiDropDown"
import type { VaultFolderOption } from "~types"

import { usePopupBusiness } from "./usePopupBusiness"

function IndexPopup() {
  const { article, setArticle, vaultFolderOptions, assembleURL } =
    usePopupBusiness()

  const [editorMode, setEditorMode] = useState<"edit" | "preview">("edit")
  const [showCopied, setShowCopied] = useState(false)

  const [selectedFolder, setSelectedFolder] = useState<VaultFolderOption>()

  useEffect(() => {
    setSelectedFolder(
      vaultFolderOptions.find(o => o.isDefault) || vaultFolderOptions[0]
    )
  }, [vaultFolderOptions])

  const goOptionPage = () => {
    chrome.runtime.openOptionsPage()
    window.close()
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(article)
    setShowCopied(true)
  }

  const copyToObsidian = () => {
    document.location.href = assembleURL(selectedFolder.folder)
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
            onClick={goOptionPage}
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
              selectedValue={selectedFolder}
              onItemClick={item => {
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

        <div
          className="h-full py-2  bg-darkGrey rounded-lg"
          onDoubleClick={() => setEditorMode("edit")}
          onBlur={() => setEditorMode("preview")}>
          <MDEditor
            autoFocus
            style={{ background: "#212936", boxShadow: "none" }}
            height={420}
            value={article}
            onChange={setArticle}
            preview={editorMode}
            visibleDragbar={false}
            previewOptions={{ style: { background: "#212936" } }}
            hideToolbar
          />
          {/* <textarea
            className=" px-2 h-full resize-none w-full text-sm text-gray-300 bg-darkGrey  focus:ring-0 focus:border-0 outline-none overflow-auto"
            value={article}
            spellCheck={false}
            onChange={(e) => setArticle(e.target.value)}></textarea> */}
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
