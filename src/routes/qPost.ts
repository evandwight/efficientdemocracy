import db from '../db/databaseApi';
import * as C from '../constant';
import { reactRender } from '../views/utils';
import { Posts } from '../views/posts';
import { ViewPost } from '../views/viewPost';
import { SubmitPost } from '../views/submitPost';
import assert from 'assert';
import validator from 'validator';
import { QPost, QPostId } from '../db/types';
import { CachedDB } from '../db/cachedDb';
import { lastSaturday } from '../db/utils';
import DemocraticModerationService from '../services/democraticModerationService';
import { validationAssert } from './utils';

export async function addVotes({ posts, user }: { posts: QPost[], user: any }): Promise<QPost[]> {
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
    const valueFunc = (modAction, pv) => ({ ... (!!pv ? pv : {}), [modAction.field]: modAction.value });
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

export function getListParams(req, res) {
    const user = res.locals.user;
    const pageStr = req.params.page || "0";
    validationAssert(validator.isInt(pageStr, { min: 0 }), "Page cannot be negative", 400);
    const page = parseInt(pageStr);
    const offset = page * C.POSTS_PER_PAGE;
    return { user, page, offset };
}

export function trimPosts({ allPosts, moreLinkBase, page, offset }) {
    const endIndex = offset + C.POSTS_PER_PAGE;
    const moreLink = allPosts.length >= endIndex ? `${moreLinkBase}/${page + 1}` : null;
    const posts = allPosts.slice(offset, endIndex);

    return {posts, moreLink};
}

type OptionsType = {
    moreLinkBase: string,
    titleFunc: () => string,
    showCensored?: boolean,
    ignoreFields?: string[]
}

export function renderList(cacheKey, loadFunc, options: OptionsType) {
    const {
        showCensored = false,
        ignoreFields = [],
        titleFunc,
        moreLinkBase } = options;
    return async (req, res) => {
        const { user, page, offset } = getListParams(req, res);

        const allPosts = await CachedDB.getFromCache(cacheKey, loadFunc);
        let {posts, moreLink} = trimPosts({allPosts, moreLinkBase, page, offset});
        posts = await addVotes({ posts, user });

        const title = titleFunc();
        const element = Posts({ posts, user, moreLink, offset, sortType: title, showCensored, ignoreFields });
        reactRender(res, element, { title, includeVotesJs: true });
    }
}

export const list = renderList('routes-qpost-getHackerNewsPosts', async () => {
    const postIdsPlus = await db.qPosts.getHackerNewsPosts();
    const postIds = postIdsPlus.map(v => v.id);
    let posts = await addCommonExtrasToPost(postIds);
    posts = posts.map((v, i) => ({ ...v, ...postIdsPlus[i] }));
    return posts;
}, { titleFunc: () => "Hot posts", moreLinkBase: C.URLS.QPOSTS });

export const listNew = renderList('routes-qpost-getNewPosts', async () => {
    const postIds = await db.qPosts.getNewPosts();
    return await addCommonExtrasToPost(postIds);
}, { titleFunc: () => "New posts", moreLinkBase: C.URLS.NEW_QPOSTS, showCensored: true });

export const listTechnical = renderList('routes-qpost-getTechnical', async () => {
    const postIds = await db.qPosts.getTechnical();
    return addCommonExtrasToPost(postIds);
}, { titleFunc: () => "Technically hot", moreLinkBase: C.URLS.TECHNICAL_QPOSTS, ignoreFields: [C.FIELDS.LABELS.TECHNICAL] });

export const listDeeplyImportant = renderList('routes-qpost-getDeeplyImportantPosts', async () => {
    const postIds = await db.qPosts.getDeeplyImportantPosts();
    return addCommonExtrasToPost(postIds);
}, {
    titleFunc: () => {
        const sinceStr = lastSaturday().toLocaleDateString("EN-US", { month: "short", day: "numeric" });
        return `Deeply important posts since ${sinceStr}`;
    },
    moreLinkBase: C.URLS.DEEPLY_IMPORTANT_QPOSTS,
    showCensored: true,
    ignoreFields: [C.FIELDS.LABELS.DEEPLY_IMPORTANT]
});

export async function listFrozen(req, res) {
    const { user, page, offset } = getListParams(req, res);
    const key = req.params.key;
    assert(key.length < 1024 && validator.isAlphanumeric(key, "en-US", { ignore: "-" }));

    const allPosts = await CachedDB.getFromCache(`routes-qpost-getkv-${key}`, async () => {
        const postIds = await db.kv.get(key);
        return addCommonExtrasToPost(postIds);
    });

    const moreLinkBase = `${C.URLS.FROZEN_QPOSTS}${key}`;
    let {posts, moreLink} = trimPosts({allPosts, moreLinkBase, page, offset});
    posts = await addVotes({ posts, user });

    const title = `Frozen posts (${key})`;
    const element = Posts({ posts, user, moreLink, offset, sortType: title, showCensored: true, ignoreFields: []});
    reactRender(res, element, { title, includeVotesJs: true });
}

export async function viewPost(req, res) {
    const postId = req.params.id;
    validationAssert(validator.isUUID(postId, 4), "Invalid post id", 400);

    let post: any = await db.qPosts.getPost(postId);
    validationAssert(!!post, "Post not found", 404);
    post = (await addFields([post]))[0];
    post.has_samples = (await DemocraticModerationService.getCompletedSamples(postId)).length > 0;

    reactRender(res, ViewPost({ post, user: res.locals.user }), { title: post.title, includeVotesJs: true });
}

export async function submitVote(req, res) {
    let userId = req.user.id;
    let { postId } = req.params;
    validationAssert(validator.isUUID(postId, 4), "Invalid post id", 400);

    let vote = parseInt(req.params.vote);
    validationAssert(Object.values(C.VOTE).indexOf(vote) !== -1, "Unknown vote type", 400);

    let thingType = await db.things.getType(postId);
    validationAssert(thingType === C.THINGS.QPOST, "Thing must be a qpost", 400);

    await db.votes.upsertVote({ userId, thingId: postId, vote });

    res.sendStatus(200);
}

export async function submitDispute(req, res) {
    const userId = req.user.id;
    const { postId } = req.params;
    validationAssert(validator.isUUID(postId, 4), "Invalid post id", 400);
    const shouldBe = req.params.should_be === "true" ? true : false;
    const { field } = req.params;

    const success = await DemocraticModerationService.submitDispute({ userId, thingId: postId, field, shouldBe });
    validationAssert(success, "Already disputed", 400);

    res.sendStatus(200);
}

export async function viewSubmitPost(req, res) {
    reactRender(res, SubmitPost({ csrfToken: res.locals.csrfToken }), { title: "Submit post" });
}

export async function submitPost(req, res) {
    let userId = req.user.id;
    let { url, title } = req.body;
    assert(validator.isURL(url));

    // TODO validate title
    await db.qPosts.submitPost({ userId, url, title });
    res.redirect(req.get("Referrer"));
}