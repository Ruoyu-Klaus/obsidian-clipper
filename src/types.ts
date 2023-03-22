export type Article = {
  title: string
  byline: string
  dir: string
  content: string
  textContent: string
  length: number
  excerpt: string
  siteName: string
  markdownContent?: string
  link?: string
}

export type Message<T> = {
  target: string
  payload: T
}

export type VaultFolderOption = {
  displayName: string
  folder: string
}
