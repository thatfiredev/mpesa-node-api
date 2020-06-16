require('dotenv-safe').config();
const axios = require('axios').default;
const crypto = require('crypto');
const constants = require('constants');

const MP_BASE_URL = process.env.MPESA_API_HOST;
const MP_API_KEY = process.env.MPESA_API_KEY;
const MP_PUBLIC_KEY = process.env.MPESA_PUBLIC_KEY;

function _getBearerToken(mpesa_public_key, mpesa_api_key) {
    const publicKey = "-----BEGIN PUBLIC KEY-----\n"+mpesa_public_key+"\n"+"-----END PUBLIC KEY-----";
    const buffer = Buffer.from(mpesa_api_key);
    const encrypted = crypto.publicEncrypt({
        'key': publicKey,
        'padding': constants.RSA_PKCS1_PADDING,
    }, buffer);
    return encrypted.toString("base64");
}

module.exports.initiate_c2b = async function (amount, msisdn, transaction_ref, thirdparty_ref) {
    try {
        let response;
        response = await axios({
            method: 'post',
            url: 'https://' + MP_BASE_URL + ':18352/ipg/v1x/c2bPayment/singleStage/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + _getBearerToken(MP_PUBLIC_KEY, MP_API_KEY),
                'Origin': process.env.MPESA_ORIGIN
            },
            data: {
                "input_TransactionReference": transaction_ref,
                "input_CustomerMSISDN": msisdn + "",
                "input_Amount": amount + "",
                "input_ThirdPartyReference": thirdparty_ref,
                "input_ServiceProviderCode": process.env.MPESA_SERVICE_PROVIDER_CODE
            }
        });
        return response.data;
    } catch (e) {
        if (e.response.data) {
            throw e.response.data;
        } else {
            throw e;
        }
    }
};

module.exports.initiate_b2c = async function (amount, msisdn, transaction_ref, thirdparty_ref) {
    try {
        let response;
        response = await axios({
            method: 'post',
            url: 'https://' + MP_BASE_URL + ':18345/ipg/v1x/b2cPayment/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + _getBearerToken(MP_PUBLIC_KEY, MP_API_KEY),
                'Origin': process.env.MPESA_ORIGIN
            },
            data: {
                "input_TransactionReference": transaction_ref,
                "input_CustomerMSISDN": msisdn + "",
                "input_Amount": amount + "",
                "input_ThirdPartyReference": thirdparty_ref,
                "input_ServiceProviderCode": process.env.MPESA_SERVICE_PROVIDER_CODE
            }
        });
        return response.data;
    } catch (e) {
        if (e.response.data) {
            throw e.response.data;
        } else {
            throw e;
        }
    }
};
