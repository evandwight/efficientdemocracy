import * as C from '../../constant';
import {testApi, login, getCsrfToken, notLoggedIn, getFormAction} from '../../testUtils';
import db from '../../db/databaseApi';
import Samples from '../../services/democraticModerationService/db/samples';

beforeAll(() => {
    return db.initialize();
});
afterAll(() => {
    return db.end();
});

describe('sample', () => {
    const type = C.SAMPLE.TYPE.LEVEL_1;
    beforeEach(() => {
        return testApi.deleteAll();
    });
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

    
    describe('viewSampleResult', () => {
        it('works', async () => {
            const request = await notLoggedIn();
            const userId = await testApi.createUser();
            const thingId = await testApi.createPost({userId});
            const sampleId = await testApi.createSample({thingId, userIds:[userId]});
            await Samples.setSampleIsCompleted({sampleId, result:null, count:[]});
    
            let res = await request.get(C.URLS.VIEW_SAMPLE_RESULT + sampleId)
                .send()
                .expect(200);
        });
    });
    describe('viewSamples', () => {
        it('works', async () => {
            const request = await notLoggedIn();
            const userId = await testApi.createUser();
            const thingId = await testApi.createPost({userId});
            const sampleId = await testApi.createSample({thingId, userIds:[userId]});
            await Samples.setSampleIsCompleted({sampleId, result:null, count:[]});
    
            let res = await request.get(C.URLS.VIEW_SAMPLES + thingId)
                .send()
                .expect(200);
        });
    });
});