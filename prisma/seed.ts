import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Create Super Admin
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@whydeals.com' },
        update: {},
        create: {
            email: 'admin@whydeals.com',
            name: 'Super Admin',
            password: adminPassword,
            role: 'SUPERADMIN',
        },
    })
    console.log('✅ Super Admin created:', admin.email)

    // Create test seller
    const sellerPassword = await bcrypt.hash('seller123', 10)
    const seller = await prisma.user.upsert({
        where: { email: 'seller@example.com' },
        update: {},
        create: {
            email: 'seller@example.com',
            name: 'Test Seller',
            password: sellerPassword,
            role: 'SELLER',
        },
    })
    console.log('✅ Seller created:', seller.email)

    // Create seller profile
    const sellerProfile = await prisma.sellerProfile.upsert({
        where: { userId: seller.id },
        update: {},
        create: {
            userId: seller.id,
            businessName: 'Amazing Deals Co.',
            bio: 'We provide the best deals on premium products',
            approved: true,
        },
    })
    console.log('✅ Seller profile created')

    // Create test customer
    const customerPassword = await bcrypt.hash('customer123', 10)
    const customer = await prisma.user.upsert({
        where: { email: 'customer@example.com' },
        update: {},
        create: {
            email: 'customer@example.com',
            name: 'Test Customer',
            password: customerPassword,
            role: 'CUSTOMER',
        },
    })
    console.log('✅ Customer created:', customer.email)

    // Create customer wallet
    const wallet = await prisma.wallet.upsert({
        where: { userId: customer.id },
        update: {},
        create: {
            userId: customer.id,
            balance: 100.00,
        },
    })
    console.log('✅ Wallet created with $100 balance')

    // Create sample deals
    const deals = [
        {
            title: 'Ultimate SaaS Starter Kit',
            description: 'Launch your next project in days, not months. Includes auth, payments, and more.',
            originalPrice: 199.00,
            discountPrice: 49.00,
            category: 'Software',
            inventory: 50,
            sold: 42,
            startTime: new Date(),
            endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            status: 'ACTIVE',
            sellerId: sellerProfile.id,
        },
        {
            title: 'Premium UI Bundle',
            description: 'Over 500+ components for React, Vue, and Figma. Modern and clean design.',
            originalPrice: 99.00,
            discountPrice: 29.00,
            category: 'Design',
            inventory: 100,
            sold: 85,
            startTime: new Date(),
            endTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
            status: 'ACTIVE',
            sellerId: sellerProfile.id,
        },
        {
            title: 'SEO Masterclass 2025',
            description: 'Learn the latest SEO strategies to rank #1 on Google. 10+ hours of content.',
            originalPrice: 299.00,
            discountPrice: 99.00,
            category: 'Courses',
            inventory: 200,
            sold: 156,
            startTime: new Date(),
            endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            status: 'ACTIVE',
            sellerId: sellerProfile.id,
        },
    ]

    for (const dealData of deals) {
        const deal = await prisma.deal.create({
            data: dealData,
        })
        console.log(`✅ Deal created: ${deal.title}`)
    }

    console.log('🎉 Database seeded successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
