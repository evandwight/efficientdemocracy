// key and value must be the same or it wont work
// COLUMNS[value] === value
export enum COLUMNS {
    is_mod = "is_mod",
    wants_mod = "wants_mod",
    send_emails = "send_emails",
    first_run = "first_run",
    is_mini_mod = "is_mini_mod",
    email_state = "email_state",
}

export enum EMAIL_STATE {
    UNVERIFIED_TRY_1 = 0,
    UNVERIFIED_TRY_2 = 1,
    UNVERIFIED_TRY_3 = 2,
    VERIFIED_GOOD = 100,
    VERIFIED_BAD = 101,
}