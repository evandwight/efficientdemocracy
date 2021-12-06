import * as C from '../../constant';
import db from '../../db/databaseApi';
import Samples from '../../services/democraticModerationService/db/samples';
import { getCsrfToken, getFormAction, login, testApi } from '../../testUtils';

describe('sample', () => {
    describe('db tests', () => {
        beforeEach(async () => {
            await db.initialize();
        });
        afterEach(async () => {
            await db.end();
        });

        const type = C.SAMPLE.TYPE.LEVEL_1;

        describe('submitSampleVote', () => {
            it('works', async () => {
                const request = await login();
                const { userId } = request;
                await db.users.setSetting(userId, C.USER.COLUMNS.dm_participate, C.USER.DM_PARTICIPATE.direct);
                await db.users.setSetting(userId, C.USER.COLUMNS.first_run, false);

                const thingId = await testApi.createPost({ userId });
                const sampleId = await testApi.createSample({ thingId, userIdsInSample: [userId] });
                let res = await request.get(C.URLS.VIEW_SAMPLE_REQUEST + sampleId)
                    .send()
                    .expect(200);
                let csrfToken = getCsrfToken(res.text);
                const sampleVoteUrl = getFormAction(res.text);
                expect(sampleVoteUrl.startsWith(C.URLS.SUBMIT_SAMPLE_VOTE)).toBe(true);

                await request.post(C.URLS.SUBMIT_SAMPLE_VOTE + sampleId)
                    .type('form')
                    .send({
                        _csrf: csrfToken,
                        vote: "1",
                        strike_downs: "1",
                        strike_disputers: "1"
                    }).expect(302);

                const count = await Samples.countVotes(sampleId);
                expect(count).toEqual([
                    { vote: true, strike_ups: false, strike_downs: true, strike_poster: false, strike_disputers: true, count: 1 },
                ]);
            });
        });
    });
});