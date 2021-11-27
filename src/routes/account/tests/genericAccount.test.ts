import * as C from '../../../constant';
import { login } from '../../../testUtils';
import db from '../../../db/databaseApi';

describe("genericAccount", () => {
    beforeEach(async () => {
        await db.initialize();
    });
    afterEach(async () => {
        await db.end();
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