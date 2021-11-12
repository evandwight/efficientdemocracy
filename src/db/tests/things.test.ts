import * as C from '../../constant';
import db from '../databaseApi';

describe("things", () => {
    beforeEach(async () => {
        await db.initialize();
    });
    afterEach(async () => {
        await db.end();
    });

    describe('create', () => {
        it('creates a thing and returns an id', async () => {
            let id = await db.things.create(C.THINGS.USER);
            expect(id).toBeTruthy();
        });
    });
});