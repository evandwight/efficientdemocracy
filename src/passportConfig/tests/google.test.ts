import db from '../../db/databaseApi';
import { verifyGoogleLogin } from '../google';
import Util from 'util';

const verifyGoogleLoginPromise = Util.promisify(verifyGoogleLogin);

describe("googlePassportConifg", () => {
    beforeEach(async () => {
        await db.initialize();
    });
    afterEach(async () => {
        await db.end();
    });

    describe('verifyGoogleLoginPromise', () => {
        it('logins existing users', async () => {
            let id = await db.users.createGoogleUserWithRandomName({ email: "b", googleId: "c" });
            let data: any = await verifyGoogleLoginPromise(null, null, { id: "c" });
            expect(data.id).toEqual(id);
        });
        it('creates a new user with a random user name', async () => {
            let data: any = await verifyGoogleLoginPromise(null, null, { id: "c", emails: [{ value: "b", verified: true }] });
            let user = await db.users.getUser(data.id);
            expect(user.id).toEqual(data.id);
        });
        it('doesnt register if the email is already registered', async () => {
            await db.users.createLocalUserWithRandomName({ email: "b", hashedPassword: "c" });
            await expect(async () => verifyGoogleLoginPromise(null, null, { id: "c", emails: [{ value: "b", verified: true }] }))
                .rejects.toThrowError("Email already exists");
        });
    });
});