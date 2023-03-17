import { useEffect, useState } from "react"

import { STORAGE_KEY_VAULT_FOLDER } from "~const"
import type { Article, Message } from "~types"

export const usePopupBusiness = () => {
  const [content, setParsedContent] = useState<Article>()
  const [article, setArticle] = useState<string>()
  const [vaultFolderOptions, setVaultFolderOptions] = useState([
    { displayName: "/", folder: "default" }
  ])

  useEffect(() => {
    chrome.storage.sync.get([STORAGE_KEY_VAULT_FOLDER]).then((result) => {
      const value = result[STORAGE_KEY_VAULT_FOLDER]
      setVaultFolderOptions((pre) => [
        ...pre,
        { displayName: value, folder: value }
      ])
    })
  }, [])

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

        const message: Message<string> = {
          target: "content",
          payload: "popup opened"
        }
        const response: Article = await chrome.tabs.sendMessage(tab.id, message)
        if (!response) return
        setParsedContent(response)
        setArticle("# " + response.title + "\n" + response.markdownContent)
      } catch (error) {
        setArticle("⚠ Something wrong, please try again!")
      }
    }

    if (chrome) {
      notifyContent()
    }
  }, [])

  return {
    content,
    article,
    setArticle,
    vaultFolderOptions
  }
}
