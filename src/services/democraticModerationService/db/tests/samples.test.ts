import db from '../../../../db/databaseApi';
import * as C from '../../../../constant';
import Samples from '../samples';
import { testApi } from '../../../../testUtils';
const uuid = require('uuid');

describe("Samples", () => {
    beforeEach(async () => {
        await db.initialize();
    });
    afterEach(async () => {
        await db.end();
    });

    const type = C.SAMPLE.TYPE.LEVEL_1;
    const defaultVote = { vote: null, strikeUps: false, strikeDowns: false, strikePoster: false, strikeDisputers: false };
    const defaultCount = { vote: null, strike_ups: false, strike_downs: false, strike_poster: false, strike_disputers: false, count: 1 };

    describe('createSample', () => {
        it('works', async () => {
            let id = await testApi.createSample({ thingId: db.uuidv4(), userIdsInSample: [db.uuidv4()] });
            expect(id).toBeTruthy();
        });
    });

    describe('sampleVote', () => {
        it('works', async () => {
            const userId = db.uuidv4();
            let sampleId = await testApi.createSample({ thingId: db.uuidv4(), userIdsInSample: [userId] });
            await Samples.vote({ sampleId, userId, ...defaultVote });
            expect(true).toBeTruthy();
        });
    });

    describe('getOldestSample', () => {
        it('works', async () => {
            const { userId, thingId, sampleId } = await testApi.createPostSample();
            const res = await Samples.getOldestSample(userId);
            expect(res.id).toEqual(sampleId);
            expect(res.post.id).toEqual(thingId);
        });
    });
    describe('countVotes', () => {
        it('counts direct votes', async () => {
            const user1 = await testApi.createUserWithSettings("user1", [
                [C.USER.COLUMNS.dm_participate, C.USER.DM_PARTICIPATE.direct],
            ]);

            const user2 = await testApi.createUserWithSettings("user2", [
                [C.USER.COLUMNS.dm_participate, C.USER.DM_PARTICIPATE.direct],
            ]);

            const postId = await testApi.createPost({ userId: user1 });
            const sampleId = await Samples.createSample({
                thingId: postId, type, field: "censor",
                userIdsInSample: [user1]
            });

            await Samples.vote({ ...defaultVote, sampleId, userId: user1, strikeDowns: true });
            // excluded as user2 not in sample
            await Samples.vote({ ...defaultVote, sampleId, userId: user2, strikePoster: true });
            const count = await Samples.countVotes(sampleId);
            expect(count).toEqual([
                { ...defaultCount, strike_downs: true },
            ]);
        });
        it('counts proxy votes', async () => {
            const proxy1 = await testApi.createUserWithSettings("proxy1", [
                [C.USER.COLUMNS.dm_participate, C.USER.DM_PARTICIPATE.direct],
                [C.USER.COLUMNS.wants_proxy, true]
            ]);

            const proxy2 = await testApi.createUserWithSettings("proxy2", [
                [C.USER.COLUMNS.dm_participate, C.USER.DM_PARTICIPATE.direct],
                [C.USER.COLUMNS.wants_proxy, false]
            ]);

            const user1 = await testApi.createUserWithSettings("user1", [
                [C.USER.COLUMNS.dm_participate, C.USER.DM_PARTICIPATE.proxy],
                [C.USER.COLUMNS.proxy_id, proxy1],
            ]);

            const user2 = await testApi.createUserWithSettings("user2", [
                [C.USER.COLUMNS.dm_participate, C.USER.DM_PARTICIPATE.proxy],
                [C.USER.COLUMNS.proxy_id, proxy2],
            ]);

            const postId = await testApi.createPost({ userId: user1 });
            const sampleId = await Samples.createSample({
                thingId: postId, type, field: "censor",
                userIdsInSample: [user1, user2, proxy1]
            });

            // doubles votes as both user1 and proxy1 are in the sample
            await Samples.vote({ ...defaultVote, sampleId, userId: proxy1, strikeDowns: true });
            // excluded as proxy2 wants_proxy=false
            await Samples.vote({ ...defaultVote, sampleId, userId: proxy2, strikePoster: true });
            const count = await Samples.countVotes(sampleId);
            expect(count).toEqual([
                { ...defaultCount, strike_downs: true, count: 2 },
            ]);
        });
        it('counts direct and proxy votes', async () => {
            const proxy1 = await testApi.createUserWithSettings("proxy1", [
                [C.USER.COLUMNS.dm_participate, C.USER.DM_PARTICIPATE.direct],
                [C.USER.COLUMNS.wants_proxy, true]
            ]);

            const user1 = await testApi.createUserWithSettings("user1", [
                [C.USER.COLUMNS.dm_participate, C.USER.DM_PARTICIPATE.direct],
            ]);

            const user2 = await testApi.createUserWithSettings("user2", [
                [C.USER.COLUMNS.dm_participate, C.USER.DM_PARTICIPATE.proxy],
                [C.USER.COLUMNS.proxy_id, proxy1],
            ]);

            const postId = await testApi.createPost({ userId: user1 });
            const sampleId = await Samples.createSample({
                thingId: postId, type, field: "censor",
                userIdsInSample: [user1, user2]
            });

            const defaultArgs = { sampleId, vote: null, strikeUps: false, strikeDowns: false, strikePoster: false, strikeDisputers: false };
            await Samples.vote({ ...defaultArgs, userId: user1, strikeDowns: true });
            await Samples.vote({ ...defaultArgs, userId: proxy1, strikeUps: true });
            const count = await Samples.countVotes(sampleId);
            count.sort((a, b) => b.strike_ups - a.strike_ups);
            expect(count).toEqual([
                { ...defaultCount, strike_ups: true },
                { ...defaultCount, strike_downs: true },
            ]);
        });
    });
    describe('setSampleIsComplete', () => {
        it('works', async () => {
            const { userId, thingId, sampleId } = await testApi.createPostSample();
            await Samples.setSampleIsCompleted({ sampleId, result: null, count: [{ asdf: 1 }] });
        });
    });
    describe('completeSample', () => {
        it('works', async () => {
            const { userId, thingId, sampleId } = await testApi.createPostSample();
            const sample = await Samples.getOldestSample(userId);
            const result = { vote: true, strike_ups: true, strike_downs: true, strike_poster: true, strike_disputers: true };
            const count = [{ asdf: 1 }, { asdf: 2 }];
            await Samples.completeSample({ sample, result, count })
        });
        it('handles a null result', async () => {
            const { userId, thingId, sampleId } = await testApi.createPostSample();
            const sample = await Samples.getOldestSample(userId);
            const result = null;
            const count = [{ asdf: 1 }, { asdf: 2 }];
            await Samples.completeSample({ sample, result, count })
        });
    });
});