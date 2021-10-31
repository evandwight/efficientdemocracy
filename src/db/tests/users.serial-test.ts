import db from '../../db/databaseApi';
const {testApi} = require('../../testUtils');
import * as C from '../../constant';

beforeAll(() => {
    return db.initialize();
});
afterAll(() => {
    return db.end();
});

describe("Users", () => {
    beforeEach(() => {
        return testApi.deleteAll();
    });
    
    describe('createUser', () => {
        it('creates a user and returns an id', async () => {
            let id = await db.users.createUser({userName:"a", name: "a", email: "b", hashedPassword: "c"});
            expect(id).toBeTruthy();
        });
    });
    
    describe('getUser', () => {
        it('creates a user and returns an id', async () => {
            let id = await db.users.createUser({userName:"a", name: "a", email: "b", hashedPassword: "c"});
            let user = await db.users.getUser(id);
            expect(user.id).toEqual(id);
            expect(user.name).toEqual("a");
        });
    });
    
    describe('getUserByEmail', () => {
        it('doesnt shit the bed', async () => {
            let id = await db.users.createUser({userName:"a", name: "a", email: "b", hashedPassword: "c"});
            let user = await db.users.getUserByEmail("b");
            expect(user.id).toEqual(id);
            expect(user.name).toEqual("a");
        });
    });
    
    describe('getUserByUserName', () => {
        it('doesnt shit the bed', async () => {
            let id = await db.users.createUser({userName:"a", name: "d", email: "b", hashedPassword: "c"});
            let user = await db.users.getUserByUserName("a");
            expect(user.id).toEqual(id);
            expect(user.name).toEqual("d");
        });
    });
    
    describe('getUserIds', () => {
        it('works', async () => {
            let id = await db.users.createUser({userName:"a", name: "a", email: "b", hashedPassword: "c"});
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
            console.log(expect.getState());
            const id = await testApi.createUser();
            await db.users.setSetting(id, C.USER.COLUMNS.wants_mod, true);
            const user = await db.users.getUser(id);
            expect(user.wants_mod).toEqual(true);
        });
    });
});