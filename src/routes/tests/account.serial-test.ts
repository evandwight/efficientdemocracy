import * as C from '../../constant';
import {testApi, login, getCsrfToken} from '../../testUtils';
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
});