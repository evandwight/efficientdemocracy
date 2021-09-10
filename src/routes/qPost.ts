import db from '../db/databaseApi';
import * as C from '../constant';
import { reactRender } from '../views/utils';
import { Posts } from '../views/posts';
import { ViewPost } from '../views/viewPost';
import { SubmitPost } from '../views/submitPost';
import assert from 'assert';
import validator from 'validator';
import { assertFieldExists } from '../routes/utils';
import { QPost } from '../db/types';

async function addVotes({posts, user}) {
    if (user) {
        const ids = posts.map(v => v.id);
        const votes = await db.votes.getVotes({ thingIds: ids });
        const idToVote = votes.reduce((pv, cv) => { pv[cv.thing_id] = cv.vote; return pv; }, {});
        posts = posts.map(v => ({ ...v, vote: idToVote[v.id] } as QPost));
    }
    return posts;
}

export async function addFields(posts) {
    const ids = posts.map(v => v.id);
    const modActions = await db.modActions.getModActionsForThingIds(ids);
    const modActionMap = modActions.reduce((acc, val) => {
        const thingId = val.thing_id
        if (! acc.hasOwnProperty(thingId)) {
            acc[thingId] = {};
        }
        acc[thingId][val.field] = val.value;
        return acc;
    }, {});
    return posts.map(v => ({ 
        ... v,
        ... modActionMap[v.id]
    } as QPost));
}

export async function list(req, res) {
    const user = res.locals.user;

    const page = req.params.page ? parseInt(req.params.page) : 0;
    assert(page>= 0, "Page cannot be negative");


    const offset = page*30;

    let posts = await db.qPosts.getHackerNewsPosts(offset);
    posts = await addVotes({posts,user});
    posts = await addFields(posts);

    const moreLink = `${C.URLS.QPOSTS}/${page+1}`
    reactRender(res, Posts({ posts, user, showCensored:false, moreLink, offset }), {title:"Posts", includeVotesJs: true});
}

export async function listNew(req, res) {
    const user = res.locals.user;

    const page = req.params.page ? parseInt(req.params.page) : 0;
    assert(page>= 0, "Page cannot be negative");


    const offset = page*30;
    
    let posts = await db.qPosts.getNewPosts(offset);
    posts = await addVotes({posts,user});
    posts = await addFields(posts);

    const moreLink = `${C.URLS.NEW_QPOSTS}/${page+1}`
    reactRender(res, Posts({ posts, user, showCensored:true, moreLink, offset }), {title:"New posts", includeVotesJs: true});
}

export async function listDeeplyImportant(req, res) {
    const user = res.locals.user;

    const page = req.params.page ? parseInt(req.params.page) : 0;
    assert(page>= 0, "Page cannot be negative");


    const offset = page*30;
    
    let posts = await db.qPosts.getDeeplyImportantPosts(offset);
    posts = await addVotes({posts,user});
    posts = await addFields(posts);

    const moreLink = `${C.URLS.DEEPLY_IMPORTANT_QPOSTS}/${page+1}`
    reactRender(res, Posts({ posts, user, showCensored:true, moreLink, offset }), {title:"New posts", includeVotesJs: true});
}

export async function listFrozen(req, res) {
    const user = res.locals.user;

    const page = req.params.page ? parseInt(req.params.page) : 0;
    assert(page>= 0, "Page cannot be negative");
    const offset = page*C.POSTS_PER_PAGE;

    const key = req.params.key;
    assert(key.length < 1024 && validator.isAlphanumeric(key, "en-US", {ignore: "-"}));
    const postIds = await db.kv.get(key);
    let posts: any[] = await Promise.all(postIds.map(postId => db.qPosts.getPost(postId)));
    posts = await addVotes({posts,user});
    posts = await addFields(posts);

    // TODO title from key?
    let moreLink = null;
    if (posts.length - offset > C.POSTS_PER_PAGE) {
        const moreLink = `${C.URLS.FROZEN_QPOSTS}${key}/${page+1}`;
    }

    posts = posts.slice(offset, C.POSTS_PER_PAGE);
    reactRender(res, Posts({ posts, user, showCensored:true, moreLink, offset}), {title:"Frozen posts", includeVotesJs: true});
}

export async function viewPost(req, res) {
    const postId = req.params.id;
    assert(validator.isUUID(postId,4));

    let post: any = await db.qPosts.getPost(postId);
    post = (await addFields([post]))[0];
    post.has_samples = (await db.samples.getCompletedSamples(postId)).length > 0;

    reactRender(res, ViewPost({ post, user:res.locals.user }), {title: post.title, includeVotesJs: true});
}

export async function submitVote(req, res) {
    let userId = req.user.id;
    let { postId } = req.params;
    assert(validator.isUUID(postId,4));

    let vote = parseInt(req.params.vote);
    assert(Object.values(C.VOTE).indexOf(vote) !== -1, "Unknown vote type");

    let thingType = await db.things.getType(postId);
    assert.strictEqual(thingType, C.THINGS.QPOST, "Thing must be a qpost");

    await db.votes.upsertVote({ userId, thingId: postId, vote });

    res.sendStatus(200);
}

export async function submitDispute(req, res) {
    const userId = req.user.id;
    const { postId } = req.params;
    assert(validator.isUUID(postId,4));
    const shouldBe = req.params.should_be === "true" ? true : false;
    const {field} = req.params;
    assertFieldExists(field);

    const thingType = await db.things.getType(postId);
    assert.strictEqual(thingType, C.THINGS.QPOST, "Thing must be a qpost");

    await db.votes.submitDispute({ userId, thingId: postId, field, shouldBe});

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
    res.redirect(C.URLS.QPOSTS);
}