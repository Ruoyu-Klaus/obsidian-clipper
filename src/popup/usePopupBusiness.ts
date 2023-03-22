import dayjs from "dayjs"
import { useEffect, useState } from "react"

import {
  STORAGE_KEY_CLIPPING_FORMAT,
  STORAGE_KEY_DATE_FORMAT,
  STORAGE_KEY_VAULT_FOLDER
} from "~const"
import type { Article, Message } from "~types"

const getUserFormatTemplate = async () => {
  const result = await chrome.storage.sync.get([STORAGE_KEY_CLIPPING_FORMAT])
  return result[STORAGE_KEY_CLIPPING_FORMAT]
}

const getUserPreferFolder = async () => {
  const result = await chrome.storage.sync.get([STORAGE_KEY_VAULT_FOLDER])
  return result[STORAGE_KEY_VAULT_FOLDER]
}

const getUserDateFormat = async () => {
  const result = await chrome.storage.sync.get([STORAGE_KEY_DATE_FORMAT])
  return result[STORAGE_KEY_DATE_FORMAT]
}

export const usePopupBusiness = () => {
  const [content, setParsedContent] = useState<Article>()
  const [article, setArticle] = useState<string>()
  const [vaultFolderOptions, setVaultFolderOptions] = useState([
    { displayName: "/", folder: "default" }
  ])
  const [formatTemplate, setFormatTemplate] = useState("")

  useEffect(() => {
    const notifyContent = async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true,
          status: "complete"
        })
        if (!tab) {
          notifyContent()
          return
        }

        const extraFolder = await getUserPreferFolder()
        setVaultFolderOptions((pre) => [
          ...pre,
          { displayName: extraFolder, folder: extraFolder }
        ])

        const message: Message<string> = {
          target: "content",
          payload: "popup opened"
        }
        const response: Article = await chrome.tabs.sendMessage(tab.id, message)
        if (!response) return
        setParsedContent(response)

        let article = await getUserFormatTemplate()
        const dateFormat = await getUserDateFormat()

        article = article.replace(/{{title}}/g, response.title)
        article = article.replace(/{{content}}/g, response.markdownContent)
        article = article.replace(/{{link}}/g, response.link)
        article = article.replace(/{{date}}/g, dayjs().format(dateFormat))

        setArticle(article)
      } catch (error) {
        setArticle("⚠ Something wrong, please try again!")
      }
    }

    if (chrome) {
      notifyContent()
    }
    document.documentElement.setAttribute("data-color-mode", "dark")
  }, [])

  return {
    content,
    article,
    setArticle,
    vaultFolderOptions,
    formatTemplate
  }
}
