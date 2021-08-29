export * as SAMPLE from './samples';
export * as URLS from './urls';
export * as MOD_ACTIONS from './modActions';

export const SAMPLE_SIZE = 1;
export const BAN_LENGTH = 90; // 90 days

export const THINGS = {
    USER: 0 ,
    SAMPLE: 1,
    REDDIT_POST: 2,
    QPOST: 3,
    QCOMMENT: 4,
    MOD_ACTION: 5,
};

export const VOTE = {
    UP: 2,
    NONE : 1,
    DOWN : 0
}
export const VOTE_TYPE = {
    REQUEST_POST_QUARANTINE: 0,
    REQUEST_POST_TRUTH: 1,
    POST_SAMPLE_QUARANTINE_LVL_1: 2,
    POST_SAMPLE_QUARANTINE_REFERENDUM: 3,
    POST_SAMPLE_TRUTH_LVL_1: 4,
    POST_SAMPLE_TRUTH_REFERENDUM: 5,
    DIRECTION_VOTE: 6,
}

export const BOT_ACCOUNT_USER_ID = "2f6a3941-8102-486d-8797-56b0be21c34a";

export const DB = {
    ERROR_CODE: {
        UNIQUE_VIOLATION: '23505',
    }
}