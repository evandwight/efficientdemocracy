const { v4: uuidv4 } = require('uuid');
import bcrypt from "bcrypt";
import supertest from 'supertest';
import * as C from '../constant';
import db from '../db/databaseApi';
import { UserId } from '../db/types';
import { setup } from '../index';
import ModActions from '../services/democraticModerationService/db/modActions';
import Samples from '../services/democraticModerationService/db/samples';

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
            "sample_votes",
            "mod_votes"].map(name => testApi.deleteFrom(name)));
    },
    deleteFrom: (name) => {
        return db.pool.query(`DELETE FROM ${name}`);
    },
    createUser: (args?) => {
        const {userName = "a", name = "a", email = "b", hashedPassword = "c"} = args || {};
        return db.things.create(C.THINGS.USER).then(async id => {
            await db.pool.query(
                `INSERT INTO users (id, user_name, name, email, password, created_on, unsubscribe_key, is_mod, email_state, auth_type)
                VALUES ($1, $2, $3, $4, $5, $6, $7, false, ${C.USER.EMAIL_STATE.VERIFIED_GOOD}, ${C.AUTH_TYPE.LOCAL})`,
                [id, userName, name, email, hashedPassword, new Date(), db.uuidv4()]);
            return id as UserId;
        });
    },
    createHttpUser: async (): Promise<[UserId, any]> => {
        const password = "asdfasdf";
        const hashedPassword = await bcrypt.hash(password, 10);
        const userInfo = {userName:"httpUser", name: "huser", email: "huser@huser.com", hashedPassword};
        return [await testApi.createUser({userName:"httpUser", name: "huser", email: "huser@huser.com", hashedPassword}),
            {...userInfo, password}];
    },
    createHackerUser: async ():Promise<UserId> => {
        await db.pool.query(
            `INSERT INTO users (id, user_name, name, email, password, created_on, is_mod, unsubscribe_key)
            VALUES ($1, $2, $3, $4, $5, $6, false, $7)`,
            [C.BOT_ACCOUNT_USER_ID, "hacker", "hacker name", "hacker@h.com", "", new Date(), db.uuidv4()]);
        return C.BOT_ACCOUNT_USER_ID as UserId;
    },
    createPost: (args) => db.qPosts.submitPost({title: "a", url:"b", content:"c", ...args}),
    createSample: (args) => Samples.createSample({
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
    createModAction: (args) => ModActions.upsertModAction({ 
        strikeUps:true, strikeDowns:true, strikePoster:true, 
        priority:0,
        banLength:1000,
        value:true,
        field:"censor",
        ... args}),
    createPostSample: async (type?) => {
        type = type || C.SAMPLE.TYPE.LEVEL_1;
        const {userId, thingId} = await testApi.createPostDispute();
        const sampleId = await Samples.createSample({thingId,userIds:[userId], type, field:"censor", sampleSize:1});
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