import * as C from '../../../../constant';
import db from '../../../../db/databaseApi';
import { testApi } from '../../../../testUtils';
import Samples from '../samples';
const uuid = require('uuid');

describe("Samples", () => {
    beforeEach(async () => {
        await db.initialize();
    });
    afterEach(async () => {
        await db.end();
    });

    const type = C.SAMPLE.TYPE.LEVEL_1;
    const field = C.FIELDS.LABELS.CENSOR;
    const defaultVote = { vote: null, strikeUps: false, strikeDowns: false, strikePoster: false, strikeDisputers: false };
    const defaultCount = { vote: null, strike_ups: false, strike_downs: false, strike_poster: false, strike_disputers: false, count: 1 };

    describe('createInSample', () => {
        it('works', async () => {
            Samples.createInSample({ userId: db.uuidv4(), sampleId: db.uuidv4(), proxyId: db.uuidv4(), client: db.pool });
        })
    });

    describe('createSample', () => {
        it('works', async () => {
            let id = await testApi.createSample({
                thingId: db.uuidv4(),
                dmUsersInSample: [{ userId: db.uuidv4(), proxyId: null }]
            });
            expect(id).toBeTruthy();
        });
    });

    describe('canVote', () => {
        it('works', async () => {
            const user1 = db.uuidv4();
            const user2 = db.uuidv4();
            const proxy1 = db.uuidv4();
            let sampleId = await testApi.createSample({
                thingId: db.uuidv4(),
                dmUsersInSample: [
                    { userId: user1, proxyId: null },
                    { userId: user2, proxyId: proxy1 }]
            });
            expect(await Samples.canVote({ userId: user1, sampleId })).toBe(true);
            expect(await Samples.canVote({ userId: user2, sampleId })).toBe(false);
            expect(await Samples.canVote({ userId: proxy1, sampleId })).toBe(true);
            expect(await Samples.canVote({ userId: db.uuidv4(), sampleId })).toBe(false);
        })
    });

    describe('sampleVote', () => {
        it('works', async () => {
            const userId = db.uuidv4();
            let sampleId = await testApi.createSample({
                thingId: db.uuidv4(),
                dmUsersInSample: [{ userId, proxyId: null }]
            });
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

    describe('getSamplesForUser', () => {
        it('works', async () => {
            const userId = await testApi.createUser();
            const thingId = await testApi.createPost({ userId });

            const user1 = await testApi.createDirectUser("user1");
            const proxy1 = await testApi.createProxy('proxy1');
            const user2 = await testApi.createProxyUser('user2', proxy1);

            const sampleId = await testApi.createSample({
                thingId, type, field,
                dmUsersInSample: [{ userId: user1, proxyId: null }, {userId:user2, proxyId:proxy1}]
            })
            const res = await Samples.getSamplesForUser({ userId: user1, isProxy: false });
            expect(res.length).toBe(1);
            expect(res[0].id).toEqual(sampleId);
            expect(res[0].post.id).toEqual(thingId);

            const res2 = await Samples.getSamplesForUser({ userId: proxy1, isProxy: true });
            expect(res2.length).toBe(1);
            expect(res2[0].id).toEqual(sampleId);
        });
    });

    describe('countVotes', () => {
        it('counts direct votes', async () => {
            const user1 = await testApi.createDirectUser("user1");
            const user2 = await testApi.createDirectUser("user2");

            const postId = await testApi.createPost({ userId: user1 });
            const sampleId = await Samples.createSample({
                thingId: postId, type, field,
                dmUsersInSample: [{ userId: user1, proxyId: null }]
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
            const proxy1 = await testApi.createProxy('proxy1');
            const user1 = await testApi.createProxyUser('user1', proxy1);

            const postId = await testApi.createPost({ userId: user1 });
            const sampleId = await Samples.createSample({
                thingId: postId, type, field,
                dmUsersInSample: [
                    { userId: user1, proxyId: proxy1 },
                    { userId: proxy1, proxyId: null },
                ]
            });

            // doubles votes as both user1 and proxy1 are in the sample
            await Samples.vote({ ...defaultVote, sampleId, userId: proxy1, strikeDowns: true });
            const count = await Samples.countVotes(sampleId);
            expect(count).toEqual([
                { ...defaultCount, strike_downs: true, count: 2 },
            ]);
        });
        it('counts direct and proxy votes', async () => {
            const proxy1 = await testApi.createProxy('proxy1');
            const user1 = await testApi.createDirectUser("user1");
            const user2 = await testApi.createProxyUser('user2', proxy1);

            const postId = await testApi.createPost({ userId: user1 });
            const sampleId = await Samples.createSample({
                thingId: postId, type, field,
                dmUsersInSample: [
                    { userId: user1, proxyId: null },
                    { userId: user2, proxyId: proxy1 },
                ]
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