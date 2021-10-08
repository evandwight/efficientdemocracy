import db from '../db/databaseApi';
import * as C from '../constant';
import { reactRender } from '../views/utils';
import { PostModActions } from '../views/postModActions';
import validator from 'validator';
import DemocraticModerationService from '../services/democraticModerationService';
import { formToStrikes, validationAssert, ValidationError } from './utils';

export async function viewPostActions(req, res) {
    const { id } = req.params;
    validationAssert(validator.isUUID(id, 4), "Invalid thing id", 400);

    const thingType = await db.things.getType(id);
    validationAssert(!!thingType, "Thing not found", 404);
    validationAssert(C.THINGS.QPOST === thingType, "Invalid thing type", 400);
    
    const post = await db.qPosts.getPost(id);
    validationAssert(!!post, "Thing not found", 400);
    const modActions = await DemocraticModerationService.getFields(id);

    reactRender(res, PostModActions({ post, modActions, csrfToken: res.locals.csrfToken }), { title: "Mod actions" });
}



export async function submitPostAction(req, res) {
    const thingId = req.params.id;
    validationAssert(validator.isUUID(thingId, 4), "Invalid thing id", 400);
    const { field } = req.params;
    const userId = req.user.id;
    const body = { ...req.body };
    const value = body.hasOwnProperty("value");
    let version;
    try {
        version = parseInt(body.version);
    } catch (error) {
        throw new ValidationError("Invalid version. Must be an integer", 400);
    }
    const strikes = formToStrikes(body, {disallowStrikeDisputers: true});

    DemocraticModerationService.createModAction({thingId, field, version, creatorId: userId, value, strikes})

    res.redirect(req.get("Referrer"));
}