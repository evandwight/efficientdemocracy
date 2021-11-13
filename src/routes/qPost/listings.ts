import assert from 'assert';
import validator from 'validator';
import * as C from '../../constant';
import { CachedDB } from '../../db/cachedDb';
import db from '../../db/databaseApi';
import { lastSaturday } from '../../db/utils';
import { Posts } from '../../views/post/posts';
import { reactRender } from '../../views/utils';
import { validationAssert } from '../utils';
import { addCommonExtrasToPost, addVotes } from './utils';

export function getListParams(req, res) {
    const user = res.locals.user;
    const pageStr = req.params.page || "0";
    validationAssert(validator.isInt(pageStr, { min: 0 }), "Page must be a non-negative integer", 400);
    const page = parseInt(pageStr);
    const offset = page * C.POSTS_PER_PAGE;
    return { user, page, offset };
}

export function trimPosts({ allPosts, moreLinkBase, page, offset }) {
    const endIndex = offset + C.POSTS_PER_PAGE;
    const moreLink = allPosts.length >= endIndex ? `${moreLinkBase}/${page + 1}` : null;
    const posts = allPosts.slice(offset, endIndex);

    return { posts, moreLink };
}
type OptionsType = {
    moreLinkBase: string;
    titleFunc: () => string;
    showCensored?: boolean;
    ignoreFields?: string[];
};

export function renderList(cacheKey, loadFunc, options: OptionsType) {
    const {
        showCensored = false, ignoreFields = [], titleFunc, moreLinkBase } = options;
    return async (req, res) => {
        const { user, page, offset } = getListParams(req, res);

        const allPosts = await CachedDB.getFromCache(cacheKey, loadFunc);
        let { posts, moreLink } = trimPosts({ allPosts, moreLinkBase, page, offset });
        posts = await addVotes({ posts, user });

        const title = titleFunc();
        const element = Posts({ posts, user, moreLink, offset, sortType: title, showCensored, ignoreFields });
        reactRender(res, element, { title, includeVotesJs: true });
    };
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
    let { posts, moreLink } = trimPosts({ allPosts, moreLinkBase, page, offset });
    posts = await addVotes({ posts, user });

    const title = `Frozen posts (${key})`;
    const element = Posts({ posts, user, moreLink, offset, sortType: title, showCensored: true, ignoreFields: [] });
    reactRender(res, element, { title, includeVotesJs: true });
}

// Mod helpers

export const listHighlyDisputed = renderList('routes-qpost-getHighlyDisputedPosts', async () => {
    const postIds = await db.qPosts.getHighlyDisputedPosts();
    return await addCommonExtrasToPost(postIds);
}, { titleFunc: () => "Highly disputed posts", moreLinkBase: C.URLS.DISPUTED_QPOSTS, showCensored: true });

export const listMiniMod = renderList('routes-qpost-getMiniModPosts', async () => {
    const postIds = await db.qPosts.getMiniModPosts();
    return await addCommonExtrasToPost(postIds);
}, { titleFunc: () => "Mini mod posts", moreLinkBase: C.URLS.MINI_MOD_QPOSTS, showCensored: true });