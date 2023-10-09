import { initializeApi } from '../index';
import { expect } from 'chai';

describe('config', function () {
    it('initializeApi throws an error when required config is missing', function () {
        const actualConfig = {
            baseUrl: "api.mpesa.co.mz"
        };
        try {
            initializeApi(actualConfig)
        } catch (e) {
            expect(e).to.equal('Please provide a valid apiKey in the configuration when calling initializeApi()')
        }
    });

    it('initializeApi works with valid config', function () {
        const actualConfig = {
            baseUrl: "api.mpesa.co.mz",
            apiKey: "apiKey",
            publicKey: "key",
            origin: "developer.mpesa.co.mz",
            serviceProviderCode: 171717
        };
        expect(function () {
            initializeApi(actualConfig)
        }).to.not.throw();
    });
});
