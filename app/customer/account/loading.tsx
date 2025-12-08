import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton'

export default function Loading() {
    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <DashboardSkeleton />
            </div>
        </div>
    )
}
