import { validationAssert, ValidationError } from "../../routes/utils";
import db from '../../db/databaseApi';
import ModActions from './db/modActions';
import * as C from '../../constant';
import Samples from './db/samples';
import { thingTypeHasField, THING_CONFIGS } from "./thingConfig";

export async function getFields(thingId) {
    return ModActions.getModActions(thingId).then(r =>
        r.reduce((acc, val) => { acc[val.field] = val; return acc; }, {}));
}

export async function createModAction({ thingId, field, version, creatorId, isAutoMod, value, strikes }) {
    isAutoMod = !!isAutoMod; // default to false

    const type = await db.things.getType(thingId);
    validationAssert(thingTypeHasField(type, field), "Thing does not have field", 400);

    validationAssert(strikesAllowed(type, field, value, strikes), "Cannot set those strikes", 400);

    const priority = isAutoMod ? C.MOD_ACTIONS.PRIORTY.AUTO_MOD : await creatorIdToPriority(creatorId);

    if (!isHigherThanCurrentPriority(thingId, field, priority)) {
        throw new ValidationError("Higher priority action already taken", 400);
    }

    const { strikeUps, strikeDowns, strikePoster, strikeDisputers } = strikes;
    await ModActions.upsertModAction({
        thingId, creatorId, priority, banLength: C.BAN_LENGTH, version, value, field,
        strikeUps, strikeDowns, strikePoster, strikeDisputers
    });
}

async function creatorIdToPriority(creatorId) {
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


function strikesAllowed(type, field, value, strikes) {
    if (!THING_CONFIGS.hasOwnProperty(type)) {
        throw new Error("Invalid thing type, no config found");
    }
    return THING_CONFIGS[type].FIELD_CONFIGS[field].CHECK_STRIKES(value, strikes);
}

async function isHigherThanCurrentPriority(thingId, field, priority) {
    const modAction = await ModActions.getModAction({ thingId, field });
    if (modAction) {
        return modAction.priority <= priority;
    }

    return true;
}

