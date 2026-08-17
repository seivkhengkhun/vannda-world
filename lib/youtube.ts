export function ytThumbnail(youtubeId: string, quality: "max" | "hq" | "mq" = "max") {
  const map = { max: "maxresdefault", hq: "hqdefault", mq: "mqdefault" } as const;
  return `https://i.ytimg.com/vi/${youtubeId}/${map[quality]}.jpg`;
}

export function ytWatchUrl(youtubeId: string) {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

export function ytEmbedUrl(youtubeId: string) {
  return `https://www.youtube.com/embed/${youtubeId}`;
}
