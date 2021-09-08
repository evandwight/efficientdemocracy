import db from './db/databaseApi';
import { verifyGoogleLogin } from './googlePassportConfig';
const {testApi} = require('./testUtils');
import Util from 'util';

beforeAll(() => {
    return db.initialize();
});
afterAll(() => {
    return db.end();
});

const verifyGoogleLoginPromise = Util.promisify(verifyGoogleLogin);

describe("googlePassportConifg", () => {
    beforeEach(() => {
        return testApi.deleteAll();
    });
    
    describe('processGoogleLogin', () => {
        it('logins existing users', async () => {
            let id = await db.users.createGoogleUserWithRandomName({email: "b", googleId: "c"});
            let data :any= await verifyGoogleLoginPromise(null, null, {id: "c"});
            expect(data.id).toEqual(id);
        });
        it('creates a new user with a random user name', async () => {
            let data :any= await verifyGoogleLoginPromise(null, null, {id: "c", emails: [{value:"b", verified: true}]});
            let user = await db.users.getUser(data.id);
            expect(user.id).toEqual(data.id);
        });
    });
});