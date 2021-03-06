import { Nominal } from 'simplytyped';

// Ids
type UUID = string;
export type ThingId = UUID;
export type UserId = Nominal<ThingId, "UserId">;
export type SampleId = Nominal<ThingId, "SampleId">;
export type UnsubscribeKey = Nominal<UUID, "UnsubscribeKey">;

// Types
export type VoteType = Nominal<number, "VoteType">;
export type ThingType = number;

// Things

type User = any;

// Vote
export type Vote = {
    thing_id: ThingId,
    vote: number,
}

export type Sample = {
    id: SampleId,
    samplee_id: ThingId,
    expires: Date,
    is_complete: boolean,
    post?: QPost
};


export type QPostId = Nominal<ThingId, "QPostId">;

export type QPost = {
    id: QPostId,
    title: string,
    created: Date,
    url?: string,
    content?: string,
    user_name: string,
    user_id: UserId,
    hackernews_id?: string,
    hackernews_user_name?: string,
    censor?: boolean,
    deeply_important?: boolean,
}

export type CacheEntry = {
    data: any,
    expiry: Date,
    loadingExpiry: Date,
}