import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function ComingSoonPage() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl font-bold text-navy-dark dark:text-foreground mb-4">Coming Soon</h1>
            <p className="text-foreground/70 max-w-md mb-8">
                We are working hard to bring you this feature. Stay tuned for updates!
            </p>
            <Link href="/">
                <Button variant="primary">Return Home</Button>
            </Link>
        </div>
    )
}
