import type { Sample, SampleId, ThingId, UserId } from '../../db/types';
import type { StrikesInfo } from './types';
import * as SampleApi from './sample';
import Samples from './db/samples';
import Strikes from './db/strikes';
import ModActions from './db/modActions';
import { submitDispute } from './disputes';
import { createModAction, getFields } from './modActions';
import ModVotes from './db/modVotes';
import { getMod, updateMod } from './modVotes';
import { getMiniModVotes, miniModVote } from './miniModVotes';

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

    // Mod vote
    static getMod: () => Promise<UserId> = getMod;
    static getModVote: (userId: UserId) => Promise<UserId> = ModVotes.getVote;
    static setModVote: (args: {userId: UserId, vote: UserId}) => Promise<void> = ModVotes.upsertVote;
    static updateMod: () => Promise<void> = updateMod;
    static countModVotes: () => Promise<{vote:UserId, user_name:string, count:number}[]> = ModVotes.countVotes;

    // Mini mods
    static getMiniModVotes: (args: {thingId: ThingId, userId: UserId}) => Promise<{any}> = getMiniModVotes;
    static miniModVote: (args: {
        thingId: ThingId,
        field: string,
        userId: UserId,
        vote: boolean,
        strikeUps: boolean,
        strikeDowns: boolean,
        strikePoster: boolean}) => Promise<void> = miniModVote;
}

export default DemocraticModerationService;