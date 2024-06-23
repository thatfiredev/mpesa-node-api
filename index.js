require('dotenv').config();
const axios = require('axios').default;
const crypto = require('crypto');
const constants = require('constants');

let mpesaConfig;

function _getBearerToken(mpesa_public_key, mpesa_api_key) {
    const publicKey = "-----BEGIN PUBLIC KEY-----\n"+mpesa_public_key+"\n"+"-----END PUBLIC KEY-----";
    const buffer = Buffer.from(mpesa_api_key);
    const encrypted = crypto.publicEncrypt({
        'key': publicKey,
        'padding': constants.RSA_PKCS1_PADDING,
    }, buffer);
    return encrypted.toString("base64");
}

function initialize_api_from_dotenv() {
    if (!mpesaConfig) {
        mpesaConfig = {
            baseUrl: process.env.MPESA_API_HOST,
            apiKey: process.env.MPESA_API_KEY,
            publicKey: process.env.MPESA_PUBLIC_KEY,
            origin: process.env.MPESA_ORIGIN,
            serviceProviderCode: process.env.MPESA_SERVICE_PROVIDER_CODE
        };
        validateConfig(mpesaConfig);
        console.log("Using M-Pesa environment configuration");
    } else {
        console.log("Using custom M-Pesa configuration");
    }
}

function required_config_arg(argName) {
    return "Please provide a valid " + argName + " in the configuration when calling initializeApi()";
}

function validateConfig(configParams) {
    if (!configParams.baseUrl) {
        throw required_config_arg("baseUrl")
    }
    if (!configParams.apiKey) {
        throw required_config_arg("apiKey")
    }
    if (!configParams.publicKey) {
        throw required_config_arg("publicKey")
    }
    if (!configParams.origin) {
        throw required_config_arg("origin")
    }
    if (!configParams.serviceProviderCode) {
        throw required_config_arg("serviceProviderCode")
    }
}

module.exports.initializeApi = function (configParams) {
    validateConfig(configParams);
    mpesaConfig = configParams;
};

module.exports.initiate_c2b = async function (amount, msisdn, transaction_ref, thirdparty_ref) {
    initialize_api_from_dotenv();
    try {
        let response;
        response = await axios({
            method: 'post',
            url: 'https://' + mpesaConfig.baseUrl + ':18352/ipg/v1x/c2bPayment/singleStage/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + _getBearerToken(mpesaConfig.publicKey, mpesaConfig.apiKey),
                'Origin': mpesaConfig.origin
            },
            data: {
                "input_TransactionReference": transaction_ref,
                "input_CustomerMSISDN": msisdn + "",
                "input_Amount": amount + "",
                "input_ThirdPartyReference": thirdparty_ref,
                "input_ServiceProviderCode": mpesaConfig.serviceProviderCode + ""
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
    initialize_api_from_dotenv();
    try {
        let response;
        response = await axios({
            method: 'post',
            url: 'https://' + mpesaConfig.baseUrl + ':18345/ipg/v1x/b2cPayment/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + _getBearerToken(mpesaConfig.publicKey, mpesaConfig.apiKey),
                'Origin': mpesaConfig.origin
            },
            data: {
                "input_TransactionReference": transaction_ref,
                "input_CustomerMSISDN": msisdn + "",
                "input_Amount": amount + "",
                "input_ThirdPartyReference": thirdparty_ref,
                "input_ServiceProviderCode": mpesaConfig.serviceProviderCode + ""
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

module.exports.intiate_b2b = async function (input_Amount, input_TransactionReference, input_ThirdPartyReference, input_PrimaryPartyCode, input_ReceiverPartyCode) {
    initialize_api_from_dotenv();
    try {
        let response;
        response = await axios({
            method: 'post',
            url: 'https://' + mpesaConfig.baseUrl + ':18349/ipg/v1x/b2bPayment/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + _getBearerToken(mpesaConfig.publicKey, mpesaConfig.apiKey),
                'Origin': mpesaConfig.origin
            },
            data: {
                "input_TransactionReference": input_TransactionReference,
                "input_Amount": input_Amount + "",
                "input_ThirdPartyReference": input_ThirdPartyReference,
                "input_PrimaryPartyCode": input_PrimaryPartyCode,
                "input_ReceiverPartyCode": input_ReceiverPartyCode
            }
        });
        return response.data;
    } catch(e) {
        if (e.response && e.response.data) {
            throw e.response.data;
        } else {
            throw e;
        }
    }
}
