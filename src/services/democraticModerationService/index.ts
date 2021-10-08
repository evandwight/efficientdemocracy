import db from '../../db/databaseApi';
import * as C from '../../constant';
import { SampleId, ThingId, UserId } from '../../db/types';
import { StrikesInfo } from './types';
import { createSamples } from './createSamples';
import { endSamples } from './endSamples';
import Samples from './db/samples';
import Strikes from './db/strikes';
import ModActions from './db/modActions';
import { validationAssert, ValidationError } from '../../routes/utils';

class DemocraticModerationService {
    static hasTrueStrikes(strikes) {
        return Object.values(strikes).filter(v => v).length > 0;
    }

    static async getFields(thingId) {
        return ModActions.getModActions(thingId).then(r =>
            r.reduce((acc, val) => { acc[val.field] = val; return acc; }, {}));
    }

    static thingTypeHasField(type, field) {
        const fields = THING_CONFIGS?.[type].FIELDS || [];
        return fields.indexOf(field) !== -1;
    }

    static strikesAllowed(type, field, value, strikes) {
        if (!THING_CONFIGS.hasOwnProperty(type)) {
            throw new Error("Invalid thing type, no config found");
        }
        return THING_CONFIGS[type].FIELD_CONFIGS[field].CHECK_STRIKES(value, strikes);
    }

    static async isHigherThanCurrentPriority(thingId, field, priority) {
        const modAction = await ModActions.getModAction({ thingId, field });
        if (modAction) {
            return modAction.priority <= priority;
        }

        return true;
    }

    static async creatorIdToPriority(creatorId) {
        const creatorType = await db.things.getType(creatorId);
        if (creatorType === C.THINGS.USER) {
            return C.MOD_ACTIONS.PRIORTY.MOD;
        }
        else if (creatorType === C.THINGS.SAMPLE) {
            const sample = await Samples.getSampleResult(creatorId);
            const sampleType = sample.type;
            if (sampleType === C.SAMPLE.TYPE.LEVEL_1) {
                return C.MOD_ACTIONS.PRIORTY.SAMPLE_1;
            } else if (sampleType === C.SAMPLE.TYPE.REFERENDUM) {
                return C.MOD_ACTIONS.PRIORTY.REFERENDUM;
            }
        }
        throw new Error("Unknown creatorId type id=" + creatorId);
    }

    static async createModAction({ thingId, field, version, creatorId, isAutoMod, value, strikes }
        : { thingId: ThingId, field: string, version: number, creatorId: ThingId, isAutoMod?: boolean, value: boolean, strikes: StrikesInfo }) {
        isAutoMod = !!isAutoMod; // default to false

        const type = await db.things.getType(thingId);
        validationAssert(DemocraticModerationService.thingTypeHasField(type, field), "Thing does not have field", 400);

        validationAssert(DemocraticModerationService.strikesAllowed(type, field, value, strikes), "Cannot set those strikes", 400);

        const priority = isAutoMod ? C.MOD_ACTIONS.PRIORTY.AUTO_MOD : await DemocraticModerationService.creatorIdToPriority(creatorId);

        if (!DemocraticModerationService.isHigherThanCurrentPriority(thingId, field, priority)) {
            throw new ValidationError("Higher priority action already taken", 400);
        }

        const { strikeUps, strikeDowns, strikePoster, strikeDisputers } = strikes;
        await ModActions.upsertModAction({
            thingId, creatorId, priority, banLength: C.BAN_LENGTH, version, value, field,
            strikeUps, strikeDowns, strikePoster, strikeDisputers
        });
    }

    static async submitDispute({ userId, thingId, field, shouldBe }
        : { userId: UserId, thingId: ThingId, field: string, shouldBe: boolean }) {
        const type = await db.things.getType(thingId);
        validationAssert(DemocraticModerationService.thingTypeHasField(type, field), "Thing does not have field", 400);

        const success = await db.votes.submitDispute({ userId, thingId, field, shouldBe });
        return success;
    }

    static getSampleResult(sampleId) {
        return Samples.getSampleResult(sampleId);
    }

    static getCompletedSamples(thingId) {
        return Samples.getCompletedSamples(thingId);
    }

    static canUserVote({ sampleId, userId }) {
        return Samples.canUserVote({ sampleId, userId });
    }
    static async sampleVote({ sampleId, userId, vote, strikes }
        : { sampleId: SampleId, userId: UserId, vote: boolean, strikes: StrikesInfo }) {

        validationAssert(await DemocraticModerationService.canUserVote({ sampleId, userId }), "User not in sample", 400);

        // TODO restrict what you can strike? I don't know that this is necessary.
        // const {field, samplee_id} = await getSampleResult(sampleId);
        // const type = await db.things.getType(samplee_id);
        // assert(strikesAllowed(type, field, vote, strikes), "Cannot set those strikes");

        await Samples.vote({ sampleId, userId, vote, ...strikes });
    }

    static getModActionsForThingIds(thingIds) {
        return ModActions.getModActionsForThingIds(thingIds);
    }

    static getModAction = ModActions.getModAction;

    static async createAllSamples() {
        // TODO rework this so it's efficient as the number of sample types, fields and communities increase
        await createSamples(C.SAMPLE.TYPE.LEVEL_1, C.FIELDS.LABELS.CENSOR);
        await createSamples(C.SAMPLE.TYPE.REFERENDUM, C.FIELDS.LABELS.CENSOR);
        await createSamples(C.SAMPLE.TYPE.LEVEL_1, C.FIELDS.LABELS.DEEPLY_IMPORTANT);
        await createSamples(C.SAMPLE.TYPE.REFERENDUM, C.FIELDS.LABELS.DEEPLY_IMPORTANT);
    }

    static endAllSamples = endSamples;

    static getOldestSample(userId)  {
        return Samples.getOldestSample(userId);
    }

    static getStrikes(userId) {
        return Strikes.getStrikes(userId);
    }

    static updateStrikes = Strikes.updateStrikes;
}


const DMS = DemocraticModerationService;

const THING_CONFIGS = {
    [C.THINGS.QPOST]: {
        FIELDS: [C.FIELDS.LABELS.CENSOR, C.FIELDS.LABELS.DEEPLY_IMPORTANT],
        FIELD_CONFIGS: {
            [C.FIELDS.LABELS.CENSOR]: {
                CHECK_STRIKES: (value: boolean, strikes: StrikesInfo) => value || !DMS.hasTrueStrikes(strikes),
            },
            [C.FIELDS.LABELS.DEEPLY_IMPORTANT]: {
                CHECK_STRIKES: (value: boolean, strikes: StrikesInfo) => !DMS.hasTrueStrikes(strikes),
            },
        }
    }
}

export default DemocraticModerationService;