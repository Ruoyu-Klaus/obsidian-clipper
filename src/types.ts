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
}

export type Message<T> = {
  target: string
  payload: T
}
