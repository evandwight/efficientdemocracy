const { v4: uuidv4 } = require('uuid');
import db from '../db/databaseApi';
const bcrypt = require("bcrypt");
import supertest from 'supertest';
import * as C from '../constant';
import { UserId } from '../db/types';
import {setup} from '../index';

export const TEST_URL = "http://localhost:3005";

export function getCsrfToken(html) {
    const regex = /<meta name="csrf-token" content="(.*?)" \/>/g;
    try {
        return [... html.matchAll(regex)][0][1];
    } catch (e) {
        throw new Error("Cannot find csrfToken in html: " + html);
    }
}

export function getFormAction(html) {
    const regex = /<form action="(.*?)"/g;
    try {
        return [... html.matchAll(regex)][0][1];
    } catch (e) {
        throw new Error("Cannot find form action in html: " + html);
    }
}

export async function notLoggedIn() {
    const request = supertest(setup(db));
    return request;
}

export async function login() {
    const [userId, userInfo] = await testApi.createHttpUser();
    const router = setup(db);
    // When google auth is the only method to login, add a method to simulate a login via passport
    router.get("/test_force_login", (req, res) => {
        req["session"].passport = {user: userId}
        res.sendStatus(200);
    });
    const request = supertest(router);
    let res = await request.get("/test_force_login")
        .send()
        .expect(200);
    const cookies = res.headers['set-cookie'];
    return {
        get: (url) => request.get(url).set('Cookie', cookies),
        post: (url) => request.post(url).set('Cookie', cookies),
        raw: request,
        userInfo,
        userId
    }
}

export async function withMockUuidv4(db, newUuidv4, func) {
    let old = db.uuidv4;
    db.uuidv4 = newUuidv4;
    await func(db);
    db.uuidv4 = old;
}

export function sameUuid(times, uuid) {
    let calls = 0;
    return () => {
        calls += 1;
        if (calls > times) {
            return uuidv4();
        }
        else {
            return uuid;
        }
    }
}

export const testApi = {
    deleteAll: () => {
        return Promise.all([
            "votes",
            "users",
            "things",
            "qposts",
            "mod_actions",
            "strikes",
            "disputes",
            "samples",
            "sample_votes"].map(name => testApi.deleteFrom(name)));
    },
    deleteFrom: (name) => {
        return db.pool.query(`DELETE FROM ${name}`);
    },
    createUser: (args?) => {
        return db.users.createUser({userName:"a", name: "a", email: "b", hashedPassword: "c", ... args});
    },
    createHttpUser: async (): Promise<[UserId, any]> => {
        const password = "asdfasdf";
        const hashedPassword = await bcrypt.hash(password, 10);
        const userInfo = {userName:"httpUser", name: "huser", email: "huser@huser.com", hashedPassword};
        return [await db.users.createUser({userName:"httpUser", name: "huser", email: "huser@huser.com", hashedPassword}),
            {...userInfo, password}];
    },
    createHackerUser: async ():Promise<UserId> => {
        await db.pool.query(
            `INSERT INTO users (id, user_name, name, email, password, created_on, is_mod)
            VALUES ($1, $2, $3, $4, $5, $6, false)`,
            [C.BOT_ACCOUNT_USER_ID, "hacker", "hacker name", "hacker@h.com", "", new Date()]);
        return C.BOT_ACCOUNT_USER_ID as UserId;
    },
    createPost: (args) => db.qPosts.submitPost({title: "a", url:"b", content:"c", ...args}),
    createSample: (args) => db.samples.createSample({
        type: C.SAMPLE.TYPE.LEVEL_1,
        field: "censor",
        sampleSize: 1,
        ... args
    }),
    createDispute: (args) => db.votes.submitDispute({
        field:"censor",
        shouldBe:true,
        ... args
    }),
    createModAction: (args) => db.modActions.upsertModAction({ 
        strikeUps:true, strikeDowns:true, strikePoster:true, 
        priority:0,
        banLength:1000,
        version:undefined,
        value:true,
        field:"censor",
        ... args}),
    createPostSample: async (type?) => {
        type = type || C.SAMPLE.TYPE.LEVEL_1;
        const {userId, thingId} = await testApi.createPostDispute();
        const sampleId = await db.samples.createSample({thingId,userIds:[userId], type, field:"censor", sampleSize:1});
        return {userId, thingId, sampleId};
    },
    createPostDispute: async () => {
        const userId = await testApi.createUser();
        const thingId = await testApi.createPost({userId});
        await db.votes.submitDispute({thingId, userId, field:"censor", shouldBe:true});
        return {userId, thingId};
    },
    createUserId: (): UserId => {
        return db.uuidv4() as UserId;
    },
    insertStrike: (modActionId, userId) => db.pool.query(`INSERT INTO strikes (mod_action_id, user_id) VALUES ($1, $2)`, [db.uuidv4(), userId]),
}