import * as C from '../../constant';
import db from '../../db/databaseApi';
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
                const {userId} = request;
                const thingId = await testApi.createPost({userId});
                const sampleId = await testApi.createSample({thingId, userIds:[userId]});
                let res = await request.get(C.URLS.QPOSTS)
                    .send()
                    .expect(200);
                let csrfToken = getCsrfToken(res.text);
                const sampleVoteUrl = getFormAction(res.text);
                expect(sampleVoteUrl.startsWith(C.URLS.SUBMIT_SAMPLE_VOTE)).toBe(true);
                
                await request.post(C.URLS.SUBMIT_SAMPLE_VOTE + sampleId)
                    .type('form')
                    .send({
                        _csrf: csrfToken,
                        vote: true,
                        strike_ups: false,
                        strike_downs: true,
                        strike_poster: false,
                        strike_disputers: true
                    }).expect(302);
            });
        });
    });
});