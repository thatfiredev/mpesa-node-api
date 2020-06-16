# M-Pesa Node API

Node.js wrapper for the M-Pesa Mozambique API.

## Using the API

1. Install it using npm:
    ```shell
    npm install mpesa-node-api
    ```
   
1. Create the configuration `.env` file on your root directory based on [`.env.example`](.env.example):
    ```shell
    cp .env.example .env
    ```
   
1. Use your favorite text editor to edit the `.env` file and fill in the blank lines with configuration
 you got from the [M-Pesa Developer Portal](https://developer.mpesa.vm.co.mz/). See an example:
    ```shell
    MPESA_PUBLIC_KEY=example_public_key
    MPESA_API_HOST=api.sandbox.vm.co.mz
    MPESA_API_KEY=example_api_key
    MPESA_ORIGIN=developer.mpesa.vm.co.mz
    MPESA_SERVICE_PROVIDER_CODE=171717
    ``` 
   
1. In your JavaScript file, import the package using `require()`:
    ```js
    const mpesa = require('mpesa-node-api');
    ```
   
### Supported Transactions

All transactions return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 So you can either use `then/catch` or `async/await` to get the transaction response.
 
Responses match the ones specified on the [M-Pesa API Documentation](https://developer.mpesa.vm.co.mz/apis/).

Example C2B response:

```json
{
  "output_ConversationID": "f02f957c19f4499faf6a6f19c0307e69",
  "output_ResponseCode": "INS-0",
  "output_ResponseDesc": "Request processed successfully",
  "output_ThirdPartyReference": "ZXVM9H",
  "output_TransactionID": "f449abol7j38"
}
```

#### Customer to Business (C2B)
```js
const mpesa = require('mpesa-node-api');

mpesa.initiate_c2b(/* amount */ 10, /* msisdn */ 258843330333, /* transaction ref */ 'T12344C', /*3rd party ref*/ 'ref1')
    .then(function(response) {
      // logging the response
      console.log(response);
    })
    .catch(function(error) {
      // TODO: handle errors
    });
```

#### Business to Customer (B2C)
```js
const mpesa = require('mpesa-node-api');

mpesa.initiate_b2c(/* amount */ 10, /* msisdn */ 258843330333, /* transaction ref */ 'T12344C', /*3rd party ref*/ 'ref1')
    .then(function(response) {
      // logging the response
      console.log(response);
    })
    .catch(function(error) {
      // TODO: handle errors
    });
```

### Planned Support:
- [ ] B2B
- [ ] Reversal
- [ ] Query Transaction Status

## Getting a copy for development

These instructions will get you a copy of the project up and running on
your local machine for development and testing purposes.

### Prerequisites

Make sure you have installed [Node.js](https://nodejs.org/en/), which comes with `npm`.

### Installing

1. Fork the GitHub repository.
1. Clone it to your local machine using `git clone https://github.com/<YOUR-USERNAME>/mpesa-node-api.git`
1. Navigate into the project's directory using `cd mpesa-node-api`; 
1. Install dependencies using `npm run install`.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the process
 for submitting pull requests to us.

## License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for
details.

## Acknowledgments

Inspired by the [mpesa-php-api](https://github.com/abdulmueid/mpesa-php-api) created by
[Abdul Mueid](https://github.com/abdulmueid/).
