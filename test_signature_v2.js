const crypto = require('crypto');

const SECRET_KEY = '2M@7w4EHV#&KN%fUFB2HrD*euQ8j2c674QhN85AqwYGuR95EaS$7GKD8pMddnz?u';
const MERCHANT_CODE = '255796769802';

function generateLink(algo) {
    const paramsToSign = {
        currency: 'USD',
        'return-type': 'redirect',
        expiration: (Math.floor(Date.now() / 1000) + 3600).toString(),
        ref_no: 'TEST_REF_V2_' + algo + '_' + Date.now(),
        prod: 'Test Product V2',
        price: '10.00',
        qty: '1',
        type: 'PRODUCT',
        tangible: '0'
    };

    // 1. Sort keys alphabetically
    const sortedKeys = Object.keys(paramsToSign).sort();

    // 2. Serialize: LEN(VALUE) + VALUE
    let stringToSign = '';
    sortedKeys.forEach(key => {
        const value = paramsToSign[key];
        stringToSign += value.length + value;
    });

    // 3. HMAC
    const signature = crypto.createHmac(algo, SECRET_KEY).update(stringToSign).digest('hex');

    // 4. Construct URL params
    const allParams = {
        merchant: MERCHANT_CODE,
        dynamic: '1',
        ...paramsToSign,
        signature: signature
    };

    const queryString = Object.keys(allParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key])}`)
        .join('&');

    let url = `https://secure.2checkout.com/checkout/buy?${queryString}&debug=1`;
    if (algo === 'sha256') {
        url += '&algo=sha256';
    }

    return { url, stringToSign };
}

const sha256Link = generateLink('sha256');
const md5Link = generateLink('md5');

console.log('SHA256 URL:', sha256Link.url);
console.log('SHA256 String to Sign:', sha256Link.stringToSign);
console.log('---');
console.log('MD5 URL:', md5Link.url);
console.log('MD5 String to Sign:', md5Link.stringToSign);
