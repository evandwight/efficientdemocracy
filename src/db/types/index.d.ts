import { Nominal } from 'simplytyped';

// Ids
type UUID = string;
export type ThingId = UUID;
export type UserId = Nominal<ThingId, "UserId">;
export type SampleId = Nominal<ThingId, "SampleId">;

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
    url?: string,
    content?: string,
    user_name: string,
    user_id: UserId,
    censor?: boolean,
    deeply_important?: boolean,
}