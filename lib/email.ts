import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // Use TLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

export interface OrderConfirmationData {
    buyerEmail: string
    buyerName: string
    orderItems: {
        dealTitle: string
        price: number
        quantity: number
    }[]
    total: number
    orderNumber: string
}

export interface NewSaleData {
    sellerEmail: string
    sellerName: string
    buyerName: string
    dealTitle: string
    amount: number
    orderNumber: string
}

export async function sendOrderConfirmation(data: OrderConfirmationData) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('SMTP not configured. Skipping order confirmation email.')
        return
    }

    const { buyerEmail, buyerName, orderItems, total, orderNumber } = data

    const itemsHtml = orderItems
        .map(
            item => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.dealTitle}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        </tr>
    `
        )
        .join('')

    const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #1e40af; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
        th { background: #f3f4f6; padding: 12px; text-align: left; }
        .total { font-size: 18px; font-weight: bold; padding: 16px; text-align: right; background: #f3f4f6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thank You for Your Purchase!</h1>
        </div>
        <div class="content">
            <p>Hi ${buyerName},</p>
            <p>Your order has been confirmed! Here are your order details:</p>
            
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            
            <table>
                <thead>
                    <tr>
                        <th>Deal</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr class="total">
                        <td colspan="2">Total:</td>
                        <td style="text-align: right;">$${total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            
            <p>You can view your order details and download your products in your account.</p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/customer/orders" class="button">View My Orders</a>
            
            <p>If you have any questions, feel free to contact us.</p>
            
            <p>Best regards,<br>The Why Deals Team</p>
        </div>
    </div>
</body>
</html>
    `

    await transporter.sendMail({
        from: `"Why Deals" <${process.env.SMTP_USER}>`,
        to: buyerEmail,
        subject: `Order Confirmation - #${orderNumber}`,
        html,
    })

    console.log(`✅ Order confirmation sent to ${buyerEmail}`)
}

export async function sendNewSaleNotification(data: NewSaleData) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('SMTP not configured. Skipping new sale notification.')
        return
    }

    const { sellerEmail, sellerName, buyerName, dealTitle, amount, orderNumber } = data

    const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #10b981; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .sale-box { background: white; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .amount { font-size: 32px; font-weight: bold; color: #10b981; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 New Sale!</h1>
        </div>
        <div class="content">
            <p>Hi ${sellerName},</p>
            <p>Great news! You just made a sale.</p>
            
            <div class="sale-box">
                <p><strong>Deal:</strong> ${dealTitle}</p>
                <p><strong>Customer:</strong> ${buyerName}</p>
                <p><strong>Order #:</strong> ${orderNumber}</p>
                <p class="amount">$${amount.toFixed(2)}</p>
            </div>
            
            <p>Check your dashboard to see all the details and manage your orders.</p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/seller/orders" class="button">View Orders</a>
            
            <p>Keep up the great work!</p>
            
            <p>Best regards,<br>The Why Deals Team</p>
        </div>
    </div>
</body>
</html>
    `

    await transporter.sendMail({
        from: `"Why Deals" <${process.env.SMTP_USER}>`,
        to: sellerEmail,
        subject: `🎉 New Sale - ${dealTitle}`,
        html,
    })

    console.log(`✅ New sale notification sent to ${sellerEmail}`)
}
