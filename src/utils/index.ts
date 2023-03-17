export const getFileName = (title) => {
  return title.replace(":", "").replace(/\//g, "-").replace(/\\/g, "-")
}
