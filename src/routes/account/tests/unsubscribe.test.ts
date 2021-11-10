import * as C from '../../../constant';
import db from '../../../db/databaseApi';
import { notLoggedIn, testApi } from '../../../testUtils';

describe("unsubscribe", () => {
    beforeEach(async () => {
        await db.initialize();
    });
    afterEach(async () => {
        await db.end();
    });
    describe('unsubscribe', () => {
        it('works', async () => {
            const request = await notLoggedIn();
            const userId = await testApi.createUser({});
            await db.users.setSetting(userId, C.USER.COLUMNS.send_emails, true);
            let user = await db.users.getUser(userId);
            expect(user.send_emails).toBe(true);
            const res = await request.get(`${C.URLS.EMAIL_UNSUBSCRIBE}${userId}/${user.unsubscribe_key}`)
                .send()
                .expect(200);
            user = await db.users.getUser(userId)
            expect(user.send_emails).toBe(false);
        });
    });
});