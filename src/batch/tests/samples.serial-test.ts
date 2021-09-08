import db from '../../db/databaseApi';
import { testApi } from '../../testUtils';
import * as C from '../../constant';
import { interpretResults, createSamples, hasSample } from '../../batch/samples';

beforeAll(() => {
    return db.initialize();
});
afterAll(() => {
    return db.end();
});

describe("Batch samples", () => {
    beforeEach(() => {
        return testApi.deleteAll();
    });

    describe('interpretResults', () => {
        it('works', async () => {
            const count = [
                {"count": 1, "strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": true},
            ]
            const res = interpretResults(count);
            expect(res).toEqual({"strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": true});
        });

        it('no qurom', async () => {
            const count = [
                {"count": 1, "strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": true},
                {"count": 1, "strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": null},
                {"count": 1, "strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": false},
            ]
            const res = interpretResults(count);
            expect(res).toEqual(null);
        });
        it('removes nulls from vote consideration', async () => {
            const count = [
                {"count": 6, "strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": true},
                {"count": 2, "strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": null},
                {"count": 5, "strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": false},
            ]
            const res = interpretResults(count);
            expect(res).toEqual({"strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": true});
        });
        it('computes strikes correctly', async () => {
            const count = [
                {"count": 6, "strike_disputers": true, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": true},
                {"count": 5, "strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": true},
            ]
            const res = interpretResults(count);
            expect(res).toEqual({"strike_disputers": true, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": true});
        });
    });

    describe('createSamples', () => {
        it('works for sample lvl 1', async () => {
            const field = C.FIELDS.LABELS.CENSOR;
            const userId = await testApi.createUser();
            const thingId = await testApi.createPost({userId});
            await db.votes.submitDispute({thingId, userId, field, shouldBe:true});
            await createSamples(C.SAMPLE.TYPE.LEVEL_1, field);
            const sample = db.samples.getOldestSample(userId);
            expect(sample).toBeTruthy();
            // check it only creates one sample per dispute
            await createSamples(C.SAMPLE.TYPE.LEVEL_1, field);
        });
        it('works for referendums', async () => {
            const field = C.FIELDS.LABELS.CENSOR;
            const {userId, thingId, sampleId} = await testApi.createPostSample();
            await Promise.all([2,3,4,5].map(v => testApi.createDispute({thingId, userId:db.uuidv4()})));
            await db.samples.setSampleIsCompleted({sampleId, count:null, result:null});

            await createSamples(C.SAMPLE.TYPE.REFERENDUM, field);
            const samples = await db.samples.getSamples({thingId, field});
            expect(hasSample(samples, C.SAMPLE.TYPE.REFERENDUM)).toBe(true);
            // check it doesn't recreate referendums
            await createSamples(C.SAMPLE.TYPE.REFERENDUM, field);
        });
        it('doesnt create a referendum when no level 1 sample is complete', async () => {
            const {userId, thingId} = await testApi.createPostDispute();
            await Promise.all([2,3,4,5].map(v => testApi.createDispute({thingId, userId:db.uuidv4()})));

            await createSamples(C.SAMPLE.TYPE.REFERENDUM, C.FIELDS.LABELS.CENSOR);
            let samples = await db.samples.getSamples({thingId, field: "censor"});
            expect(samples.length).toBe(0);

            const sampleId = await testApi.createSample({thingId, userIds:[userId]});

            await createSamples(C.SAMPLE.TYPE.REFERENDUM, C.FIELDS.LABELS.CENSOR);
            samples = await db.samples.getSamples({thingId, field: "censor"});
            expect(samples.length).toBe(1);
        });
    });
});