// key and value must be the same or it wont work
// COLUMNS[value] === value
export enum COLUMNS {
    is_mod = "is_mod",
    wants_mod = "wants_mod",
    send_emails = "send_emails",
    first_run = "first_run",
    is_mini_mod = "is_mini_mod",
    dm_participate = "dm_participate",
    dm_send_emails = "dm_send_emails",
    wants_proxy = "wants_proxy",
    proxy_id = "proxy_id",
}

export enum DM_PARTICIPATE {
    no = "no",
    proxy = "proxy",
    direct = "direct"
}
