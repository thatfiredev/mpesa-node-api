import { config } from "dotenv";
import axios from "axios";
import { publicEncrypt } from "crypto";
import { RSA_PKCS1_PADDING } from "constants";

config();
let mpesaConfig;

function _getBearerToken(mpesa_public_key, mpesa_api_key) {
  const publicKey =
    "-----BEGIN PUBLIC KEY-----\n" +
    mpesa_public_key +
    "\n" +
    "-----END PUBLIC KEY-----";
  const buffer = Buffer.from(mpesa_api_key);
  const encrypted = publicEncrypt(
    {
      key: publicKey,
      padding: RSA_PKCS1_PADDING,
    },
    buffer
  );
  return encrypted.toString("base64");
}

function initialize_api_from_dotenv() {
  if (!mpesaConfig) {
    mpesaConfig = {
      baseUrl: process.env.MPESA_API_HOST,
      apiKey: process.env.MPESA_API_KEY,
      publicKey: process.env.MPESA_PUBLIC_KEY,
      origin: process.env.MPESA_ORIGIN,
      serviceProviderCode: process.env.MPESA_SERVICE_PROVIDER_CODE,
    };
    validateConfig(mpesaConfig);
    console.log("Using M-Pesa environment configuration");
  } else {
    console.log("Using custom M-Pesa configuration");
  }
}

function required_config_arg(argName) {
    throw new Error("Please provide a valid " + argName + " in the configuration when calling initializeApi()")
}

function validateConfig(configParams) {
  if (!configParams.baseUrl) {
    required_config_arg("baseUrl");
  }
  if (!configParams.apiKey) {
    required_config_arg("apiKey");
  }
  if (!configParams.publicKey) {
    required_config_arg("publicKey");
  }
  if (!configParams.origin) {
    required_config_arg("origin");
  }
  if (!configParams.serviceProviderCode) {
    required_config_arg("serviceProviderCode");
  }
}

export function initializeApi(configParams) {
  validateConfig(configParams);
  mpesaConfig = configParams;
}

export async function initiate_c2b(
  amount,
  msisdn,
  transaction_ref,
  thirdparty_ref
) {
  initialize_api_from_dotenv();

  try {
    const response = await axios({
      method: "post",
      url:
        "https://" +
        mpesaConfig.baseUrl +
        ":18352/ipg/v1x/c2bPayment/singleStage/",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          _getBearerToken(mpesaConfig.publicKey, mpesaConfig.apiKey),
        Origin: mpesaConfig.origin,
      },
      data: {
        input_TransactionReference: transaction_ref,
        input_CustomerMSISDN: msisdn + "",
        input_Amount: amount + "",
        input_ThirdPartyReference: thirdparty_ref,
        input_ServiceProviderCode: mpesaConfig.serviceProviderCode + "",
      },
    });
    return response.data;
  } catch (e) {
    return e.response.data;
  }
}

export async function initiate_b2c(
  amount,
  msisdn,
  transaction_ref,
  thirdparty_ref
) {
  initialize_api_from_dotenv();
  try {
    const response = await axios({
      method: "post",
      url: "https://" + mpesaConfig.baseUrl + ":18345/ipg/v1x/b2cPayment/",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          _getBearerToken(mpesaConfig.publicKey, mpesaConfig.apiKey),
        Origin: mpesaConfig.origin,
      },
      data: {
        input_TransactionReference: transaction_ref,
        input_CustomerMSISDN: msisdn + "",
        input_Amount: amount + "",
        input_ThirdPartyReference: thirdparty_ref,
        input_ServiceProviderCode: mpesaConfig.serviceProviderCode + "",
      },
    });
    return response.data;
  } catch (e) {
    if (e.response?.data) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
}
