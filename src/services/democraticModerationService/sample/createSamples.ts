import * as C from '../../../constant';
import db from '../../../db/databaseApi';
import Samples from '../db/samples';

export function hasSample(samples, type) {
    return samples.reduce((acc, cv) => acc || cv.type === type, false)
}

export function hasCompletedSample(samples, type) {
    return samples.reduce((acc, cv) => acc || (cv.type === type && !!cv.is_complete), false)
}

export function shouldCreateSampleLevel1(samples) {
    return !hasSample(samples, C.SAMPLE.TYPE.LEVEL_1);
}

export function shouldCreateReferendum(samples) {
    return hasCompletedSample(samples, C.SAMPLE.TYPE.LEVEL_1) && !hasSample(samples, C.SAMPLE.TYPE.REFERENDUM);
}

export async function createSamples(sampleType, field) {
    // TODO set appropriate dispute threshold & sample size based on the number of users
    const disputeThreshold = sampleType === C.SAMPLE.TYPE.LEVEL_1 ? 1 : 5;
    const sampleSize = sampleType === C.SAMPLE.TYPE.LEVEL_1 ? 1 : null;
    const shouldCreateSample = sampleType === C.SAMPLE.TYPE.LEVEL_1 ? shouldCreateSampleLevel1 : shouldCreateReferendum;

    const userIds = await db.users.getUserIds();
    const thingIds = await Samples.getThingsWithDisputes({threshold:disputeThreshold, field});
    const listOfSamples = await Promise.all(thingIds.map(thingId => Samples.getSamples({thingId, field})));
    await Promise.all(thingIds.map(async (thingId, i) => {
        const samples:any = listOfSamples[i];
        if (shouldCreateSample(samples)) {
            await Samples.createSample({thingId, userIds, type: sampleType, field, sampleSize});
        }
    }));
}