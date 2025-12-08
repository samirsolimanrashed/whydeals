'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ReviewFormProps {
    dealId: string
    onReviewSubmitted?: () => void
}

export function ReviewForm({ dealId, onReviewSubmitted }: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0) {
            toast.error('Please select a rating')
            return
        }

        setIsSubmitting(true)

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dealId,
                    rating,
                    comment,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to submit review')
            }

            toast.success('Review submitted successfully!')
            setRating(0)
            setComment('')
            if (onReviewSubmitted) {
                onReviewSubmitted()
            }
            router.refresh()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-neutral-black dark:text-foreground mb-2">
                    Rating
                </label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="text-2xl focus:outline-none transition-transform hover:scale-110"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <span
                                className={`${star <= (hoverRating || rating)
                                        ? 'text-warning-orange'
                                        : 'text-neutral-300 dark:text-neutral-600'
                                    } transition-colors duration-200`}
                            >
                                ★
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-black dark:text-foreground mb-2">
                    Your Review
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this deal..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-surface text-neutral-black dark:text-foreground focus:ring-2 focus:ring-primary-blue outline-none resize-none"
                />
            </div>

            <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
        </form>
    )
}
