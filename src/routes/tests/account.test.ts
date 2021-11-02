import * as C from '../../constant';
import {testApi, login, getCsrfToken, notLoggedIn} from '../../testUtils';
import db from '../../db/databaseApi';

describe("account", () => {
    beforeEach(async () => {
        await db.initialize();
    });
    afterEach(async () => {
        await db.end();
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
                    }).expect(302);
            const user = await db.users.getUser(request.userId);
            expect(user.send_emails).toBe(true);
        });
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