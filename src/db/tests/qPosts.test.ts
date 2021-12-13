import db from '../databaseApi';
const {testApi} = require('../../testUtils');
const uuid = require('uuid');

describe("QPosts", () => {
    beforeEach(async () => {
        await db.initialize();
    });
    afterEach(async () => {
        await db.end();
    });

    describe('getPostsByIds', () => {
        it('gets posts', async () => {
            const userId = await testApi.createUser({userName: "user name"});
            const postId = await db.qPosts.submitPost({title:"a", userId, url: "b"});
            const posts = await db.qPosts.getPostsByIds([postId]);
            expect(posts.length).toBe(1);
            expect(posts[0].id).toEqual(postId);
            expect(posts[0].user_name).toEqual("user name");
        });
    });
    describe('submitPost', () => {
        it('works', async () => {
            const postId = await db.qPosts.submitPost({title:"a", userId: testApi.createUserId(), url: "b"});
            expect(postId).toBeTruthy();
        });
    });
    describe('getPost', () => {
        it('gets a post', async () => {
            const userId = await testApi.createUser({userName: "user name"});
            const postId = await db.qPosts.submitPost({title:"a", userId, url: "b"});
            const post = await db.qPosts.getPost(postId);
            expect(post.id).toEqual(postId);
            expect(post.user_name).toEqual("user name");
        });
    });
    describe('upsertHackerNewsPost', () => {
        it('works', async () => {
            let hackerPost = {id: 1234343, score: 10000, title: "a", by:"b", time: 1633968360};
            const userId = await testApi.createHackerUser();
            const postId = await db.qPosts.upsertHackerNewsPost(hackerPost);
            let post = await db.qPosts.getPost(postId);
            expect(post.title).toEqual("a");
            expect(post.created).toEqual(new Date(1633968360*1000));
            await db.qPosts.upsertHackerNewsPost({... hackerPost, title: "asdf"});
            post = await db.qPosts.getPost(postId);
            expect(post.title).toEqual("asdf");
        });
    });
});