import db from '../db/databaseApi';
import * as C from '../constant';

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
    const disputeThreshold = sampleType === C.SAMPLE.TYPE.LEVEL_1 ? 1 : 5;
    const sampleSize = sampleType === C.SAMPLE.TYPE.LEVEL_1 ? 1 : null;
    const shouldCreateSample = sampleType === C.SAMPLE.TYPE.LEVEL_1 ? shouldCreateSampleLevel1 : shouldCreateReferendum;

    const userIds = await db.users.getUsers();
    const thingIds = await db.samples.getThingsWithDisputes({threshold:disputeThreshold, field});
    const listOfSamples = await Promise.all(thingIds.map(thingId => db.samples.getSamples({thingId, field})));
    await Promise.all(thingIds.map(async (thingId, i) => {
        const samples:any = listOfSamples[i];
        if (shouldCreateSample(samples)) {
            await db.samples.createSample({thingId, userIds, type: sampleType, field, sampleSize});
        }
    }));
}

export function normalize(l) {
    const n = sum(l);
    return l.map(v => ({...v, count:v.count/n}));
}

export function sum(l) {
    return l.reduce((cv, v) => cv + v.count, 0);
}

export function calculateStrikeProperties(count) {
    return ["strike_ups", "strike_downs", "strike_poster", "strike_disputers"].reduce((obj, prop) => {
        obj = {... obj};
        obj[prop] = sum(count.filter(v => v[prop])) > 0.5;
        return obj;
    }, {});
}

export function interpretResults(count) {
    // C.SAMPLE_SIZE
    

    const didntVote = sum(normalize(count).filter(v => v.vote === null));
    // Qurom?
    if (didntVote > 0.2) {
        return null;
    }

    // Provable?
    const voteTrueCount = normalize(count.filter(v => v.vote !== null)).filter(v => v.vote);
    const voteTrue = sum(voteTrueCount);
    if (voteTrue >= 0.5) {
        const strikeCount = calculateStrikeProperties(voteTrueCount);
        return {vote: true, ... strikeCount};
    } else {
        const voteFalseCount = normalize(count.filter(v => v.vote !== null)).filter(v => !v.vote);
        const strikeCount = calculateStrikeProperties(voteFalseCount);
        return {vote: false, ... strikeCount};
    }
}

export function interpretReferendumResults(count) {
    // C.SAMPLE_SIZE
    

    const didntVote = sum(normalize(count).filter(v => v.vote === null));
    // Qurom?
    if (didntVote > 0.8) {
        return null;
    }

    // Provable?
    const voteTrueCount = normalize(count.filter(v => v.vote !== null)).filter(v => v.vote);
    const voteTrue = sum(voteTrueCount);
    if (voteTrue >= 0.5) {
        const strikeCount = calculateStrikeProperties(voteTrueCount);
        return {vote: true, ... strikeCount};
    } else {
        const voteFalseCount = normalize(count.filter(v => v.vote !== null)).filter(v => !v.vote);
        const strikeCount = calculateStrikeProperties(voteFalseCount);
        return {vote: false, ... strikeCount};
    }
}

async function completeSample(sample) {
    const count = await db.samples.countVotes(sample.id);
    let result;
    if (sample.type === C.SAMPLE.TYPE.LEVEL_1) {
        result = interpretResults(count);
    } else {
        result = interpretReferendumResults(count);
    }

    db.samples.completeSample({sample, result, count});
}

export async function endSamples() {
    const expiredSamples = await db.samples.getExpiredSamples();
    expiredSamples.map(completeSample);
}