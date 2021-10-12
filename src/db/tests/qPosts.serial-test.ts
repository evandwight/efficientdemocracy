import db from '../../db/databaseApi';
const {testApi} = require('../../testUtils');
const uuid = require('uuid');
import * as C from '../../constant';

beforeAll(() => {
    return db.initialize();
});
afterAll(() => {
    return db.end();
});

describe("QPosts", () => {
    beforeEach(() => {
        return testApi.deleteAll();
    });

    describe('getPosts', () => {
        it('gets posts', async () => {
            const userId = await testApi.createUser({userName: "user name"});
            const postId = await db.qPosts.submitPost({title:"a", userId, url: "b"});
            const posts = await db.qPosts.getPosts();
            expect(posts.length).toBe(1);
            expect(posts[0].id).toEqual(postId);
            expect(posts[0].user_name).toEqual("user name");
        });
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
            let hackerPost = {id: 1234343, score: 10000, title: "a", time: 1633968360};
            const userId = await testApi.createHackerUser();
            const postId = await db.qPosts.upsertHackerNewsPost(hackerPost);
            const post = await db.qPosts.getPost(postId);
            expect(post.title).toEqual("a");
            expect(post.created).toEqual(new Date(1633968360*1000));
        });
    });
});