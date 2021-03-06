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
        return [...html.matchAll(regex)][0][1];
    } catch (e) {
        throw new Error("Cannot find csrfToken in html: " + html);
    }
}

export function getFormAction(html) {
    const regex = /<form action="(.*?)"/g;
    try {
        return [...html.matchAll(regex)][0][1];
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
        req["session"].passport = { user: userId }
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
        const { userName = "a", id = db.uuidv4(), cognitoId = db.uuidv4() } = args || {};
        return db.things.insert({ id, type: C.THINGS.USER }).then(async () => {
            await db.pool.query(
                `INSERT INTO users (id, cognito_id, user_name, created_on, unsubscribe_key)
                VALUES ($1, $2, $3, $4, $5)`,
                [id, cognitoId, userName, new Date(), db.uuidv4()]);
            return id as UserId;
        });
    },
    createHttpUser: async (): Promise<[UserId, any]> => {
        const userInfo = { userName: "httpUser" };
        return [await testApi.createUser({ userName: "httpUser" }),
        { ...userInfo }];
    },
    createHackerUser: async (): Promise<UserId> => {
        return testApi.createUser({ userName: "hacker", id: C.BOT_ACCOUNT_USER_ID });
    },
    createUserWithSettings: async (userName, settings): Promise<UserId> => {
        const id = await testApi.createUser({ userName });
        for (const setting of settings) {
            await db.users.setSetting(id, setting[0], setting[1]);
        }
        return id;
    },
    createProxy: async (userName = "proxy1"): Promise<UserId> =>
        testApi.createUserWithSettings(userName, [
            [C.USER.COLUMNS.dm_participate, C.USER.DM_PARTICIPATE.direct],
            [C.USER.COLUMNS.wants_proxy, true]
        ]),
    createDirectUser: async (userName = "user1"): Promise<UserId> =>
        testApi.createUserWithSettings(userName, [
            [C.USER.COLUMNS.dm_participate, C.USER.DM_PARTICIPATE.direct],
        ]),
    createProxyUser: async (userName = "user1", proxyId): Promise<UserId> =>
        testApi.createUserWithSettings(userName, [
            [C.USER.COLUMNS.dm_participate, C.USER.DM_PARTICIPATE.proxy],
            [C.USER.COLUMNS.proxy_id, proxyId],]),
    createPost: (args) => db.qPosts.submitPost({ title: "a", url: "b", content: "c", ...args }),
    createSample: (args) => Samples.createSample({
        type: C.SAMPLE.TYPE.LEVEL_1,
        field: "censor",
        ...args
    }),
    createDispute: (args) => db.votes.submitDispute({
        field: "censor",
        shouldBe: true,
        ...args
    }),
    createModAction: (args) => ModActions.upsertModAction({
        strikeUps: true, strikeDowns: true, strikePoster: true,
        priority: 0,
        banLength: 1000,
        value: true,
        field: "censor",
        ...args
    }),
    createPostSample: async (type?) => {
        type = type || C.SAMPLE.TYPE.LEVEL_1;
        const { userId, thingId } = await testApi.createPostDispute();
        const sampleId = await Samples.createSample({
            thingId,
            dmUsersInSample: [{ userId, proxyId: null }],
            type,
            field: "censor"
        });
        return { userId, thingId, sampleId };
    },
    createPostDispute: async () => {
        const userId = await testApi.createUserWithSettings('a',
            [[C.USER.COLUMNS.dm_participate, C.USER.DM_PARTICIPATE.direct]]);
        const thingId = await testApi.createPost({ userId });
        await db.votes.submitDispute({ thingId, userId, field: "censor", shouldBe: true });
        return { userId, thingId };
    },
    createUserId: (): UserId => {
        return db.uuidv4() as UserId;
    },
    insertStrike: (modActionId, userId) => db.pool.query(`INSERT INTO strikes (mod_action_id, user_id) VALUES ($1, $2)`, [db.uuidv4(), userId]),
}