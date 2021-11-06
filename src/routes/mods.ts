import db from '../db/databaseApi';
import * as C from '../constant';
import { reactRender } from '../views/utils';
import { PostModActions } from '../views/postModActions';
import validator from 'validator';
import DemocraticModerationService from '../services/democraticModerationService';
import { formToStrikes, validationAssert } from './utils';
import { ViewSetMiniMods } from '../views/viewSetMiniMods';

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
    const strikes = formToStrikes(body, {disallowStrikeDisputers: true});

    DemocraticModerationService.createModAction({thingId, field, creatorId: userId, value, strikes})

    res.redirect(req.get("Referrer"));
}

export async function viewSetMiniMods(req, res) {
    let users = await db.users.getUsers();
    users.sort((a,b) => a.user_name - b.user_name);
    console.log(users);
    reactRender(res, ViewSetMiniMods({users}), {title: "Set mini mods", includeVotesJs: true});
}

export async function setMiniMod(req, res) {
    const { userId } = req.params;
    const value = req.params.value === "true" ? true : false;
    validationAssert(validator.isUUID(userId, 4), "Invalid user id", 400);

    await db.users.setSetting(userId, C.USER.COLUMNS.is_mini_mod, value);

    res.sendStatus(200);
}