import { getListParams } from '..';
import * as C from '../../../constant';
import db from '../../../db/databaseApi';
import { notLoggedIn, testApi } from '../../../testUtils';
import { trimPosts } from "../listings";
const uuid = require('uuid');


// TODO test kv listing

describe("listings", () => {
    describe('db tests', () => {
        beforeEach(async () => {
            await db.initialize();
        });
        afterEach(async () => {
            await db.end();
        });
        describe('/qposts', () => {
            it('works when not logged in', async () => {
                const request = await notLoggedIn();
                const userId = await testApi.createUser();
                const thingId = await testApi.createPost({ userId });
                let res = await request.get(C.URLS.QPOSTS)
                    .send()
                    .expect(200);
            });
        });
        describe('/deeply-important-qposts', () => {
            it('works when not logged in', async () => {
                const request = await notLoggedIn();
                const userId = await testApi.createUser();
                const thingId = await testApi.createPost({ userId });
                let res = await request.get(C.URLS.DEEPLY_IMPORTANT_QPOSTS)
                    .send()
                    .expect(200);
            });
        });
        describe('/new_qposts', () => {
            it('works when not logged in', async () => {
                const request = await notLoggedIn();
                const userId = await testApi.createUser();
                const thingId = await testApi.createPost({ userId });
                let res = await request.get(C.URLS.NEW_QPOSTS)
                    .send()
                    .expect(200);
            });
        });
    });
    describe('trimPosts', () => {
        it('handles less posts', () => {
            const { posts, moreLink } = trimPosts({ allPosts: Array(5), moreLinkBase: "a", page: 0, offset: 0 });
            expect(posts.length).toBe(5);
            expect(moreLink).toEqual(null);
        });
        it('handles some posts', () => {
            const { posts, moreLink } = trimPosts({ allPosts: Array(65), moreLinkBase: "a", page: 1, offset: 30 });
            expect(posts.length).toBe(30);
            expect(moreLink).toEqual("a/2");
        });
        it('handles last page with many posts', () => {
            const { posts, moreLink } = trimPosts({ allPosts: Array(65), moreLinkBase: "a", page: 2, offset: 60 });
            expect(posts.length).toBe(5);
            expect(moreLink).toEqual(null);
        });
    });
    describe('getListParams', () => {
        it('handles no page', () => {
            const res = getListParams({ params: {} }, { locals: {} });
            expect(res).toEqual({ user: undefined, page: 0, offset: 0 });
        });
        it('handles page 1', () => {
            const res = getListParams({ params: { page: "1" } }, { locals: {} });
            expect(res).toEqual({ user: undefined, page: 1, offset: 30 });
        });
        it('handles users', () => {
            const res = getListParams({ params: {} }, { locals: { user: { id: 1 } } });
            expect(res).toEqual({ user: { id: 1 }, page: 0, offset: 0 });
        });
        it('validates page', () => {
            const errMsg = "Page must be a non-negative integer";
            expect(() => getListParams({ params: { page: "-1" } }, { locals: {} })).toThrowError(errMsg);
            expect(() => getListParams({ params: { page: "asdfsd" } }, { locals: {} })).toThrowError(errMsg);
        });
    });
});