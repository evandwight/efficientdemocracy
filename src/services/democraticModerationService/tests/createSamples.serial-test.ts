import db from '../../../db/databaseApi';
import { testApi } from '../../../testUtils';
import * as C from '../../../constant';
import { createSamples, hasSample } from '../createSamples';
import Samples from '../db/samples';

beforeAll(() => {
    return db.initialize();
});
afterAll(() => {
    return db.end();
});

describe("createSamples", () => {
    beforeEach(() => {
        return testApi.deleteAll();
    });
    describe('createSamples', () => {
        it('works for sample lvl 1', async () => {
            const field = C.FIELDS.LABELS.CENSOR;
            const userId = await testApi.createUser();
            const thingId = await testApi.createPost({userId});
            await db.votes.submitDispute({thingId, userId, field, shouldBe:true});
            await createSamples(C.SAMPLE.TYPE.LEVEL_1, field);
            const sample = Samples.getOldestSample(userId);
            expect(sample).toBeTruthy();
            // check it only creates one sample per dispute
            await createSamples(C.SAMPLE.TYPE.LEVEL_1, field);
        });
        it('works for referendums', async () => {
            const field = C.FIELDS.LABELS.CENSOR;
            const {userId, thingId, sampleId} = await testApi.createPostSample();
            await Promise.all([2,3,4,5].map(v => testApi.createDispute({thingId, userId:db.uuidv4()})));
            await Samples.setSampleIsCompleted({sampleId, count:null, result:null});

            await createSamples(C.SAMPLE.TYPE.REFERENDUM, field);
            const samples = await Samples.getSamples({thingId, field});
            expect(hasSample(samples, C.SAMPLE.TYPE.REFERENDUM)).toBe(true);
            // check it doesn't recreate referendums
            await createSamples(C.SAMPLE.TYPE.REFERENDUM, field);
        });
        it('doesnt create a referendum when no level 1 sample is complete', async () => {
            const {userId, thingId} = await testApi.createPostDispute();
            await Promise.all([2,3,4,5].map(v => testApi.createDispute({thingId, userId:db.uuidv4()})));

            await createSamples(C.SAMPLE.TYPE.REFERENDUM, C.FIELDS.LABELS.CENSOR);
            let samples = await Samples.getSamples({thingId, field: "censor"});
            expect(samples.length).toBe(0);

            const sampleId = await testApi.createSample({thingId, userIds:[userId]});

            await createSamples(C.SAMPLE.TYPE.REFERENDUM, C.FIELDS.LABELS.CENSOR);
            samples = await Samples.getSamples({thingId, field: "censor"});
            expect(samples.length).toBe(1);
        });
    });
});