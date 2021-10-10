export type Field = {
    GOODNESS: boolean,
    PRETTY_PRINT: {
        1: string,
        0: string,
    },
    PRETTY_LABEL: string
    SAMPLE_CARD: {
        TITLE: string,
        VALUE_LABEL: string,
        STRIKE: {
            POST_VISIBILITY: boolean,
        },
    },
    VIEW_SAMPLE_RESULT: {
        VOTE_CANVAS_TITLE: string,
    }
}

export const LABELS = {
    CENSOR: "censor",
    DEEPLY_IMPORTANT: "deeply_important",
    TECHNICAL: "technical",
}

// TODO this needs to be the same order all the time or it's useless for making lists
export const LIST = Object.values(LABELS);

export const PROPS: { [key: string]: Field; } = {
    [LABELS.CENSOR]: {
        GOODNESS: false,
        PRETTY_PRINT: {1: "censored", 0: "not censored"},
        PRETTY_LABEL: "censor",
        SAMPLE_CARD: {
            TITLE: "You have been selected to judge whether this post should be censored.",
            VALUE_LABEL: "Censor post:",
            STRIKE: {
                POST_VISIBILITY: true,
            }
        },
        VIEW_SAMPLE_RESULT: {
            VOTE_CANVAS_TITLE: "Votes for should the post be censored"
        },
    },
    [LABELS.DEEPLY_IMPORTANT]: {
        GOODNESS: true,
        PRETTY_PRINT: { 1: "deeply important", 0: "not deeply important" },
        PRETTY_LABEL: "deeply important",
        SAMPLE_CARD: {
            TITLE: "You have been selected to judge whether this post should be marked deeply important.",
            VALUE_LABEL: "Mark as deeply important:",
            STRIKE: {
                POST_VISIBILITY: false,
            }
        },
        VIEW_SAMPLE_RESULT: {
            VOTE_CANVAS_TITLE: "Votes for should the post be marked deeply important"
        },
    },
    [LABELS.TECHNICAL]: {
        GOODNESS: true,
        PRETTY_PRINT: { 1: "technical", 0: "not technical" },
        PRETTY_LABEL: "technical",
        SAMPLE_CARD: {
            TITLE: "You have been selected to judge whether this post should be marked technical.",
            VALUE_LABEL: "Mark as technical:",
            STRIKE: {
                POST_VISIBILITY: false,
            }
        },
        VIEW_SAMPLE_RESULT: {
            VOTE_CANVAS_TITLE: "Votes for should the post be marked technical"
        },
    },
}