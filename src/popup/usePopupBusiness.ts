import dayjs from "dayjs"
import { useEffect, useState } from "react"

import {
  POPUP_OPEN_EVENT,
  STORAGE_KEY_CLIPPING_FORMAT,
  STORAGE_KEY_DATE_FORMAT,
  STORAGE_KEY_VAULT_FOLDER
} from "~const"
import { Article, MESSAGE_TARGET, Message } from "~types"
import { getFileName, getUserStoreValueByKey } from "~utils"

export const usePopupBusiness = () => {
  const [content, setParsedContent] = useState<Article>()
  const [article, setArticle] = useState<string>()
  const [vaultFolderOptions, setVaultFolderOptions] = useState([
    { displayName: "/", folder: "" }
  ])

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

      const message: Message<string> = {
        target: MESSAGE_TARGET.CONTENT,
        payload: POPUP_OPEN_EVENT
      }
      const response: Article = await chrome.tabs.sendMessage(tab.id, message)
      if (!response) return
      const dateFormat = await getUserStoreValueByKey(STORAGE_KEY_DATE_FORMAT)
      response.date = dayjs().format(dateFormat)
      setParsedContent(response)

      const formatTemplate = await getUserStoreValueByKey(
        STORAGE_KEY_CLIPPING_FORMAT
      )
      const article = parseFormatTemplate(formatTemplate, response)

      setArticle(article)
    } catch (error) {
      setArticle("⚠ Something wrong, please try again!")
    }
  }

  const getExtraFolder = async () => {
    const extraFolder = await getUserStoreValueByKey(STORAGE_KEY_VAULT_FOLDER)
    if (extraFolder) {
      setVaultFolderOptions((pre) => [
        ...pre,
        { displayName: extraFolder, folder: extraFolder }
      ])
    }
  }

  const parseFormatTemplate = (template: string, article: Article) => {
    return template
      .replace(/{{title}}/g, article.title)
      .replace(/{{content}}/g, article.markdownContent)
      .replace(/{{link}}/g, article.link)
      .replace(/{{date}}/g, article.date)
  }

  const assembleURL = (folderName: string) => {
    const fileName = getFileName(content.title)
    let filePath
    if (folderName) {
      filePath = "file=" + encodeURIComponent(folderName + fileName)
    } else {
      filePath = "name=" + encodeURIComponent(fileName)
    }
    return `obsidian://new?${filePath}&content=${encodeURIComponent(article)}`
  }

  useEffect(() => {
    if (chrome) {
      getExtraFolder()
      notifyContent()
    }
    document.documentElement.setAttribute("data-color-mode", "dark")
  }, [])

  return {
    article,
    setArticle,
    vaultFolderOptions,
    assembleURL
  }
}
