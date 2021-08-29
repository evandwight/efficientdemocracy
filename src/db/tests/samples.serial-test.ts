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

describe("Samples", () => {
    const type = C.SAMPLE.TYPE.LEVEL_1;
    beforeEach(() => {
        return testApi.deleteAll();
    });

    describe('createSample', () => {
        it('works', async () => {
            let id = await testApi.createSample({thingId:db.uuidv4(),userIds: [db.uuidv4()]});
            expect(id).toBeTruthy();
        });
    });

    describe('canUserVote', () => {
        it('works', async () => {
            const {userId, thingId, sampleId} = await testApi.createPostSample();
            let res = await db.samples.canUserVote({sampleId, userId});
            expect(res).toBe(true);

            const userId2 = db.uuidv4();
            res = await db.samples.canUserVote({sampleId, userId:userId2});
            expect(res).toBe(false);
        });
    });

    describe('sampleVote', () => {
        it('works', async () => {
            const userId = db.uuidv4();
            let sampleId = await testApi.createSample({thingId:db.uuidv4(),userIds: [userId]});
            await db.samples.vote({sampleId, userId, vote:true, strikeUps: false, strikeDowns: false, strikePoster: false, strikeDisputers: false});
            expect(true).toBeTruthy();
        });
    });
    
    describe('getOldestSample', () => {
        it('works', async () => {
            const {userId, thingId, sampleId} = await testApi.createPostSample();
            const res = await db.samples.getOldestSample(userId);
            expect(res.id).toEqual(sampleId);
            expect(res.post.id).toEqual(thingId);
        });
    });
    describe('countVotes', () => {
        it('works', async () => {
            const {userId, thingId, sampleId} = await testApi.createPostSample();
            await db.samples.vote({sampleId, userId, vote:null, strikeUps: false, strikeDowns: true, strikePoster: false, strikeDisputers: false});
            const count = await db.samples.countVotes(sampleId);
            expect(count).toEqual([{vote:null, strike_ups: false, strike_downs: true, strike_poster: false, strike_disputers: false, count: 1}]);
        });
    });
    describe('setSampleIsComplete', () => {
        it('works', async () => {
            const {userId, thingId, sampleId} = await testApi.createPostSample();
            await db.samples.setSampleIsCompleted({sampleId, result:null, count:[{asdf:1}]});
        });
    });
    describe('completeSample', () => {
        it('works', async () => {
            const {userId, thingId, sampleId} = await testApi.createPostSample();
            const sample = await db.samples.getOldestSample(userId);
            const result = {vote: true, strike_ups:true, strike_downs:true, strike_poster:true, strike_disputers:true};
            const count = [{asdf:1}, {asdf:2}];
            await db.samples.completeSample({sample, result, count})
        });
        it('handles a null result', async () => {
            const {userId, thingId, sampleId} = await testApi.createPostSample();
            const sample = await db.samples.getOldestSample(userId);
            const result = null;
            const count = [{asdf:1}, {asdf:2}];
            await db.samples.completeSample({sample, result, count})
        });
    });
});