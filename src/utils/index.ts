export const getFileName = (title) => {
  return title.replace(":", "").replace(/\//g, "-").replace(/\\/g, "-")
}

export const getFirstLineContent = (content: string) => {
  return content.match(/^.+/)[0]
}
