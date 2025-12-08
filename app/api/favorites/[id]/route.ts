import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

/**
 * DELETE /api/favorites/[id]
 * Remove a deal from user's favorites
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const favoriteId = params.id

        // Find the favorite
        const favorite = await prisma.favorite.findUnique({
            where: { id: favoriteId },
        })

        if (!favorite) {
            return NextResponse.json({ error: 'Favorite not found' }, { status: 404 })
        }

        // Verify ownership
        if (favorite.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Delete favorite
        await prisma.favorite.delete({
            where: { id: favoriteId },
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Error removing favorite:', error)
        return NextResponse.json(
            { error: 'Failed to remove favorite' },
            { status: 500 }
        )
    }
}
