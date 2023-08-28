export const getFileName = (title: string): string => {
  return title
    .replace(":", "")
    .replace(/\//g, "-")
    .replace(/\\/g, "-")
    .substring(0, 16)
}

export const getFirstLineContent = (content: string) => {
  return content.match(/^.+/)[0]
}

export const getUserStoreValueByKey = async (key: string) => {
  if (!chrome) {
    return
  }
  const result = await chrome.storage.sync.get([key])
  return result[key]
}
