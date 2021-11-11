import * as Routes from '../..';
import * as C from '../../../constant';
import db from '../../../db/databaseApi';
import Samples from '../../../services/democraticModerationService/db/samples';
import { getCsrfToken, login, notLoggedIn, testApi } from '../../../testUtils';
const uuid = require('uuid');

// TODO add test of viewPost with user

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
                    params: { postId, vote },
                    user: { id: userId }
                }
                const res = {
                    sendStatus: jest.fn()
                }
                await Routes.QPost.submitVote(req, res);

                const dbVote = await db.votes.getVote({ thingId: postId, userId });
                expect(dbVote).toEqual(vote);
            });
        });
        describe('viewPost', () => {
            it('displays sample link when it exists', async () => {
                const request = await notLoggedIn();
                const { userId, thingId, sampleId } = await testApi.createPostSample();
                await Samples.setSampleIsCompleted({ sampleId, result: null, count: [] });

                let res = await request.get(C.URLS.QPOSTS_VIEW + thingId)
                    .send()
                    .expect(200);
                expect(res.text.includes("view-samples")).toBeTruthy();
            });
        });

        describe('submitDispute', () => {
            it('works', async () => {
                const request = await login();
                const { userId } = request;
                const thingId = await testApi.createPost({ userId });
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
    });
});