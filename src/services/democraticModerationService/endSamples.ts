import * as C from '../../constant';
import Samples from './db/samples';

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
    const count = await Samples.countVotes(sample.id);
    let result;
    if (sample.type === C.SAMPLE.TYPE.LEVEL_1) {
        result = interpretResults(count);
    } else {
        result = interpretReferendumResults(count);
    }

    Samples.completeSample({sample, result, count});
}

export async function endSamples() {
    const expiredSamples = await Samples.getExpiredSamples();
    expiredSamples.map(completeSample);
}