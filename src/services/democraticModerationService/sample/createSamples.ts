import * as C from '../../../constant';
import db from '../../../db/databaseApi';
import { generateUniqueRandom } from '../../../db/utils';
import Disputes from '../db/disputes';
import Samples from '../db/samples';

export function hasSample(samples, type) {
    return samples.reduce((acc, cv) => acc || cv.type === type, false)
}

export function hasCompletedSample(samples, type) {
    return samples.reduce((acc, cv) => acc || (cv.type === type && !!cv.is_complete), false)
}


export async function createAllSamples() {
    const userIds = await db.users.getUserIds();
    // TODO filter to just users particpating in democratic moderation

    await createAllSampleLevel1(userIds);
    await createAllReferendums(userIds);
}

export async function createAllSampleLevel1(userIds) {
    const maxSamples = getMaxSamples(userIds.length, C.SAMPLE.SAMPLE_SIZE);
    if (maxSamples === 0) {
        return;
    }

    const sampleGenerator = generateSampleUserIds({ userIds, sampleSize: C.SAMPLE.SAMPLE_SIZE, maxSamples });

    let disputes = await Disputes.getDisputes(C.SAMPLE.MININUM_DISPUTE_THRESHOLD);
    disputes = disputes.filter(row => row.should_be !== row.value && row.priority < C.MOD_ACTIONS.PRIORTY.SAMPLE_1);
    for (const row of disputes) {
        const thingId = row.thing_id;
        const field = row.field;
        const existingSamples = await Samples.getSamples({ thingId, field });
        if (!hasSample(existingSamples, C.SAMPLE.TYPE.LEVEL_1)) {
            const nextSample = sampleGenerator.next();
            if (nextSample.done) {
                break;
            }
            await Samples.createSample({ thingId, userIdsInSample: nextSample.value, type: C.SAMPLE.TYPE.LEVEL_1, field });
        }
    }
}

export function getMaxSamples(numUsers, sampleSize) {
    // TODO use statistics, not just heuristic of sample max 10% of eligible users
    return Math.floor((numUsers * 0.1) / sampleSize);
}

export function* generateSampleUserIds({ userIds, sampleSize, maxSamples }): Generator<any[]> {
    let remainingUserIds = [...userIds];
    for (let i = 0; i < maxSamples; i += 1) {
        const sampleIndicies = generateUniqueRandom(remainingUserIds.length - 1, sampleSize);
        yield sampleIndicies.map(v => remainingUserIds[v]);
        const sampleIndiciesHash = sampleIndicies.reduce((pv, cv) => ({ ...pv, [cv]: true }), {});
        remainingUserIds = remainingUserIds.filter((e, i) => sampleIndiciesHash[i]);
    }
}

export async function createAllReferendums(userIds) {
    const isSmallCommunity = getMaxSamples(userIds.length, C.SAMPLE.SAMPLE_SIZE) === 0;

    const THRESHOLD = Math.ceil(userIds.length * C.SAMPLE.MINIMUM_REFERENDUM_THRESHOLD_PERCENT);
    let disputes = await Disputes.getDisputes(THRESHOLD);
    disputes = disputes.filter(row => row.should_be !== row.value && row.priority < C.MOD_ACTIONS.PRIORTY.REFERENDUM);
    for (const row of disputes) {
        const thingId = row.thing_id;
        const field = row.field;
        const existingSamples = await Samples.getSamples({ thingId, field });
        if (!hasSample(existingSamples, C.SAMPLE.TYPE.REFERENDUM)
            && (isSmallCommunity || hasCompletedSample(existingSamples, C.SAMPLE.TYPE.LEVEL_1))) {
            await Samples.createSample({ thingId, userIdsInSample: userIds, type: C.SAMPLE.TYPE.REFERENDUM, field });
            // create at most 1 referendum per day
            break;
        }
    }
}