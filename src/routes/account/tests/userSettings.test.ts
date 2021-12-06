import * as C from '../../../constant';
import db from '../../../db/databaseApi';
import { getCsrfToken, login } from '../../../testUtils';

describe("userSettings", () => {
    beforeEach(async () => {
        await db.initialize();
    });
    afterEach(async () => {
        await db.end();
    });
    describe('submitUserSettings', () => {
        it('works', async () => {
            const request = await login();
            const res = await request.get(C.URLS.USER_SETTINGS)
                .send()
                .expect(200);

            const csrfToken = getCsrfToken(res.text);
                
            await request.post(C.URLS.SUBMIT_USER_SETTINGS)
                    .type('form')
                    .send({
                        _csrf: csrfToken,
                        send_emails: true,
                        dm_participate: 'no',
                    }).expect(302);
            const user = await db.users.getUser(request.userId);
            expect(user.send_emails).toBe(true);
        });
    });
});