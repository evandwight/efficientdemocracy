import db from '../../../../db/databaseApi';
import Disputes from '../disputes';

describe("DisputesDb", () => {
    beforeEach(async () => {
        await db.initialize();
    });
    afterEach(async () => {
        await db.end();
    });

    describe('submitDispute', () => {
        it('works', async () => {
            const thingId = db.uuidv4();
            const res = await Disputes.submitDispute({ thingId, userId: db.uuidv4(), field: "censor", shouldBe: true });
            expect(res).toBe(true);
        });
    });
    describe('getDisputes', () => {
        it('works', async () => {
            const thingId = db.uuidv4();
            const field = "censor";
            const res = await Disputes.submitDispute({ thingId, userId: db.uuidv4(), field, shouldBe: true });
            const disputes = await Disputes.getDisputes(1);
            expect(disputes).toStrictEqual([{thing_id: thingId, field, should_be: true, value: null, priority: null, count: 1 }]);
        });
    });
});