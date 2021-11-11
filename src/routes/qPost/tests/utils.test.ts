import db from '../../../db/databaseApi';
import { QPost } from '../../../db/types';
import { testApi } from '../../../testUtils';
import { addFields, addPosts, combine, listToMap } from "../utils";
const uuid = require('uuid');

describe("utils", () => {
    describe('db tests', () => {
        beforeEach(async () => {
            await db.initialize();
        });
        afterEach(async () => {
            await db.end();
        });
        describe('addPosts', () => {
            it('works', async () => {
                const userId = await testApi.createUser();
                const postId = await testApi.createPost({title:"a", userId});
                const posts = await addPosts([postId]);
                expect(posts.length).toBe(1);
                expect(posts[0].title).toEqual("a");
            });
        });

        describe('addFields', () => {
            it('works', async () => {
                const creatorId = db.uuidv4();
                const userId = await testApi.createUser();
                const thingId = await testApi.createPost({userId});
                const modActionId = await testApi.createModAction({thingId, creatorId, field:"censor", value:true});
                const postIds = await db.qPosts.getNewPosts();
                const posts = await addFields(postIds.map(v => ({id: v})) as QPost[]);
                expect(posts[0].censor).toBe(true);
            });
        });
    });
    describe('listToMap', () => {
        it('works', () => {
            const res = listToMap([{id: 1, val: 2}], v => v.id, (v, pv) => ({... pv || {}, val: v.val}));
            expect(res).toEqual({"1": {val: 2}});
        });
    });
    describe('combine', () => {
        it('works', () => {
            const res = combine([{id: 1}], {"1": {val: 2}}, v => v.id);
            expect(res).toEqual([{id: 1, val:2}]);
        });
    });
});