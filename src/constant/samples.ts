export const TYPE = {
    LEVEL_1: 0,
    REFERENDUM: 1
}

export const FIELDS = {
    CENSOR: "censor",
    DEEPLY_IMPORTANT: "deeply_important",
}

export const FIELD_LIST = Object.values(FIELDS);

export const FIELDS_PRETTY = {
    [FIELDS.CENSOR]: { 1: "censored", 0: "not censored" },
    [FIELDS.DEEPLY_IMPORTANT]: { 1: "deeply important", 0: "not deeply important" },
}

export let SAMPLE_CARD_CONFIG = {
    [FIELDS.CENSOR]: {
        title: "You have been selected to judge whether this post should be censored.",
        valueLabel: "Censor post:",
        strike: {
            postVisibility: true,
        }
    },
    [FIELDS.DEEPLY_IMPORTANT]: {
        title: "You have been selected to judge whether this post should be marked deeply important.",
        valueLabel: "Mark as deeply important:",
        strike: {
            postVisibility: false,
        }
    },
};