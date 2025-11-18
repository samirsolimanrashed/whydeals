import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Clear existing data (respecting foreign key order)
    await prisma.walletTransaction.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.review.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.purchase.deleteMany();
    await prisma.deal.deleteMany();
    await prisma.providerAnalytics.deleteMany();
    await prisma.payoutAccount.deleteMany();
    await prisma.providerProfile.deleteMany();
    await prisma.session.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.adminSettings.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.user.deleteMany();

    console.log("✅ Cleared existing data");

    // Create admin settings
    await prisma.adminSettings.create({
      data: {
        platformFeePercent: 10,
        minProviderPayout: 100,
        payoutFrequency: "WEEKLY",
        allowNewProviders: true,
        allowNewDeals: true,
        maintenanceMode: false,
        passwordExpireDays: 90,
        maxLoginAttempts: 5,
        lockoutDurationMinutes: 30,
        emailNotificationsEnabled: true,
        smsNotificationsEnabled: false,
      },
    });

    console.log("✅ Created admin settings");

    // Create users (superadmin, customer, and providers)
    const superadmin = await prisma.user.create({
      data: {
        email: "admin@whydeals.com",
        password: await bcrypt.hash("admin123", 10),
        name: "Super Admin",
        phone: "+1111111111",
        role: "SUPERADMIN",
        verified: true,
        active: true,
      },
    });

    const customer1 = await prisma.user.create({
      data: {
        email: "customer1@example.com",
        password: await bcrypt.hash("password123", 10),
        name: "John Doe",
        phone: "+1234567890",
        role: "CUSTOMER",
        verified: true,
        active: true,
      },
    });

    const customer2 = await prisma.user.create({
      data: {
        email: "customer2@example.com",
        password: await bcrypt.hash("password123", 10),
        name: "Jane Smith",
        phone: "+1234567891",
        role: "CUSTOMER",
        verified: true,
        active: true,
      },
    });

    const provider1 = await prisma.user.create({
      data: {
        email: "provider1@example.com",
        password: await bcrypt.hash("password123", 10),
        name: "Tech Store",
        phone: "+1987654321",
        role: "PROVIDER",
        verified: true,
        active: true,
      },
    });

    const provider2 = await prisma.user.create({
      data: {
        email: "provider2@example.com",
        password: await bcrypt.hash("password123", 10),
        name: "Fashion Hub",
        phone: "+1555555555",
        role: "PROVIDER",
        verified: true,
        active: true,
      },
    });

    console.log("✅ Created 5 users (1 admin, 2 customers, 2 providers)");

    // Create provider profiles
    const providerProfile1 = await prisma.providerProfile.create({
      data: {
        userId: provider1.id,
        businessName: "Tech Store Solutions",
        businessEmail: "business@techstore.com",
        phone: "+1987654321",
        bio: "Leading electronics retailer",
        website: "https://techstore.com",
        approved: true,
        verifiedAt: new Date(),
        totalDeals: 0,
        totalSales: 0,
        rating: 4.8,
      },
    });

    const providerProfile2 = await prisma.providerProfile.create({
      data: {
        userId: provider2.id,
        businessName: "Fashion Hub Inc",
        businessEmail: "business@fashionhub.com",
        phone: "+1555555555",
        bio: "Premium fashion and apparel",
        website: "https://fashionhub.com",
        approved: true,
        verifiedAt: new Date(),
        totalDeals: 0,
        totalSales: 0,
        rating: 4.6,
      },
    });

    console.log("✅ Created 2 provider profiles");

    // Create payout accounts
    await prisma.payoutAccount.create({
      data: {
        providerId: providerProfile1.id,
        accountHolder: "Tech Store Solutions LLC",
        bankName: "Chase Bank",
        accountNumber: "1234567890",
        routingNumber: "021000021",
        accountType: "CHECKING",
        country: "US",
        verified: true,
      },
    });

    await prisma.payoutAccount.create({
      data: {
        providerId: providerProfile2.id,
        accountHolder: "Fashion Hub Inc",
        bankName: "Bank of America",
        accountNumber: "0987654321",
        routingNumber: "026009593",
        accountType: "CHECKING",
        country: "US",
        verified: true,
      },
    });

    console.log("✅ Created 2 payout accounts");

    // Create provider analytics
    await prisma.providerAnalytics.create({
      data: {
        providerId: providerProfile1.id,
        totalDealsCreated: 0,
        totalRevenue: 0,
        totalOrders: 0,
        totalViews: 0,
        totalClicks: 0,
        averageRating: 4.8,
        completionRate: 98,
        refundRate: 2,
      },
    });

    await prisma.providerAnalytics.create({
      data: {
        providerId: providerProfile2.id,
        totalDealsCreated: 0,
        totalRevenue: 0,
        totalOrders: 0,
        totalViews: 0,
        totalClicks: 0,
        averageRating: 4.6,
        completionRate: 96,
        refundRate: 4,
      },
    });

    console.log("✅ Created 2 provider analytics records");

    // Create wallets for customers
    const wallet1 = await prisma.wallet.create({
      data: {
        userId: customer1.id,
        balance: 500,
        currency: "USD",
        locked: 0,
      },
    });

    const wallet2 = await prisma.wallet.create({
      data: {
        userId: customer2.id,
        balance: 250,
        currency: "USD",
        locked: 0,
      },
    });

    console.log("✅ Created 2 wallets");

    // Create wallet transactions
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet1.id,
        type: "ADD_FUNDS",
        amount: 500,
        balanceBefore: 0,
        balanceAfter: 500,
        note: "Initial wallet fund",
      },
    });

    console.log("✅ Created wallet transactions");

    // Create coupons
    const coupon1 = await prisma.coupon.create({
      data: {
        code: "SUMMER20",
        description: "20% off summer collection",
        discountType: "PERCENTAGE",
        discountValue: 20,
        maxUses: 100,
        maxUsesPerUser: 1,
        minPurchaseAmount: 50,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        active: true,
        timesUsed: 5,
      },
    });

    const coupon2 = await prisma.coupon.create({
      data: {
        code: "TECH50",
        description: "$50 off electronics",
        discountType: "FIXED",
        discountValue: 50,
        maxUses: 50,
        maxUsesPerUser: 1,
        minPurchaseAmount: 200,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        active: true,
        timesUsed: 12,
      },
    });

    console.log("✅ Created 2 coupons");

    // Create deals
    const now = new Date();
    const endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const deal1 = await prisma.deal.create({
      data: {
        title: "50% Off Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        category: "Electronics",
        imageUrl: "/images/headphones.jpg",
        originalPrice: 299.99,
        discountPrice: 149.99,
        platformFeePercent: 10,
        startTime: now,
        endTime: endTime,
        status: "ACTIVE",
        inventory: 50,
        sold: 5,
        providerId: providerProfile1.id,
        views: 250,
        clicks: 45,
        shares: 8,
        conversionRate: 18,
      },
    });

    const deal2 = await prisma.deal.create({
      data: {
        title: "Smart Watch Pro",
        description: "Latest smartwatch with health tracking features",
        category: "Electronics",
        imageUrl: "/images/smartwatch.jpg",
        originalPrice: 399.99,
        discountPrice: 299.99,
        platformFeePercent: 10,
        startTime: now,
        endTime: endTime,
        status: "ACTIVE",
        inventory: 30,
        sold: 3,
        providerId: providerProfile1.id,
        views: 180,
        clicks: 32,
        shares: 5,
        conversionRate: 10,
      },
    });

    const deal3 = await prisma.deal.create({
      data: {
        title: "Designer Summer Collection",
        description: "Exclusive summer dresses and outfits at discounted prices",
        category: "Fashion",
        imageUrl: "/images/fashion.jpg",
        originalPrice: 199.99,
        discountPrice: 99.99,
        platformFeePercent: 10,
        startTime: now,
        endTime: endTime,
        status: "ACTIVE",
        inventory: 100,
        sold: 12,
        providerId: providerProfile2.id,
        views: 420,
        clicks: 78,
        shares: 15,
        conversionRate: 12,
      },
    });

    const deal4 = await prisma.deal.create({
      data: {
        title: "Premium Sports Shoes",
        description: "Professional grade sports shoes for running and training",
        category: "Sports",
        imageUrl: "/images/shoes.jpg",
        originalPrice: 189.99,
        discountPrice: 129.99,
        platformFeePercent: 10,
        startTime: now,
        endTime: endTime,
        status: "ACTIVE",
        inventory: 75,
        sold: 8,
        providerId: providerProfile2.id,
        views: 310,
        clicks: 55,
        shares: 10,
        conversionRate: 10.3,
      },
    });

    const deal5 = await prisma.deal.create({
      data: {
        title: "Tablet Ultra Pro",
        description: "Powerful tablet with stunning display",
        category: "Electronics",
        imageUrl: "/images/tablet.jpg",
        originalPrice: 799.99,
        discountPrice: 599.99,
        platformFeePercent: 10,
        startTime: now,
        endTime: endTime,
        status: "ACTIVE",
        inventory: 20,
        sold: 2,
        providerId: providerProfile1.id,
        views: 150,
        clicks: 22,
        shares: 3,
        conversionRate: 10,
      },
    });

    console.log("✅ Created 5 deals");

    // Create purchases (orders)
    const purchase1 = await prisma.purchase.create({
      data: {
        userId: customer1.id,
        dealId: deal1.id,
        quantity: 1,
        subtotal: 149.99,
        platformFee: 15,
        total: 164.99,
        status: "PAID",
        stripeId: "ch_test_1",
        paymentMethod: "CARD",
        redeemed: true,
        redeemedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    });

    const purchase2 = await prisma.purchase.create({
      data: {
        userId: customer2.id,
        dealId: deal3.id,
        quantity: 2,
        subtotal: 199.98,
        platformFee: 20,
        total: 219.98,
        status: "PAID",
        stripeId: "ch_test_2",
        paymentMethod: "CARD",
        couponCode: "SUMMER20",
        redeemed: true,
        redeemedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    });

    const purchase3 = await prisma.purchase.create({
      data: {
        userId: customer1.id,
        dealId: deal4.id,
        quantity: 1,
        subtotal: 129.99,
        platformFee: 13,
        total: 142.99,
        status: "PENDING",
        stripeId: "ch_test_3",
        paymentMethod: "CARD",
      },
    });

    console.log("✅ Created 3 purchases");

    // Create reviews
    await prisma.review.create({
      data: {
        dealId: deal1.id,
        userId: customer1.id,
        rating: 5,
        comment: "Excellent headphones! Great sound quality and comfortable to wear.",
        verified: true,
        helpfulCount: 12,
      },
    });

    await prisma.review.create({
      data: {
        dealId: deal3.id,
        userId: customer2.id,
        rating: 4,
        comment: "Beautiful dresses, great value for money.",
        verified: true,
        helpfulCount: 8,
      },
    });

    console.log("✅ Created 2 reviews");

    // Create favorites
    await prisma.favorite.create({
      data: {
        userId: customer1.id,
        dealId: deal2.id,
      },
    });

    await prisma.favorite.create({
      data: {
        userId: customer2.id,
        dealId: deal5.id,
      },
    });

    console.log("✅ Created 2 favorites");

    // Create notifications
    await prisma.notification.create({
      data: {
        userId: customer1.id,
        type: "ORDER_CONFIRMATION",
        title: "Order Confirmed",
        content: "Your order for Wireless Headphones has been confirmed.",
        read: true,
        readAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.notification.create({
      data: {
        userId: customer1.id,
        type: "PAYMENT_RECEIVED",
        title: "Payment Received",
        content: "Your payment of $164.99 has been received.",
        read: true,
        readAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.notification.create({
      data: {
        userId: customer1.id,
        type: "DEAL_ENDING_SOON",
        title: "Deal Ending Soon",
        content: "Smart Watch Pro deal ends in 3 hours!",
        read: false,
      },
    });

    await prisma.notification.create({
      data: {
        userId: customer2.id,
        type: "NEW_DEAL",
        title: "New Fashion Deal",
        content: "Check out our latest designer collection!",
        read: false,
      },
    });

    console.log("✅ Created 4 notifications");

    // Create audit logs
    await prisma.auditLog.create({
      data: {
        action: "USER_CREATED",
        entity: "User",
        entityId: customer1.id,
        details: `Customer user created: ${customer1.email}`,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "DEAL_APPROVED",
        entity: "Deal",
        entityId: deal1.id,
        details: "Deal approved by admin",
      },
    });

    console.log("✅ Created 2 audit logs");

    console.log("✨ Database seed completed successfully!");
    console.log("\n📊 Seed Summary:");
    console.log("  - 1 Super Admin");
    console.log("  - 2 Customers with wallets");
    console.log("  - 2 Providers with profiles and analytics");
    console.log("  - 5 Active deals with analytics");
    console.log("  - 3 Purchases (orders)");
    console.log("  - 2 Reviews");
    console.log("  - 2 Favorites");
    console.log("  - 4 Notifications");
    console.log("  - 2 Coupons");
    console.log("  - 2 Audit logs");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
