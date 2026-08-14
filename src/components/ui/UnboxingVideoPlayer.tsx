'use client'

function getEmbedUrl(url: string): { type: 'youtube' | 'vimeo' | 'mp4'; src: string } | null {
  if (!url) return null

  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (youtubeMatch) {
    return { type: 'youtube', src: `https://www.youtube.com/embed/${youtubeMatch[1]}` }
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return { type: 'vimeo', src: `https://player.vimeo.com/video/${vimeoMatch[1]}` }
  }

  if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) {
    return { type: 'mp4', src: url }
  }

  return { type: 'mp4', src: url }
}

export function UnboxingVideoPlayer({ url }: { url: string }) {
  const embed = getEmbedUrl(url)
  if (!embed) return null

  if (embed.type === 'mp4') {
    return (
      <video controls className="w-full h-full object-contain bg-black" playsInline>
        <source src={embed.src} />
      </video>
    )
  }

  return (
    <iframe
      src={embed.src}
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}
