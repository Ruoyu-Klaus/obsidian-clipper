import dayjs from "dayjs"
import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import {
  POPUP_OPEN_EVENT,
  STORAGE_KEY_CLIPPING_FORMAT,
  STORAGE_KEY_DATE_FORMAT,
  STORAGE_KEY_VAULT_FOLDER
} from "~const"
import { Article, MESSAGE_TARGET, Message, VaultFolderOption } from "~types"
import { getFileName } from "~utils"

export const usePopupBusiness = () => {
  const [content, setParsedContent] = useState<Article>()
  const [article, setArticle] = useState<string>()

  const [vaultFolderOptions] = useStorage<VaultFolderOption[]>(
    STORAGE_KEY_VAULT_FOLDER,
    []
  )

  const [formatText] = useStorage<string>(STORAGE_KEY_CLIPPING_FORMAT)
  const [dateFormat] = useStorage<string>(STORAGE_KEY_DATE_FORMAT)

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
      response.date = dayjs().format(dateFormat)
      setParsedContent(response)
      const article = parseFormatTemplate(formatText, response)
      setArticle(article)
    } catch (error) {
      setArticle("⚠ Something wrong, please try again!")
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
    const filePath = "name=" + encodeURIComponent(folderName + "/" + fileName)
    return `obsidian://new?&${filePath}&content=${encodeURIComponent(article)}`
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-color-mode", "dark")
  }, [])

  useEffect(() => {
    if (chrome && formatText && dateFormat) {
      notifyContent()
    }
  }, [formatText, dateFormat])

  return {
    article,
    setArticle,
    vaultFolderOptions,
    assembleURL
  }
}
