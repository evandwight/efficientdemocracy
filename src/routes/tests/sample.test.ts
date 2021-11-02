import * as C from '../../constant';
import {testApi, login, getCsrfToken, notLoggedIn, getFormAction} from '../../testUtils';
import db from '../../db/databaseApi';
import Samples from '../../services/democraticModerationService/db/samples';
import { countsToDataTable, dangerousCountsToChartData } from '../../routes/sample';

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

    describe('countsToDataTable', () => {
        it('works', () => {
            const counts = [
                {vote: true, strike_ups: false, strike_downs: false, strike_poster: false, strike_disputers: false, count: 1},
                {vote: false, strike_ups: true, strike_downs: true, strike_poster: true, strike_disputers: true, count: 2},
                {vote: null, strike_ups: true, strike_downs: true, strike_poster: true, strike_disputers: true, count: 3},
            ]
            const res = countsToDataTable(counts);
            expect(res).toMatchSnapshot();
        });
    });

    describe('countsToChartData', () => {
        it('works', () => {
            const counts = [
                {vote: true, strike_ups: false, strike_downs: false, strike_poster: false, strike_disputers: false, count: 1},
                {vote: false, strike_ups: true, strike_downs: true, strike_poster: true, strike_disputers: true, count: 2},
                {vote: null, strike_ups: true, strike_downs: true, strike_poster: true, strike_disputers: true, count: 3},
            ]
            const sample = {
                result: {vote: false, strike_ups: true, strike_downs: true, strike_poster: true, strike_disputers: true},
                counts
            }
            const res = dangerousCountsToChartData(sample);
            expect(res).toMatchSnapshot();
        });
        it('handles null results', () => {
            const counts = [
                {vote: true, strike_ups: false, strike_downs: false, strike_poster: false, strike_disputers: false, count: 1},
                {vote: false, strike_ups: true, strike_downs: true, strike_poster: true, strike_disputers: true, count: 2},
                {vote: null, strike_ups: true, strike_downs: true, strike_poster: true, strike_disputers: true, count: 3},
            ]
            const sample = {
                result: null,
                counts
            }
            const res = dangerousCountsToChartData(sample);
            expect(res).toMatchSnapshot();
        });
    });
});