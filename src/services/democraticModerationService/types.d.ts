import { UserId } from "../../db/types"

export type StrikesInfo = {
    strikeUps: boolean,
    strikeDowns: boolean,
    strikePoster: boolean,
    strikeDisputers: boolean,
}

type StrikeVoteSummary = {
    strike_ups: number,
    strike_downs: number,
    strike_poster: number,
}

export type MiniModVoteSummary = {
        vote: number,
        true: StrikeVoteSummary,
        false: StrikeVoteSummary,
}

export type DmUser = {
    userId: UserId,
    proxyId?: UserId,
}