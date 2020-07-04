
var request = require('supertest');
import * as DatabaseProviderClass from '../server/database';
import { MockDatabaseProvider } from './mocks/MockDatabase';
var sinon = require('sinon');

const MOCK_PRODUCTS = [{
    "id": 1,
    "name": "Krew, pot i piksele. Chwalebne i niepokojące opowieści o tym, jak robi się gry ",
    "url": "https://www.empik.com/krew-pot-i-piksele-jak-powstaja-gry-wideo-schreier-jason,p1203623595,ksiazka-p",
    "prize": 38.49
}];

describe('API DELETE', function () {
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

    it('should return NO CONTENT', function testSlash(done) {
        request(server)
            .delete('/products/0')
            .expect(204, done)
    });

    it('should return NOT FOUND', function testSlash(done) {
        request(server)
            .delete('/products/1')
            .expect(404, done)
    });

    it('should return BAD REQUEST', function testSlash(done) {
        request(server)
            .delete('/products/aaa')
            .expect(400, done)
    });
});