import db from '../../../../db/databaseApi';
import {testApi} from '../../../../testUtils';
import * as C from '../../../../constant';
import { UserId } from '../../../../db/types';
import ModActions from '../modActions';
import Strikes from '../strikes';

describe("Strikes", () => {
    beforeEach(async () => {
        await db.initialize();
    });
    afterEach(async () => {
        await db.end();
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
    describe('updateStrikes', () => {
        it('works', async () => {
            const userId = await testApi.createUser();
            const p1 = db.uuidv4();
            const p2 = db.uuidv4();
            const p3 = db.uuidv4();
            const posts = [p1, p2, p3];
            await Promise.all(posts.map(p => db.votes.insertVote({ thingId: p, userId, vote: C.VOTE.UP })));
            await Promise.all(posts.map(p => 
                testApi.createModAction({thingId:p,creatorId: db.uuidv4(), strikeDowns: false, strikePoster: false})));
            await Strikes.updateStrikes();
            const user = await db.users.getUser(userId);
            expect(user.is_banned).toBe(true);
            expect(user.strike_count).toBe(3);
        });
        it('handles deleted mod actions', async () => {
            const userId = await testApi.createUser();
            const p1 = db.uuidv4();
            const p2 = db.uuidv4();
            const p3 = db.uuidv4();
            const posts = [p1, p2, p3];
            await Promise.all(posts.map(p => db.votes.insertVote({ thingId: p, userId, vote: C.VOTE.UP })));
            await Promise.all(posts.map(p => 
                testApi.createModAction({thingId:p,creatorId: db.uuidv4(), strikeDowns: false, strikePoster: false})));
            await Strikes.updateStrikes();
            let user = await db.users.getUser(userId);
            expect(user.is_banned).toBe(true);
            expect(user.strike_count).toBe(3);
            await ModActions.deleteModAction({ thingId: p1, priority: 0, field: "censor" });
            await Strikes.updateStrikes();
            user = await db.users.getUser(userId);
            expect(user.is_banned).toBe(false);
            expect(user.strike_count).toBe(2);
        });
    });
});