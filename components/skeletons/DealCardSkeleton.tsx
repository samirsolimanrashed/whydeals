import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'

export function DealCardSkeleton() {
    return (
        <Card className="h-full flex flex-col overflow-hidden">
            {/* Image Skeleton */}
            <Skeleton className="h-48 w-full rounded-none" />

            <div className="p-4 flex-1 flex flex-col space-y-3">
                {/* Title Skeleton */}
                <Skeleton className="h-6 w-3/4" />

                {/* Description Skeleton */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>

                {/* Price Skeleton */}
                <div className="flex items-baseline gap-2 pt-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-16" />
                </div>

                {/* Stock Bar Skeleton */}
                <div className="space-y-1 pt-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                </div>

                {/* Button Skeleton */}
                <div className="pt-4 mt-auto">
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
            </div>
        </Card>
    )
}
