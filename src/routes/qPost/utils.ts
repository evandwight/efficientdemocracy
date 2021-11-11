import db from '../../db/databaseApi';
import { QPost, QPostId } from '../../db/types';
import DemocraticModerationService from '../../services/democraticModerationService';


export async function addVotes({ posts, user }: { posts: QPost[]; user: any; }): Promise<QPost[]> {
    if (user) {
        const ids = posts.map(v => v.id);
        const votes = await db.votes.getVotes({ thingIds: ids, userId: user.id });
        const voteMap = listToMap(votes, vote => vote.thing_id, vote => ({ vote: vote.vote }));
        posts = combine(posts, voteMap, post => post.id);
    }
    return posts;
}

export async function addFields(posts: QPost[]): Promise<QPost[]> {
    const ids = posts.map(v => v.id);
    const modActions = await DemocraticModerationService.getModActionsForThingIds(ids);
    const valueFunc = (modAction, pv) => ({ ...(!!pv ? pv : {}), [modAction.field]: modAction.value });
    const modActionMap = listToMap(modActions, modAction => modAction.thing_id, valueFunc);
    return combine(posts, modActionMap, post => post.id);
}

export async function addPosts(postIds: QPostId[]): Promise<QPost[]> {
    const postList = await db.qPosts.getPostsByIds(postIds);
    const postMap = listToMap(postList, post => post.id, post => post);
    return postIds.map(id => postMap[id] as QPost);
}

export function listToMap(list, keyFunc: (element: any) => string, valueFunc: (element: any, previousMapEntry) => any) {
    return list.reduce((pv, cv) => {
        const key = keyFunc(cv);
        pv[key] = valueFunc(cv, pv[key]);
        return pv;
    }, {});
}

export function combine(list, map, keyFunc) {
    return list.map(v => ({ ...v, ...map[keyFunc(v)] }));
}

export async function addCommonExtrasToPost(postIds: QPostId[]): Promise<QPost[]> {
    const posts = await addPosts(postIds);
    return await addFields(posts);
}
