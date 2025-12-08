const crypto = require('crypto');

const SECRET_KEY = '2M@7w4EHV#&KN%fUFB2HrD*euQ8j2c674QhN85AqwYGuR95EaS$7GKD8pMddnz?u';
const MERCHANT_CODE = '255796769802';

const params = {
    merchant: MERCHANT_CODE,
    dynamic: '1',
    currency: 'USD',
    'return-type': 'redirect',
    expiration: (Math.floor(Date.now() / 1000) + 3600).toString(),
    ref_no: 'TEST_REF_MD5_' + Date.now(),
    prod: 'Test Product MD5',
    price: '10.00',
    qty: '1',
    type: 'PRODUCT',
    tangible: '0'
};

// 1. Sort keys alphabetically
const sortedKeys = Object.keys(params).sort();

// 2. Serialize: LEN(VALUE) + VALUE
let stringToSign = '';
sortedKeys.forEach(key => {
    const value = params[key];
    stringToSign += value.length + value;
});

// 3. HMAC-MD5
const signature = crypto.createHmac('md5', SECRET_KEY).update(stringToSign).digest('hex');

// 4. Add signature to params
params.signature = signature;

// Construct URL
const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

// Note: algo param is usually not needed for MD5 as it's the default, but we can omit it or check docs.
// Usually 2Checkout defaults to MD5 if algo is missing.
const url = `https://secure.2checkout.com/checkout/buy?${queryString}&debug=1`;

console.log('Generated MD5 URL:', url);
console.log('String to Sign:', stringToSign);
