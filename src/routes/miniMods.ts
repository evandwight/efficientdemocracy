import db from '../db/databaseApi';
import * as C from '../constant';
import { reactRender } from '../views/utils';
import { PostModActions } from '../views/miniMods/postModActions';
import validator from 'validator';
import DemocraticModerationService from '../services/democraticModerationService';
import { formToStrikes, validationAssert, ValidationError } from './utils';

export async function viewPostActions(req, res) {
    const { id } = req.params;
    const userId = req.user.id;
    validationAssert(validator.isUUID(id, 4), "Invalid thing id", 400);

    const thingType = await db.things.getType(id);
    validationAssert(!!thingType, "Thing not found", 404);
    validationAssert(C.THINGS.QPOST === thingType, "Invalid thing type", 400);
    
    const post = await db.qPosts.getPost(id);
    validationAssert(!!post, "Thing not found", 400);
    const miniModVotes = await DemocraticModerationService.getMiniModVotes({userId, thingId: id});
    
    reactRender(res, PostModActions({ post, miniModVotes, csrfToken: res.locals.csrfToken }), { title: "Mini mod actions" });
}



export async function submitPostAction(req, res) {
    const thingId = req.params.id;
    validationAssert(validator.isUUID(thingId, 4), "Invalid thing id", 400);
    const { field } = req.params;
    const userId = req.user.id;
    const body = { ...req.body };
    const vote = body.hasOwnProperty("value");
    const strikes = formToStrikes(body, {disallowStrikeDisputers: true});

    await DemocraticModerationService.miniModVote({thingId, field, userId, vote, ... strikes});

    res.redirect(req.get("Referrer"));
}