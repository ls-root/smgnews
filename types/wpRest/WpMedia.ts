export type WpMediaSize = {
  width: number,
  height: number,
  source_url: string
}

export type WpMedia = {
  id: number,
  alt_text: string,
  source_url: string,
  media_details: {
    width?: number,
    height?: number,
    sizes?: {
      medium?: WpMediaSize,
      thumbnail?: WpMediaSize,
      "medium_large"?: WpMediaSize,
      full?: WpMediaSize
    }
  }
}
