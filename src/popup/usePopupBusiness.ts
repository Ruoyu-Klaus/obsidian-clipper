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

        const extraFolder = await getUserStoreValueByKey(
          STORAGE_KEY_VAULT_FOLDER
        )
        if (extraFolder) {
          setVaultFolderOptions((pre) => [
            ...pre,
            { displayName: extraFolder, folder: extraFolder }
          ])
        }

        const message: Message<string> = {
          target: MESSAGE_TARGET.CONTENT,
          payload: POPUP_OPEN_EVENT
        }
        const response: Article = await chrome.tabs.sendMessage(tab.id, message)
        if (!response) return
        setParsedContent(response)

        let article = await getUserStoreValueByKey(STORAGE_KEY_CLIPPING_FORMAT)
        const dateFormat = await getUserStoreValueByKey(STORAGE_KEY_DATE_FORMAT)

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

  return {
    article,
    setArticle,
    vaultFolderOptions,
    assembleURL
  }
}
