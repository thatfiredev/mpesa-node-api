import dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';
import crypto from 'crypto';
import constants from 'constants';

dotenv.config();

interface MpesaConfig {
    baseUrl: string;
    apiKey: string;
    publicKey: string;
    origin: string;
    serviceProviderCode: string;
}

let mpesaConfig: MpesaConfig | undefined;

function _getBearerToken(mpesa_public_key: string, mpesa_api_key: string): string {
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${mpesa_public_key}\n-----END PUBLIC KEY-----`;
    const buffer = Buffer.from(mpesa_api_key);
    const encrypted = crypto.publicEncrypt({
        key: publicKey,
        padding: constants.RSA_PKCS1_PADDING,
    }, buffer);
    return encrypted.toString("base64");
}

function initialize_api_from_dotenv(): void {
    if (!mpesaConfig) {
        mpesaConfig = {
            baseUrl: process.env.MPESA_API_HOST || '',
            apiKey: process.env.MPESA_API_KEY || '',
            publicKey: process.env.MPESA_PUBLIC_KEY || '',
            origin: process.env.MPESA_ORIGIN || '',
            serviceProviderCode: process.env.MPESA_SERVICE_PROVIDER_CODE || ''
        };
        validateConfig(mpesaConfig);
        console.log("Using M-Pesa environment configuration");
    } else {
        console.log("Using custom M-Pesa configuration");
    }
}

function required_config_arg(argName: string): string {
    return `Please provide a valid ${argName} in the configuration when calling initializeApi()`;
}

function validateConfig(configParams: MpesaConfig): void {
    if (!configParams.baseUrl) {
        throw required_config_arg("baseUrl");
    }
    if (!configParams.apiKey) {
        throw required_config_arg("apiKey");
    }
    if (!configParams.publicKey) {
        throw required_config_arg("publicKey");
    }
    if (!configParams.origin) {
        throw required_config_arg("origin");
    }
    if (!configParams.serviceProviderCode) {
        throw required_config_arg("serviceProviderCode");
    }
}

export const initializeApi = (configParams: MpesaConfig): void => {
    validateConfig(configParams);
    mpesaConfig = configParams;
};

export const initiate_c2b = async (amount: number, msisdn: string, transaction_ref: string, thirdparty_ref: string): Promise<any> => {
    initialize_api_from_dotenv();
    try {
        const response: AxiosResponse = await axios({
            method: 'post',
            url: `https://${mpesaConfig?.baseUrl}:18352/ipg/v1x/c2bPayment/singleStage/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${_getBearerToken(mpesaConfig?.publicKey || '', mpesaConfig?.apiKey || '')}`,
                'Origin': mpesaConfig?.origin || ''
            },
            data: {
                "input_TransactionReference": transaction_ref,
                "input_CustomerMSISDN": msisdn,
                "input_Amount": amount.toString(),
                "input_ThirdPartyReference": thirdparty_ref,
                "input_ServiceProviderCode": mpesaConfig?.serviceProviderCode || ''
            }
        });
        return response.data;
    } catch (e: any) {
        if (e.response?.data) {
            throw e.response.data;
        } else {
            throw e;
        }
    }
};

export const initiate_b2c = async (amount: number, msisdn: string, transaction_ref: string, thirdparty_ref: string): Promise<any> => {
    initialize_api_from_dotenv();
    try {
        const response: AxiosResponse = await axios({
            method: 'post',
            url: `https://${mpesaConfig?.baseUrl}:18345/ipg/v1x/b2cPayment/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${_getBearerToken(mpesaConfig?.publicKey || '', mpesaConfig?.apiKey || '')}`,
                'Origin': mpesaConfig?.origin || ''
            },
            data: {
                "input_TransactionReference": transaction_ref,
                "input_CustomerMSISDN": msisdn,
                "input_Amount": amount.toString(),
                "input_ThirdPartyReference": thirdparty_ref,
                "input_ServiceProviderCode": mpesaConfig?.serviceProviderCode || ''
            }
        });
        return response.data;
    } catch (e: any) {
        if (e.response?.data) {
            throw e.response.data;
        } else {
            throw e;
        }
    }
};
