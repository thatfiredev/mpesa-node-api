const mpesa = require('../index');
const expect = require('chai').expect;

describe('config', function () {
    describe('initializeApi throws an error when required config is missing', function () {
        const actualConfig = {
            baseUrl: "api.mpesa.co.mz"
        };
        try {
            mpesa.initializeApi(actualConfig)
        } catch (e) {
            expect(e).to.equal('Please provide a valid apiKey in the configuration when calling initializeApi()')
        }
    });

    describe('initializeApi works with valid config', function () {
        const actualConfig = {
            baseUrl: "api.mpesa.co.mz",
            apiKey: "apiKey",
            publicKey: "key",
            origin: "developer.mpesa.co.mz",
            serviceProviderCode: 171717
        };
        expect(function () {
            mpesa.initializeApi(actualConfig)
        }).to.not.throw();
    });
});
