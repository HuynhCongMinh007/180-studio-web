/**
 * Turns a normal YouTube link (youtube.com/watch?v=..., youtu.be/...) into an embed URL.
 * YouTube blocks normal links inside an iframe, only the /embed/ form works.
 * Returns null when the link is not a valid YouTube link.
 */
export function toYouTubeEmbedUrl(videoUrl: string): string | null {
  try {
    const url = new URL(videoUrl)
    const id =
      url.hostname === 'youtu.be'
        ? url.pathname.slice(1)
        : url.searchParams.get('v')
    return id ? `https://www.youtube.com/embed/${id}` : null
  } catch {
    return null
  }
}
