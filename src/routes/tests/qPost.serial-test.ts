import db from '../../db/databaseApi';
import * as C from '../../constant';
const uuid = require('uuid');
import * as Routes from '../../routes';
import { getCsrfToken, login, notLoggedIn, testApi } from '../../testUtils';
import { addFields, addPosts } from '../../routes/qPost';
import { QPost } from '../../db/types';
import Samples from '../../services/democraticModerationService/db/samples';

beforeAll(() => {
    return db.initialize();
});
afterAll(() => {
    return db.end();
});

describe("qPost", () => {
    beforeEach(() => {
        return testApi.deleteAll();
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
            expect(res.text.includes("view samples")).toBeTruthy();
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