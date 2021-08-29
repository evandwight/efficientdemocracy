import * as C from '../../constant';
import {testApi, login} from '../../testUtils';
import db from '../../db/databaseApi';

beforeAll(() => {
    return db.initialize();
});
afterAll(() => {
    return db.end();
});

describe("account", () => {
    beforeEach(() => {
        return testApi.deleteAll();
    });
    describe('login', () => {
        it('works', async () => {
            const request = await login();    
        });
    });

    describe('logout', () => {
        it('works', async () => {
            const request = await login();
            await request.get(C.URLS.USER_LOGOUT)
                .send()
                .expect(302);
        });
    });
});