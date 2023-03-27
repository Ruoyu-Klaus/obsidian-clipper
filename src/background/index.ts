import { STORAGE_KEY_VAULT_FOLDER } from "~const"

if (chrome) {
  chrome.runtime.onInstalled.addListener((object) => {
    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
      initDefaultSetting().then((_) => {
        chrome.tabs.create({ url: "options.html" })
      })
    }
  })
}

const initDefaultSetting = async () => {
  await chrome.storage.sync.set({
    [STORAGE_KEY_VAULT_FOLDER]: [
      { displayName: "/", folder: "/", isDefault: true }
    ]
  })
}

export {}
