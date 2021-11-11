import db from '../../db/databaseApi';
import * as C from '../../constant';
const uuid = require('uuid');
import * as Routes from '../../routes';
import { getCsrfToken, login, notLoggedIn, testApi } from '../../testUtils';
import { addFields, addPosts } from '../../routes/qPost';
import { QPost } from '../../db/types';
import Samples from '../../services/democraticModerationService/db/samples';
import { combine, listToMap, trimPosts } from '../qPost';


describe("qPost", () => {
    describe('db tests', () => {
        beforeEach(async () => {
            await db.initialize();
        });
        afterEach(async () => {
            await db.end();
        });

        describe('submitVote', () => {
            it('works', async () => {
                const postId = await db.things.create(C.THINGS.QPOST);
                const userId = db.uuidv4();
                const vote = C.VOTE.UP;
                const req = {
                    params: {postId, vote},
                    user: {id: userId}
                }
                const res = {
                    sendStatus: jest.fn()
                }
                await Routes.QPost.submitVote(req,res);

                const dbVote = await db.votes.getVote({thingId:postId, userId});
                expect(dbVote).toEqual(vote);
            });
        });
        describe('viewPost', () => {
            it('displays sample link when it exists', async () => {
                const request = await notLoggedIn();
                const {userId, thingId, sampleId} = await testApi.createPostSample();
                await Samples.setSampleIsCompleted({sampleId, result:null, count:[]});

                let res = await request.get(C.URLS.QPOSTS_VIEW + thingId)
                    .send()
                    .expect(200);
                expect(res.text.includes("view-samples")).toBeTruthy();
            });
        });

        describe('submitDispute', () => {
            it('works', async () => {
                const request = await login();
                const {userId} = request;
                const thingId = await testApi.createPost({userId});
                let res = await request.get(C.URLS.QPOSTS_VIEW + thingId)
                    .send()
                    .expect(200);
                let csrfToken = getCsrfToken(res.text);
                await request.post(`${C.URLS.SUBMIT_QPOST_DISPUTE}${thingId}/censor/true`)
                    .type('form')
                    .send({
                        _csrf: csrfToken,
                    }).expect(200);
            });
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

        describe('/qposts', () => {
            it('works when not logged in', async () => {
                const request = await notLoggedIn();
                const userId = await testApi.createUser();
                const thingId = await testApi.createPost({userId});
                let res = await request.get(C.URLS.QPOSTS)
                    .send()
                    .expect(200);
            });
        });
        describe('/deeply-important-qposts', () => {
            it('works when not logged in', async () => {
                const request = await notLoggedIn();
                const userId = await testApi.createUser();
                const thingId = await testApi.createPost({userId});
                let res = await request.get(C.URLS.DEEPLY_IMPORTANT_QPOSTS)
                    .send()
                    .expect(200);
            });
        });
        describe('/new_qposts', () => {
            it('works when not logged in', async () => {
                const request = await notLoggedIn();
                const userId = await testApi.createUser();
                const thingId = await testApi.createPost({userId});
                let res = await request.get(C.URLS.NEW_QPOSTS)
                    .send()
                    .expect(200);
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
    describe('trimPosts', () => {
        it('handles less posts', () => {
            const {posts, moreLink} = trimPosts({allPosts: Array(5), moreLinkBase:"a", page:0, offset: 0});
            expect(posts.length).toBe(5);
            expect(moreLink).toEqual(null);
        });
        it('handles some posts', () => {
            const {posts, moreLink} = trimPosts({allPosts: Array(65), moreLinkBase:"a", page:1, offset: 30});
            expect(posts.length).toBe(30);
            expect(moreLink).toEqual("a/2");
        });
        it('handles last page with many posts', () => {
            const {posts, moreLink} = trimPosts({allPosts: Array(65), moreLinkBase:"a", page:2, offset: 60});
            expect(posts.length).toBe(5);
            expect(moreLink).toEqual(null);
        });
    });
});