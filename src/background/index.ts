if (chrome) {
  chrome.runtime.onInstalled.addListener((object) => {
    if (object.reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.tabs.create({ url: "options.html" })
    }
  })
}

export {}
