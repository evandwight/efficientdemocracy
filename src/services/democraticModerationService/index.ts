import type { Sample, SampleId, ThingId, User, UserId } from '../../db/types';
import MiniModVotes from './db/miniModVotes';
import ModActions from './db/modActions';
import ModVotes from './db/modVotes';
import Samples from './db/samples';
import Strikes from './db/strikes';
import { submitDispute } from './disputes';
import { getMiniModVotes, miniModVote } from './miniModVotes';
import { createModAction, getFields } from './modActions';
import { getMod, updateMod } from './modVotes';
import { getProxies, getProxy, setProxy } from './proxy';
import * as SampleApi from './sample';
import type { StrikesInfo } from './types';

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
    static getSamplesForUser: (args:{userId: UserId, isProxy:boolean}) => Promise<Sample[]> = Samples.getSamplesForUser;
    static getSampleResult: (sampleId: SampleId) => Promise<any> = Samples.getSampleResult;
    static getCompletedSamples: (thingId: ThingId) => Promise<any> = Samples.getCompletedSamples;
    static sampleVote: (args: { sampleId: SampleId, userId: UserId, vote: boolean, strikes: StrikesInfo }) => Promise<void>
        = SampleApi.sampleVote;

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
    static getMiniModVotes: (args: {thingId: ThingId, userId: UserId}) => Promise<any> = getMiniModVotes;
    static getMiniModVoteCount: (args: {thingId: ThingId, field: string}) => Promise<any> 
        = MiniModVotes.countVotes;
    static miniModVote: (args: {
        thingId: ThingId,
        field: string,
        userId: UserId,
        vote: boolean,
        strikeUps: boolean,
        strikeDowns: boolean,
        strikePoster: boolean}) => Promise<void> = miniModVote;

    // Proxy setting
    static getProxy: (userId: UserId) => Promise<User> = getProxy;
    static setProxy: (args: {userId: UserId, proxyId: UserId}) => Promise<void> = setProxy;
    static getProxies: () => Promise<{id: UserId, user_name: string}[]> = getProxies;
}

export default DemocraticModerationService;