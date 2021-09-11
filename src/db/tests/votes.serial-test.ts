import db from '../../db/databaseApi';
import * as C from '../../constant';
const {testApi} = require('../../testUtils');
const uuid = require('uuid');

beforeAll(() => {
    return db.initialize();
});
afterAll(() => {
    return db.end();
});

describe("Votes", () => {
    beforeEach(() => {
        return testApi.deleteAll();
    });

    describe('getVotes', () => {
        it('works', async () => {
            const userId = await testApi.createUser({userName: "user name"});
            const thingId = db.uuidv4();
            const parentId = db.uuidv4();
            const voteId = await db.votes.insertVote({thingId, userId, vote: C.VOTE.UP});
            const voteId2 = await db.votes.insertVote({thingId, userId: db.uuidv4(), vote: C.VOTE.UP});
            const votes = await db.votes.getVotes({thingIds: [thingId], userId});
            expect(votes).toEqual([{thing_id: thingId, vote: C.VOTE.UP}]);
        });
        it('handles 100,000 ids', async () => {
            const userId = await testApi.createUser({userName: "user name"});
            const thingId = db.uuidv4();
            const parentId = db.uuidv4();
            const voteId = await db.votes.insertVote({thingId, userId, vote: C.VOTE.UP});
            const votes = await db.votes.getVotes({thingIds: Array(100000).fill(thingId), userId});
            expect(votes).toEqual([{thing_id: thingId, vote: C.VOTE.UP}]);
        });
    });
    describe('upsertVote', () => {
        it('works', async () => {
            const thingId = db.uuidv4();
            const userId = db.uuidv4();
            await db.votes.insertVote({thingId, userId, vote: 5});
            let res = await db.votes.getVote({thingId, userId});
            expect(res).toBe(5);

            expect(db.votes.insertVote({thingId, userId, vote: 4}))
                .rejects.toThrow("duplicate key value violates unique constraint \"votes_pkey\"");

            await db.votes.upsertVote({thingId, userId, vote: 4});

            res = await db.votes.getVote({thingId, userId});
            expect(res).toBe(4);
        });
        it('upsert inserts', async () => {
            const thingId = db.uuidv4();
            const userId = db.uuidv4();
            await db.votes.insertVote({thingId, userId, vote: 5});
            let res = await db.votes.getVote({thingId, userId});
            expect(res).toBe(5);
        })
    });
});