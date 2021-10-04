import db from '../../../../db/databaseApi';
import {testApi} from '../../../../testUtils';
import * as C from '../../../../constant';
import { UserId } from '../../../../db/types';
import ModActions from '../modActions';

beforeAll(() => {
    return db.initialize();
});
afterAll(() => {
    return db.end();
});

describe("ModActions", () => {
    beforeEach(() => {
        return testApi.deleteAll();
    });

    describe('deleteModAction', () => {
        it('works', async () => {
            const creatorId = db.uuidv4();
            const thingId = db.uuidv4();
            const field = "censor";
            const modActionId = await testApi.createModAction({thingId, creatorId, strikeDowns:false, strikePoster:false});
            await ModActions.deleteModAction({thingId, version:1, priority:0, field});
            const res = await ModActions.getModAction({thingId, field});
            expect(res).toBe(null);
        });
    });
    describe('upsertModAction', () => {
        it('works', async () => {
            const creatorId = db.uuidv4();
            const userId = db.uuidv4();
            const userId2 = db.uuidv4();
            const userId3 = db.uuidv4() as UserId;
            const thingId = await db.qPosts.submitPost({title:"", userId:userId3});
            await db.votes.insertVote({thingId, userId, vote: C.VOTE.UP});
            await db.votes.insertVote({thingId, userId:userId2, vote: C.VOTE.DOWN});
            const modActionId = await testApi.createModAction({thingId, creatorId});
            const res = await db.pool.query(`SELECT * FROM strikes`);
            expect(res.rows.length).toBe(3);
        });
        it('handles just strikes up', async () => {
            const creatorId = db.uuidv4();
            const userId = db.uuidv4();
            const userId2 = db.uuidv4();
            const userId3 = db.uuidv4() as UserId;
            const thingId = await db.qPosts.submitPost({title:"", userId:userId3});
            await db.votes.insertVote({thingId, userId, vote: C.VOTE.UP});
            await db.votes.insertVote({thingId, userId:userId2, vote: C.VOTE.DOWN});
            const modActionId = await testApi.createModAction({thingId, creatorId, strikeDowns:false, strikePoster:false});
            const res = await db.pool.query(`SELECT * FROM strikes`);
            expect(res.rows.length).toBe(1);
            expect(res.rows[0].user_id).toEqual(userId);
        });
        it('handles just strikes down', async () => {
            const creatorId = db.uuidv4();
            const userId = db.uuidv4();
            const userId2 = db.uuidv4();
            const userId3 = db.uuidv4() as UserId;
            const thingId = await db.qPosts.submitPost({title:"", userId:userId3});
            await db.votes.insertVote({thingId, userId, vote: C.VOTE.UP});
            await db.votes.insertVote({thingId, userId:userId2, vote: C.VOTE.DOWN});
            const modActionId = await testApi.createModAction({thingId, creatorId, strikeUps:false, strikePoster:false});
            const res = await db.pool.query(`SELECT * FROM strikes`);
            expect(res.rows.length).toBe(1);
            expect(res.rows[0].user_id).toEqual(userId2);
        });
        it('no duplicates allowed', async () => {
            const creatorId = db.uuidv4();
            const userId = db.uuidv4() as UserId;
            const userId2 = db.uuidv4();
            const thingId = await db.qPosts.submitPost({title:"", userId});
            await db.votes.insertVote({thingId, userId, vote: C.VOTE.UP});
            await db.votes.insertVote({thingId, userId:userId2, vote: C.VOTE.DOWN});
            const modActionId = await testApi.createModAction({thingId, creatorId});
            const res = await db.pool.query(`SELECT * FROM strikes`);
            expect(res.rows.length).toBe(2);
        });
    });
    describe('getStrikes', () => {
        it('works', async () => {
            const creatorId = await testApi.createUser({user_name:"a"});
            const userId = db.uuidv4() as UserId;
            const thingId = await db.qPosts.submitPost({title:"", userId});
            await db.votes.insertVote({thingId, userId, vote: C.VOTE.UP});
            const modActionId = await testApi.createModAction({thingId, creatorId});
            const res = await ModActions.getStrikes(userId);
            expect(res.length).toBe(1);
            expect(res[0]).toEqual({
                thing_id: thingId,
                creator_id: creatorId,
                field: "censor",
                user_name: "a",
                thing_type: C.THINGS.USER
            });
        });
        it('includes samples', async () => {
            const {userId, thingId, sampleId} = await testApi.createPostSample();
            await db.votes.insertVote({thingId, userId, vote: C.VOTE.UP});
            const modActionId = await testApi.createModAction({thingId, creatorId:sampleId});
            const res = await ModActions.getStrikes(userId);
            expect(res.length).toBe(1);
            expect(res[0]).toEqual({
                thing_id: thingId,
                creator_id: sampleId,
                field: "censor",
                thing_type: C.THINGS.SAMPLE,
                user_name: null
            });
        });
    });
});