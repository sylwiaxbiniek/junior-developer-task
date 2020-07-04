
var request = require('supertest');
import * as DatabaseProviderClass from '../server/database';
import { MockDatabaseProvider } from './mocks/MockDatabase';
var sinon = require('sinon');
import * as assert from 'assert';

const MOCK_PRODUCTS = [{
    "id": 1,
    "name": "Krew, pot i piksele. Chwalebne i niepokojące opowieści o tym, jak robi się gry ",
    "url": "https://www.empik.com/krew-pot-i-piksele-jak-powstaja-gry-wideo-schreier-jason,p1203623595,ksiazka-p",
    "prize": 38.49
}];

const MOCK_PRODUCT = {
    "id": 3,
    "name": "Człowiek vs Komputer",
    "url": "https://gynvael.coldwind.pl/?id=712",
    "prize": 15.15
};

describe('API POST', function () {
    var server;
    var mockedDatabase;

    before(function () {
        mockedDatabase = sinon.stub(DatabaseProviderClass, 'DatabaseProvider').callsFake((args) => {
            return new MockDatabaseProvider({
                products: MOCK_PRODUCTS
            });
        });
        server = require('../server/server');
    });

    after(function () {
        mockedDatabase.restore();
    });

    afterEach(function () {
        server.close();
    });

    it('should return new item and its location', function testSlash(done) {
        request(server)
            .post('/products')
            .send(MOCK_PRODUCT)
            .expect(201)
            .expect('Location', '/products/1')
            .then(response => {
                assert.deepEqual(response.body, MOCK_PRODUCT);
                done();
            })
    });

    it('should return BAD REQUEST', function testSlash(done) {
        request(server)
            .post('/products')
            .send({ 'ala': 'ma kota' })
            .expect(400)
            .then(response => {
                done();
            })
    });
});