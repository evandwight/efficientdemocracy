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

export async function addVotes({posts, user}: {posts: QPost[], user: any}): Promise<QPost[]> {
    if (user) {
        const ids = posts.map(v => v.id);
        const votes = await db.votes.getVotes({ thingIds: ids, userId: user.id});
        const voteMap = listToMap(votes, vote => vote.thing_id, vote => ({vote: vote.vote}));
        posts = combine(posts, voteMap, post => post.id);
    }
    return posts;
}

export async function addFields(posts: QPost[]): Promise<QPost[]> {
    const ids = posts.map(v => v.id);
    const modActions = await DemocraticModerationService.getModActionsForThingIds(ids);
    const valueFunc = (modAction, pv) => ({ ... (!!pv ? pv : {}), [modAction.field]: modAction.value});
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
    return list.map(v => ({...v, ...map[keyFunc(v)]}));
} 

export async function addAllExtrasToPost({postIds, user}: {postIds: QPostId[], user: any}): Promise<QPost[]> {
    let posts = await addPosts(postIds);
    posts = await addVotes({posts, user});
    posts = await addFields(posts);
    return posts;
}

export function getListParams(req, res) {
    const user = res.locals.user;

    const page = req.params.page ? parseInt(req.params.page) : 0;
    assert(page>= 0, "Page cannot be negative");
    
    const offset = page*C.POSTS_PER_PAGE;
    return {user, page, offset};
}

export function trimPosts({posts, moreLinkBase, page}) {
    let moreLink = null;
    if (posts.length > C.POSTS_PER_PAGE) {
        moreLink = `${moreLinkBase}/${page+1}`;
        posts = posts.slice(0, C.POSTS_PER_PAGE);
    }
    return {posts, moreLink};
}

export function renderPosts({res, title, moreLinkBase, showCensored, page, offset, posts, user, ignoreFields} : {res: any, title: string, moreLinkBase: string, showCensored: boolean, page: number, offset: number, posts: QPost[], user: any, ignoreFields?: string[]}) {
    let moreLink = null;
    ignoreFields = ignoreFields || [];
    ({posts, moreLink} = trimPosts({moreLinkBase, posts, page}));
    reactRender(res, Posts({ posts, user, showCensored, moreLink, offset, sortType:title, ignoreFields}), {title, includeVotesJs: true});
}

export async function list(req, res) {
    const {user, page, offset} = getListParams(req, res);

    const postIdsPlus = await CachedDB.getHackerNewsPosts(offset);
    const postIds = postIdsPlus.map(v => v.id);
    let posts = await addAllExtrasToPost({postIds, user});
    posts = posts.map((v, i) => ({... v, ... postIdsPlus[i]}));

    renderPosts({res, page, offset, user, posts, title: "Hot posts", showCensored: false, moreLinkBase: C.URLS.QPOSTS});
}

export async function listNew(req, res) {
    const {user, page, offset} = getListParams(req, res);

    const postIds = await db.qPosts.getNewPosts(offset);
    const posts = await addAllExtrasToPost({postIds, user});

    renderPosts({res, page, offset, user, posts, title: "New posts", showCensored: true, moreLinkBase: C.URLS.NEW_QPOSTS});
}

export async function listTechnical(req, res) {
    const {user, page, offset} = getListParams(req, res);

    const postIds = await CachedDB.getTechnical(offset);
    const posts = await addAllExtrasToPost({postIds, user});
    
    renderPosts({res, page, offset, user, posts, title: `Technically hot`, showCensored: false, moreLinkBase: C.URLS.TECHNICAL_QPOSTS, ignoreFields: [C.FIELDS.LABELS.TECHNICAL]});
}

export async function listDeeplyImportant(req, res) {
    const {user, page, offset} = getListParams(req, res);

    const postIds = await CachedDB.getDeeplyImportantPosts(offset);
    const posts = await addAllExtrasToPost({postIds, user});

    const sinceStr = lastSaturday().toLocaleDateString("EN-US", {month:"short", day:"numeric"});
    renderPosts({res, page, offset, user, posts, title: `Deeply important posts since ${sinceStr}`, showCensored: true, moreLinkBase: C.URLS.DEEPLY_IMPORTANT_QPOSTS, ignoreFields: [C.FIELDS.LABELS.DEEPLY_IMPORTANT]});
}

export async function listFrozen(req, res) {
    const {user, page, offset} = getListParams(req, res);
    
    const key = req.params.key;
    assert(key.length < 1024 && validator.isAlphanumeric(key, "en-US", {ignore: "-"}));

    const postIds = await db.kv.get(key);
    let posts = await addAllExtrasToPost({postIds, user});
    
    renderPosts({res, page, offset, user, posts, title: `Frozen posts (${key})`, showCensored: true, moreLinkBase: `${C.URLS.FROZEN_QPOSTS}${key}`});
}

export async function viewPost(req, res) {
    const postId = req.params.id;
    validationAssert(validator.isUUID(postId,4), "Invalid post id", 400);

    let post: any = await db.qPosts.getPost(postId);
    validationAssert(!!post, "Post not found", 404);
    post = (await addFields([post]))[0];
    post.has_samples = (await DemocraticModerationService.getCompletedSamples(postId)).length > 0;

    reactRender(res, ViewPost({ post, user:res.locals.user }), {title: post.title, includeVotesJs: true});
}

export async function submitVote(req, res) {
    let userId = req.user.id;
    let { postId } = req.params;
    validationAssert(validator.isUUID(postId,4), "Invalid post id", 400);

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
    validationAssert(validator.isUUID(postId,4), "Invalid post id", 400);
    const shouldBe = req.params.should_be === "true" ? true : false;
    const {field} = req.params;

    const success = await DemocraticModerationService.submitDispute({userId, thingId:postId, field, shouldBe});
    validationAssert(success, "Already disputed", 400);

    res.sendStatus(200);
}

export async function viewSubmitPost(req, res) {
    reactRender(res, SubmitPost({csrfToken:res.locals.csrfToken}), {title: "Submit post"});
}

export async function submitPost(req, res) {
    let userId = req.user.id;
    let { url, title } = req.body;
    assert(validator.isURL(url));

    // TODO validate title
    await db.qPosts.submitPost({ userId, url, title });
    res.redirect(req.get("Referrer"));
}