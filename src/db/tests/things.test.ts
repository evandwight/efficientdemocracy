import * as C from '../../constant';
import { sameUuid, withMockUuidv4 } from '../../testUtils';
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
        it('creates a thing when uuids collide once expect-db-error', async () => {
            return withMockUuidv4(db, sameUuid(2, db.uuidv4()), 
                async (mockDb) => {
                    await mockDb.things.create(C.THINGS.USER);
                    let id = await mockDb.things.create(C.THINGS.USER);
                    expect(id).toBeTruthy();
                });
        });
        it('fails when uuids collid more than once expect-db-error', async () => {
            return withMockUuidv4(db, sameUuid(3, db.uuidv4()), 
                async (mockDb) => {
                    await mockDb.things.create(C.THINGS.USER);
                    await expect(mockDb.things.create(C.THINGS.USER))
                        .rejects.toThrow("duplicate key value violates unique constraint \"things_pkey\"");
                });
        });
    });
});