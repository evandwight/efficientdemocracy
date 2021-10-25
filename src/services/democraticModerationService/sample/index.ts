import {createSamples} from './createSamples';
export {endSamples} from './endSamples';
import Samples from '../db/samples';
import * as C from '../../../constant';
import { validationAssert } from '../../../routes/utils';
import DemocraticModerationService from '..';


export async function createAllSamples() {
    // TODO rework this so it's efficient as the number of sample types, fields and communities increase
    await createSamples(C.SAMPLE.TYPE.LEVEL_1, C.FIELDS.LABELS.CENSOR);
    await createSamples(C.SAMPLE.TYPE.REFERENDUM, C.FIELDS.LABELS.CENSOR);
    await createSamples(C.SAMPLE.TYPE.LEVEL_1, C.FIELDS.LABELS.DEEPLY_IMPORTANT);
    await createSamples(C.SAMPLE.TYPE.REFERENDUM, C.FIELDS.LABELS.DEEPLY_IMPORTANT);
}

export async function sampleVote({ sampleId, userId, vote, strikes }) {
    validationAssert(await DemocraticModerationService.canUserVote({ sampleId, userId }), "User not in sample", 400);

    // TODO restrict what you can strike? I don't know that this is necessary.
    // const {field, samplee_id} = await getSampleResult(sampleId);
    // const type = await db.things.getType(samplee_id);
    // assert(strikesAllowed(type, field, vote, strikes), "Cannot set those strikes");

    await Samples.vote({ sampleId, userId, vote, ...strikes });
}