
import * as C from '../../constant';
import { StrikesInfo } from './types';

export const THING_CONFIGS = {
    [C.THINGS.QPOST]: {
        FIELDS: [C.FIELDS.LABELS.CENSOR, C.FIELDS.LABELS.DEEPLY_IMPORTANT, C.FIELDS.LABELS.TECHNICAL],
        FIELD_CONFIGS: {
            [C.FIELDS.LABELS.CENSOR]: {
                CHECK_STRIKES: (value: boolean, strikes: StrikesInfo) => value || !hasTrueStrikes(strikes),
            },
            [C.FIELDS.LABELS.DEEPLY_IMPORTANT]: {
                CHECK_STRIKES: (value: boolean, strikes: StrikesInfo) => !hasTrueStrikes(strikes),
            },
            [C.FIELDS.LABELS.TECHNICAL]: {
                CHECK_STRIKES: (value: boolean, strikes: StrikesInfo) => !hasTrueStrikes(strikes),
            },
        }
    }
}

export function hasTrueStrikes(strikes) {
    return Object.values(strikes).filter(v => v).length > 0;
}

export function thingTypeHasField(type, field) {
    const fields = THING_CONFIGS?.[type].FIELDS || [];
    return fields.indexOf(field) !== -1;
}