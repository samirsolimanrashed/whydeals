import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { create2CheckoutOrder, generateHostedCheckoutUrl } from '@/lib/2checkout';

export async function POST(req: Request) {
    console.log("2Checkout API Route Hit");
    try {
        const body = await req.json();
        console.log("Request Body:", JSON.stringify(body, null, 2));
        const { token, dealId, userId, quantity, billingDetails, items: requestItems } = body;

        // Normalize items to an array
        let orderItems: { dealId: string; quantity: number }[] = [];
        if (dealId) {
            orderItems.push({ dealId, quantity: quantity || 1 });
        } else if (requestItems && Array.isArray(requestItems)) {
            orderItems = requestItems;
        }

        if (orderItems.length === 0 || !userId || (!token && !body.cardData)) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Fetch Deals
        const dealIds = orderItems.map(item => item.dealId);
        const deals = await prisma.deal.findMany({
            where: { id: { in: dealIds } },
        });

        if (deals.length !== orderItems.length) {
            return NextResponse.json({ error: 'One or more deals not found' }, { status: 404 });
        }

        // Calculate totals and construct 2Checkout Items
        let totalOrderAmount = 0;
        const tcoItems = deals.map(deal => {
            const item = orderItems.find(i => i.dealId === deal.id);
            const qty = item?.quantity || 1;
            const price = deal.discountPrice || deal.originalPrice;
            totalOrderAmount += price * qty;

            return {
                Code: deal.id,
                Quantity: qty,
                Price: {
                    Amount: price,
                    Type: 'CUSTOM'
                },
                Name: deal.title
            };
        });

        // 2. Create Order in 2Checkout
        let paymentDetails: any = {
            Type: 'TEST',
            Currency: 'USD',
            PaymentMethod: {
                EesToken: token,
                Vendor3DSReturnURL: `${process.env.NEXT_PUBLIC_APP_URL}/customer/checkout/callback`,
                Vendor3DSCancelURL: `${process.env.NEXT_PUBLIC_APP_URL}/customer/checkout/cancel`
            }
        };

        if (body.cardData && body.cardData.number) {
            paymentDetails = {
                Type: 'TEST',
                Currency: 'USD',
                PaymentMethod: {
                    Card: {
                        CardNumber: body.cardData.number.replace(/\s/g, ''),
                        ExpirationMonth: body.cardData.expiry.split('/')[0],
                        ExpirationYear: '20' + body.cardData.expiry.split('/')[1],
                        CVV: body.cardData.cvv,
                        HolderName: body.cardData.name
                    }
                }
            };
        }

        const orderPayload: any = {
            Currency: 'USD',
            Language: 'en',
            Country: billingDetails?.country || 'US',
            CustomerIP: '127.0.0.1',
            Source: '2CHECKOUT_API_6.0',
            BillingDetails: {
                FirstName: billingDetails?.firstName || 'John',
                LastName: billingDetails?.lastName || 'Doe',
                Email: billingDetails?.email || 'test@example.com',
                Address1: '123 Test St',
                City: 'Test City',
                State: 'Test State',
                Zip: '12345',
                CountryCode: 'US'
            },
            Items: tcoItems,
            PaymentDetails: paymentDetails
        };

        // Generate Hosted Checkout URL
        // We use the same payload structure but pass it to the URL generator
        // Add a RefNo for tracking
        const refNo = `ORD_${Date.now()}_${userId.substring(0, 5)}`;
        orderPayload.RefNo = refNo; // Add to payload for signature generation

        const redirectUrl = generateHostedCheckoutUrl(orderPayload);

        // 3. Create Purchase Records in DB (PENDING)
        // We create them as PENDING now, they will be updated to PAID via Webhook or Success Page callback
        const purchases = await prisma.$transaction(
            deals.map(deal => {
                const item = orderItems.find(i => i.dealId === deal.id);
                const qty = item?.quantity || 1;
                const price = deal.discountPrice || deal.originalPrice;
                const lineTotal = price * qty;

                return prisma.purchase.create({
                    data: {
                        userId,
                        dealId: deal.id,
                        quantity: qty,
                        subtotal: lineTotal,
                        platformFee: lineTotal * 0.40,
                        total: lineTotal,
                        status: 'PENDING', // Changed to PENDING
                        paymentProvider: '2CHECKOUT',
                        transactionId: refNo, // Use our generated RefNo
                        paymentMethod: 'CARD',
                    },
                });
            })
        );

        // 4. Send Email Notifications
        try {
            const { sendOrderConfirmation, sendNewSaleNotification } = await import('@/lib/email');

            // Fetch buyer details
            const buyer = await prisma.user.findUnique({ where: { id: userId } });

            if (buyer) {
                // Send Order Confirmation to Buyer
                await sendOrderConfirmation({
                    buyerEmail: buyer.email,
                    buyerName: buyer.name || 'Customer',
                    orderItems: deals.map(deal => {
                        const item = orderItems.find(i => i.dealId === deal.id);
                        return {
                            dealTitle: deal.title,
                            price: deal.discountPrice || deal.originalPrice,
                            quantity: item?.quantity || 1
                        };
                    }),
                    total: totalOrderAmount,
                    orderNumber: refNo
                });

                // Send New Sale Notification to each Seller
                for (const deal of deals) {
                    const seller = await prisma.sellerProfile.findUnique({
                        where: { id: deal.sellerId },
                        include: { user: true }
                    });

                    if (seller) {
                        const item = orderItems.find(i => i.dealId === deal.id);
                        const amount = (deal.discountPrice || deal.originalPrice) * (item?.quantity || 1);

                        await sendNewSaleNotification({
                            sellerEmail: seller.user.email,
                            sellerName: seller.user.name || seller.businessName,
                            buyerName: buyer.name || buyer.email,
                            dealTitle: deal.title,
                            amount,
                            orderNumber: refNo
                        });
                    }
                }
            }
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the entire checkout if email fails
        }

        return NextResponse.json({ success: true, redirectUrl, purchaseId: purchases[0].id });

    } catch (error: any) {
        console.error('Checkout Error:', error);
        return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 });
    }
}
