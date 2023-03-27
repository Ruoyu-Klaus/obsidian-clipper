import { useEffect, useRef, useState } from "react"

import "~/style/base.css"

import logoImage from "data-base64:~assets/logo.png"

import RadioButtons from "~components/RadioButtons"
import {
  STORAGE_KEY_CLIPPING_FORMAT,
  STORAGE_KEY_DATE_FORMAT,
  STORAGE_KEY_VAULT_FOLDER
} from "~const"
import type { VaultFolderOption } from "~types"

const defaultFormatContent =
  "\ntitle: {{title}}\n\nlink: {{link}}\n\ndate: {{date}}\n\n---\n\n{{content}}\n"
const defaultDateFormat = "YYYY-MM-DD"

function index() {
  const [showSaved, setShowSaved] = useState(false)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const formatTextAreaRef = useRef<HTMLTextAreaElement>(null)
  const dateFormatInputRef = useRef<HTMLInputElement>(null)

  const [isValidFolderFormat, setValidFolderFormat] = useState(true)

  const [folderOptions, setFolderOptions] = useState<VaultFolderOption[]>([])

  useEffect(() => {
    chrome.storage.sync
      .get([
        STORAGE_KEY_VAULT_FOLDER,
        STORAGE_KEY_CLIPPING_FORMAT,
        STORAGE_KEY_DATE_FORMAT
      ])
      .then((result) => {
        if (
          result[STORAGE_KEY_VAULT_FOLDER] &&
          result[STORAGE_KEY_VAULT_FOLDER].length
        ) {
          setFolderOptions(result[STORAGE_KEY_VAULT_FOLDER])
        }

        if (result[STORAGE_KEY_CLIPPING_FORMAT]) {
          formatTextAreaRef.current.value = result[STORAGE_KEY_CLIPPING_FORMAT]
        } else {
          chrome.storage.sync.set({
            [STORAGE_KEY_CLIPPING_FORMAT]: defaultFormatContent
          })
        }

        if (result[STORAGE_KEY_DATE_FORMAT]) {
          dateFormatInputRef.current.value = result[STORAGE_KEY_DATE_FORMAT]
        } else {
          chrome.storage.sync.set({
            [STORAGE_KEY_DATE_FORMAT]: defaultDateFormat
          })
        }
      })
  }, [])

  const handleSaveOptions = async () => {
    const folderValue = folderInputRef.current.value
    const formatContent = formatTextAreaRef.current.value
    const dateFormat = dateFormatInputRef.current.value

    const regExp = /^[\w+\/]+\/$/
    if (!regExp.test(folderValue)) {
      setValidFolderFormat(false)
      return
    }

    await chrome.storage.sync.set({
      [STORAGE_KEY_VAULT_FOLDER]: folderValue,
      [STORAGE_KEY_CLIPPING_FORMAT]: formatContent,
      [STORAGE_KEY_DATE_FORMAT]: dateFormat
    })

    setValidFolderFormat(true)
    setShowSaved(true)

    setTimeout(() => {
      setShowSaved(false)
    }, 2000)
  }

  const handleAddVaultFolder = async () => {
    const folderValue = folderInputRef.current.value
    const regExp = /^[\w+\/]+\/$/
    if (!regExp.test(folderValue)) {
      setValidFolderFormat(false)
      return
    }

    const newFolderOption = {
      displayName: folderValue,
      folder: folderValue,
      isDefault: false
    }

    await chrome.storage.sync.set({
      [STORAGE_KEY_VAULT_FOLDER]: [...folderOptions, newFolderOption]
    })

    setFolderOptions((prev) => {
      return [...prev, newFolderOption]
    })
    folderInputRef.current.value = ""
    setValidFolderFormat(true)
  }

  const handleDefaultFolder = async (value: string) => {
    const result = folderOptions.map((o) => {
      o.isDefault = false
      if (o.folder === value) {
        o.isDefault = true
      }
      return o
    })
    await chrome.storage.sync.set({
      [STORAGE_KEY_VAULT_FOLDER]: result
    })
    setFolderOptions(result)
  }

  const handleFolderOptionDelete = async (option: VaultFolderOption) => {
    const result = folderOptions.filter((o) => o.folder !== option.folder)
    await chrome.storage.sync.set({
      [STORAGE_KEY_VAULT_FOLDER]: result
    })
    setFolderOptions(result)
  }

  const invalidInputStyle =
    "rounded-lg border-transparent flex-1 appearance-none w-full py-2 px-4 shadow-sm text-base focus:outline-none border focus:ring-red-500 bg-red-50 focus:border-red-500 block text-red-500 placeholder-red-500 border-red-500"

  return (
    <>
      <div className="h-full flex flex-col gap-2 justify-center items-center">
        <div className="flex-1 h-auto rounded-lg sm:max-w-md sm:w-full sm:mx-auto sm:overflow-hidden">
          <div className="px-4 py-8 h-full flex flex-col justify-center items-center">
            <img src={logoImage} alt="logoImage" width="50%" />
            <div className="relative mt-6">
              <div className="relative flex flex-col justify-center text-sm leading-5">
                <p className="px-2 text-gray-500 bg-white text-center">
                  Obsidian Clipper Options
                </p>
                <p>
                  Welcome to Obsidian Clipper, a browser plugin that makes it
                  easy to clip web content and paste it into your Obsidian vault
                  by clicking the buttons on the popup! The copied images will
                  be embedded as external references.
                </p>
              </div>
            </div>

            <div className="mt-6 w-full h-full flex-1">
              <div className="w-full h-full flex flex-col gap-8">
                <div className="w-full flex-1">
                  <div className="relative">
                    <label
                      className="text-black text-lg"
                      htmlFor="target-folder">
                      Extra Vault Folder
                    </label>
                    <div className="flex justify-center gap-2">
                      <input
                        type="text"
                        id="target-folder"
                        className={
                          isValidFolderFormat
                            ? "rounded-lg border-purple-300  flex-1 appearance-none  w-full py-2 px-4 shadow-sm text-base focus:outline-none focus:border-transparent border focus:ring-2 bg-white focus:ring-purple-600 text-gray-700 placeholder-gray-400 border-gray-300"
                            : invalidInputStyle
                        }
                        placeholder="Target Folder"
                        defaultValue={""}
                        ref={folderInputRef}
                        spellCheck={false}
                      />
                      <button
                        disabled={folderOptions.length >= 5}
                        onClick={handleAddVaultFolder}
                        className={`cursor-pointer bg-purple-600 hover:bg-purple-700 w-10 h-auto focus:ring-purple-500 focus:ring-offset-purple-200 text-white transition ease-in duration-200 text-center text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg ${
                          folderOptions.length > 5 &&
                          "bg-purple-400 cursor-not-allowed hover:bg-purple-400 focus:none"
                        }`}>
                        +
                      </button>
                    </div>
                    {isValidFolderFormat || (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        <span className="font-medium">Oh, snapp!</span> Folder
                        path invalid.
                      </p>
                    )}
                    <p className="mt-2 text-sm text-gray-400">
                      You can select another target vault folder(except default
                      one) on extension panel. It should be in format like
                      "xx/xx/"
                    </p>
                  </div>
                  <div className="my-3 w-full border-t border-gray-300"></div>
                  <RadioButtons
                    options={folderOptions}
                    onOptionChange={handleDefaultFolder}
                    onOptionDelete={handleFolderOptionDelete}
                  />
                  <div className="my-3 w-full border-t border-gray-300"></div>
                  <div className="relative">
                    <label
                      className="text-black text-lg"
                      htmlFor="content-format">
                      Clipping Format
                    </label>
                    <textarea
                      ref={formatTextAreaRef}
                      className="mt-2 px-2 h-24 resize-none w-full text-sm text-gray-700 bg-white rounded-lg border border-purple-300  focus:ring-2 focus:ring-purple-600 outline-none overflow-auto"
                      defaultValue={defaultFormatContent}
                      spellCheck={false}></textarea>
                    <p className="mt-2 text-sm text-gray-400">
                      You can specify the clipping template using placeholders
                      like {`{{title}}`}, {`{{content}}`}, {`{{date}}`},{" "}
                      {`{{link}}`}.
                    </p>
                  </div>
                  <div className="my-3 w-full border-t border-gray-300"></div>
                  <div className="relative">
                    <label className="text-black text-lg" htmlFor="date-format">
                      Date Format
                    </label>
                    <input
                      type="text"
                      id="date-format"
                      className="mt-2 rounded-lg border-purple-300  flex-1 appearance-none  w-full py-2 px-4 shadow-sm text-base focus:outline-none focus:border-transparent border focus:ring-2 bg-white focus:ring-purple-600 text-gray-700 placeholder-gray-400 border-gray-300"
                      placeholder="Date format like 'YYYY-MM-DD'"
                      defaultValue={defaultDateFormat}
                      ref={dateFormatInputRef}
                      spellCheck={false}
                    />

                    <p className="mt-2 text-sm text-gray-400">
                      You can parse the date in a given format, it should look
                      like "YYYY-DD-MM".{" "}
                      <a
                        className="underline"
                        target="_blank"
                        href="https://day.js.org/docs/en/parse/string-format#list-of-all-available-parsing-tokens">
                        Click to check what available parsing tokens.
                      </a>
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <span className="block w-full rounded-md shadow-sm">
                    <button
                      onClick={handleSaveOptions}
                      type="button"
                      className="py-2 px-4  bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                      {showSaved ? "Changes saved" : "Save Changes"}
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sm:max-w-md sm:w-full sm:mx-auto px-4 py-6 border-t-2 border-gray-200 sm:px-10">
          <p className="text-xs leading-5 text-gray-500">
            © 2023 Ruoyu. All rights reserved. v1.0.0
          </p>
        </div>
      </div>
    </>
  )
}

export default index
