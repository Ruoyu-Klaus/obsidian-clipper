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
  date?: string
}

export type Message<T> = {
  target: MESSAGE_TARGET
  payload: T
}

export enum MESSAGE_TARGET {
  CONTENT,
  POPUP,
  BACKGROUND,
  OPTION
}

export type VaultFolderOption = {
  displayName: string
  folder: string
}
