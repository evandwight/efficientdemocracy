import db from '../db/databaseApi';
import * as C from '../constant';
import { reactRender } from '../views/utils';
import { PostModActions } from '../views/postModActions';
import assert from 'assert';
import validator from 'validator';
import DemocraticModerationService from '../services/democraticModerationService';
import { formToStrikes, snakeToCamelCase } from './utils';

export async function viewPostActions(req, res) {
    const { id } = req.params;
    assert(validator.isUUID(id, 4));

    assert.strictEqual(await db.things.getType(id), C.THINGS.QPOST, "Invalid thing type");
    
    const post = await db.qPosts.getPost(id);
    const modActions = await DemocraticModerationService.getFields(id);

    reactRender(res, PostModActions({ post, modActions, csrfToken: res.locals.csrfToken }), { title: "Mod actions" });
}



export async function submitPostAction(req, res) {
    const thingId = req.params.id;
    assert(validator.isUUID(thingId, 4));
    const { field } = req.params;
    const userId = req.user.id;
    const body = { ...req.body };
    const value = body.hasOwnProperty("value");
    const version = parseInt(body.version);
    const strikes = formToStrikes(body, {disallowStrikeDisputers: true});

    DemocraticModerationService.createModAction({thingId, field, version, creatorId: userId, value, strikes})

    res.redirect(req.get("Referrer"));
}