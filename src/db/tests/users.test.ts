import db from '../databaseApi';
const {testApi} = require('../../testUtils');
import * as C from '../../constant';

describe("Users", () => {
    beforeEach(async () => {
        await db.initialize();
    });
    afterEach(async () => {
        await db.end();
    });
    
    describe('getUser', () => {
        it('creates a user and returns an id', async () => {
            let id = await testApi.createUser();
            let user = await db.users.getUser(id);
            expect(user.id).toEqual(id);
        });
    });
    
    describe('getUserByUserName', () => {
        it('doesnt shit the bed', async () => {
            let id = await testApi.createUser({userName: "a"});
            let user = await db.users.getUserByUserName("a");
            expect(user.id).toEqual(id);
        });
    });
    
    describe('getUserIds', () => {
        it('works', async () => {
            let id = await testApi.createUser();
            let users = await db.users.getUserIds();
            expect(users.length).toBe(1);
            expect(users[0]).toEqual(id);
        });
    });

    describe('getUserIdByUnsubscribeKey', () => {
        it('works', async () => {
            const id = await testApi.createUser();
            const user = await db.users.getUser(id);
            const userId = await db.users.getUserIdByUnsubscribeKey(user.unsubscribe_key);
            expect(userId).toEqual(id);
        });
    });

    describe('setSetting', () => {
        it('works', async () => {
            const id = await testApi.createUser();
            await db.users.setSetting(id, C.USER.COLUMNS.wants_mod, true);
            const user = await db.users.getUser(id);
            expect(user.wants_mod).toEqual(true);
        });
    });
});