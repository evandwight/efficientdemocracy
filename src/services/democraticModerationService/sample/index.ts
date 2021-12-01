import DemocraticModerationService from '..';
import { validationAssert } from '../../../routes/utils';
import Samples from '../db/samples';
export { createAllSamples } from './createSamples';
export { endSamples } from './endSamples';




export async function sampleVote({ sampleId, userId, vote, strikes }) {
    validationAssert(await DemocraticModerationService.canUserVote({ sampleId, userId }), "User not in sample", 400);

    // TODO restrict what you can strike? I don't know that this is necessary.
    // const {field, samplee_id} = await getSampleResult(sampleId);
    // const type = await db.things.getType(samplee_id);
    // assert(strikesAllowed(type, field, vote, strikes), "Cannot set those strikes");

    await Samples.vote({ sampleId, userId, vote, ...strikes });
}