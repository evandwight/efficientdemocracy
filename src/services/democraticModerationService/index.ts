import type { Sample, SampleId, ThingId, UserId } from '../../db/types';
import type { StrikesInfo } from './types';
import * as SampleApi from './sample';
import Samples from './db/samples';
import Strikes from './db/strikes';
import ModActions from './db/modActions';
import { submitDispute } from './disputes';
import { createModAction, getFields } from './modActions';

class DemocraticModerationService {
    // Disputes
    static submitDispute: (args: { userId: UserId, thingId: ThingId, field: string, shouldBe: boolean }) => Promise<boolean> =
        submitDispute;

    // ModActions
    static getModActionsForThingIds: (thingIds: ThingId[]) => Promise<any> = ModActions.getModActionsForThingIds;
    static getModAction = ModActions.getModAction;
    static createModAction: (args: {
        thingId: ThingId,
        field: string,
        version: number,
        creatorId: ThingId,
        isAutoMod?: boolean,
        value: boolean,
        strikes: StrikesInfo
    }) => Promise<void> = createModAction;
    static getFields: (thingId: ThingId) => Promise<any> = getFields;

    // Samples
    static createAllSamples: () => Promise<void> = SampleApi.createAllSamples;
    static endAllSamples: () => Promise<void> = SampleApi.endSamples;
    static getOldestSample: (userId: UserId) => Promise<Sample> = Samples.getOldestSample;
    static getSampleResult: (sampleId: SampleId) => Promise<any> = Samples.getSampleResult;
    static getCompletedSamples: (thingId: ThingId) => Promise<any> = Samples.getCompletedSamples;
    static sampleVote: (args: { sampleId: SampleId, userId: UserId, vote: boolean, strikes: StrikesInfo }) => Promise<void>
        = SampleApi.sampleVote;
    static canUserVote: ({ userId: UserId, sampleId: SampleId }) => Promise<boolean> = Samples.canUserVote;

    // Strikes
    static getStrikes: (userId: UserId) => Promise<any> = Strikes.getStrikes
    static updateStrikes: () => Promise<void> = Strikes.updateStrikes;
}

export default DemocraticModerationService;