import { validationAssert } from '../../../routes/utils';
import Samples from '../db/samples';
export { createAllSamples } from './createSamples';
export { endSamples } from './endSamples';




export async function sampleVote({ sampleId, userId, vote, strikes }) {
    // TODO restrict what you can strike? I don't know that this is necessary.
    // const {field, samplee_id} = await getSampleResult(sampleId);
    // const type = await db.things.getType(samplee_id);
    // assert(strikesAllowed(type, field, vote, strikes), "Cannot set those strikes");

    validationAssert(await Samples.vote({ sampleId, userId, vote, ...strikes }), "Unable to submit vote", 400);
}