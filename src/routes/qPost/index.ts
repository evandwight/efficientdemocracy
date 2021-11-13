import validator from 'validator';
import * as C from '../../constant';
import db from '../../db/databaseApi';
import DemocraticModerationService from '../../services/democraticModerationService';
import { reactRender } from '../../views/utils';
import { ViewPost } from '../../views/post/viewPost';
import { validationAssert } from '../utils';
import { addCommonExtrasToPost, addVotes } from "./utils";
export * from './listings';

export async function viewPost(req, res) {
    const postId = req.params.id;
    validationAssert(validator.isUUID(postId, 4), "Invalid post id", 400);
    const {user} = res.locals;

    let post: any = await db.qPosts.getPost(postId);
    validationAssert(!!post, "Post not found", 404);
    post = (await addCommonExtrasToPost([post.id]))[0];
    post = (await addVotes({posts: [post], user}))[0];
    post.has_samples = (await DemocraticModerationService.getCompletedSamples(postId)).length > 0;

    reactRender(res, ViewPost({ post, user }), { title: post.title, includeVotesJs: true });
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