jest.mock('bcrypt');
import db from '../../db/databaseApi';
import { authenticateUser } from '../local';
import Util from 'util';
import bcrypt from 'bcrypt';

const authenticateUserPromise = Util.promisify(authenticateUser);

let mockBcrypt:any = bcrypt;

describe("localPassportConfig", () => {
    beforeEach(async () => {
        await db.initialize();
    });
    afterEach(async () => {
        await db.end();
    });

    describe('authenticateUser', () => {
        it('logins existing users', async () => {
            mockBcrypt.compare = jest.fn(() => true);
            let id = await db.users.createLocalUserWithRandomName({ email: "a@a.com", hashedPassword: "c"});
            let user: any = await authenticateUserPromise("a@a.com", "correct");
            expect(user.id).toEqual(id);
        });
        it('rejects non-existant emails', async () => {
            mockBcrypt.compare = jest.fn(() => true);
            expect(await authenticateUserPromise("a@a.com", "correct?")).toBe(false);
            // To avoid leaking whether the email exists through a timing attack
            // we must call bcrypt no matter what
            expect(mockBcrypt.compare.mock.calls.length).toBe(1);
        });
        it('rejects bad passwords', async () => {
            mockBcrypt.compare = jest.fn(() => false);
            let id = await db.users.createLocalUserWithRandomName({ email: "a@a.com", hashedPassword: "c"});
            expect(await authenticateUserPromise("a@a.com", "wrong")).toBe(false);
        });
    });
});