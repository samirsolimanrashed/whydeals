import axios from 'axios';
import crypto from 'crypto';

const TWOCHECKOUT_API_URL = 'https://api.2checkout.com/rest/6.0';
const MERCHANT_CODE = process.env.TWOCHECKOUT_MERCHANT_CODE;
const SECRET_KEY = process.env.TWOCHECKOUT_SECRET_KEY || '2M@7w4EHV#&KN%fUFB2HrD*euQ8j2c674QhN85AqwYGuR95EaS$7GKD8pMddnz?u';

if (!MERCHANT_CODE || !SECRET_KEY) {
    console.warn('2Checkout credentials are not set in environment variables.');
}

// Generate Auth Headers
const getAuthHeaders = () => {
    if (!MERCHANT_CODE || !SECRET_KEY) {
        throw new Error("Missing 2Checkout credentials");
    }

    // Format date as Y-m-d H:i:s (UTC)
    const now = new Date();
    const pad = (n: number) => n < 10 ? '0' + n : n;
    const dateStr = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}`;

    // String to sign: LEN(MERCHANT_CODE) + MERCHANT_CODE + LEN(DATE) + DATE
    const stringToSign = `${MERCHANT_CODE.length}${MERCHANT_CODE}${dateStr.length}${dateStr}`;

    // Generate HMAC-SHA256 hash
    const hash = crypto.createHmac('sha256', SECRET_KEY).update(stringToSign).digest('hex');

    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Avangate-Authentication': `code="${MERCHANT_CODE}" date="${dateStr}" hash="${hash}" algo="sha256"`
    };
};

export const create2CheckoutOrder = async (orderData: any) => {
    try {
        if (!MERCHANT_CODE || !SECRET_KEY) {
            console.warn("Missing 2Checkout credentials, returning mock data");
            return {
                RefNo: "MOCK_" + Date.now(),
                Status: "AUTHRECEIVED",
                Total: orderData.BillingDetails?.Total || 0 // Handle potential missing Total in mock
            };
        }

        console.log("Sending order to 2Checkout...", JSON.stringify(orderData, null, 2));

        const response = await axios.post(`${TWOCHECKOUT_API_URL}/orders/`, orderData, {
            headers: getAuthHeaders()
        });

        console.log("2Checkout Response:", response.data);
        return response.data;

    } catch (error: any) {
        console.error('2Checkout API Error:', error.response?.data || error.message);
        // If it's an API error, throw it so the caller knows
        if (error.response) {
            throw new Error(`2Checkout Error: ${JSON.stringify(error.response.data)}`);
        }
        throw error;
    }
};
export const generateHostedCheckoutUrl = (orderData: any) => {
    if (!MERCHANT_CODE || !SECRET_KEY) {
        throw new Error("Missing 2Checkout credentials");
    }

    const params: Record<string, string> = {
        merchant: MERCHANT_CODE,
        dynamic: '1',
        currency: orderData.Currency || 'USD',
        'return-type': 'redirect',
        expiration: (Math.floor(Date.now() / 1000) + 3600).toString(),
        ref_no: orderData.RefNo || ('REF_' + Date.now()),
    };

    if (orderData.PaymentDetails?.PaymentMethod?.Vendor3DSReturnURL) {
        params['return-url'] = orderData.PaymentDetails.PaymentMethod.Vendor3DSReturnURL;
    }

    // Add items using semicolon separation
    if (orderData.Items && Array.isArray(orderData.Items) && orderData.Items.length > 0) {
        params['prod'] = orderData.Items.map((i: any) => i.Name).join(';');
        params['price'] = orderData.Items.map((i: any) => Number(i.Price.Amount).toFixed(2)).join(';');
        params['qty'] = orderData.Items.map((i: any) => i.Quantity.toString()).join(';');
        params['type'] = orderData.Items.map(() => 'PRODUCT').join(';');
        params['tangible'] = orderData.Items.map(() => '0').join(';');
    }

    // Generate Signature
    // 1. Sort keys alphabetically
    // We only sign the parameters that define the purchase. 
    // According to docs, 'merchant' is excluded, but 'dynamic' should be included.
    const paramsToSign: Record<string, string> = { ...params };
    delete paramsToSign.merchant;

    const sortedKeys = Object.keys(paramsToSign).sort();

    // 2. Serialize: LEN(VALUE) + VALUE
    let stringToSign = '';
    sortedKeys.forEach(key => {
        const value = paramsToSign[key];
        stringToSign += value.length + value;
    });

    // 3. HMAC-SHA256
    const signature = crypto.createHmac('sha256', SECRET_KEY).update(stringToSign).digest('hex');

    // 4. Add signature to params
    params.signature = signature;

    // Construct URL
    const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

    // Append algo (not signed)
    const url = `https://secure.2checkout.com/checkout/buy?${queryString}&algo=sha256`;
    console.log("Generated 2Checkout URL:", url);

    // Write to file for debugging
    const fs = require('fs');
    fs.writeFileSync('debug_url.txt', url + '\n' + JSON.stringify(params, null, 2) + '\nString to sign: ' + stringToSign);

    return url;
};
