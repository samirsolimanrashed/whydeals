'use client'

interface ShareButtonProps {
  deal: {
    id: string
    title: string
    description: string
    imageUrl?: string
  }
}

export default function ShareButton({ deal }: ShareButtonProps) {
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/customer/deals/${deal.id}`
    : ''

  const shareText = `Check out this amazing deal: ${deal.title}`

  const handleShare = async (platform: string) => {
    const url = encodeURIComponent(shareUrl)
    const text = encodeURIComponent(shareText)

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${text}%20${url}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(shareUrl)
        alert('Link copied to clipboard!')
        break
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: deal.title,
            text: deal.description,
            url: shareUrl,
          }).catch(() => {})
        }
        break
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleShare('native')}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share
      </button>
      <button
        onClick={() => handleShare('facebook')}
        className="px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition text-sm"
        aria-label="Share on Facebook"
      >
        Facebook
      </button>
      <button
        onClick={() => handleShare('twitter')}
        className="px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition text-sm"
        aria-label="Share on Twitter"
      >
        Twitter
      </button>
      <button
        onClick={() => handleShare('whatsapp')}
        className="px-4 py-2 bg-[#25D366] text-white rounded-lg hover:opacity-90 transition text-sm"
        aria-label="Share on WhatsApp"
      >
        WhatsApp
      </button>
      <button
        onClick={() => handleShare('copy')}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
        aria-label="Copy link"
      >
        Copy Link
      </button>
    </div>
  )
}

