import db from '../db/databaseApi';
import * as C from '../constant';
import { reactRender } from '../views/utils';
import { PostModActions } from '../views/postModActions';
import assert from 'assert';
import validator from 'validator';
import { assertFieldExists } from '../routes/utils';

export async function viewPostActions(req, res) {
    const { id } = req.params;
    assert(validator.isUUID(id, 4));

    assert.strictEqual(await db.things.getType(id), C.THINGS.QPOST, "Invalid thing type");
    
    const post = await db.qPosts.getPost(id);
    const modActions = await db.modActions.getModActions(id).then(r =>
        r.reduce((acc, val) => { acc[val.field] = val; return acc; }, {}));

    reactRender(res, PostModActions({ post, modActions, csrfToken: res.locals.csrfToken }), { title: "Mod actions" });
}

export async function submitPostAction(req, res) {
    const postId = req.params.id;
    assert(validator.isUUID(postId, 4));
    const { field } = req.params;
    assertFieldExists(field);
    const userId = req.user.id;
    const body = { ...req.body };
    const [value, strikeUps, strikeDowns, strikePoster] =
        ["value", "strike_ups", "strike_downs", "strike_poster"].map((v) => body.hasOwnProperty(v));
    const version = parseInt(body.version);


    assert.strictEqual(await db.things.getType(postId), C.THINGS.QPOST, "Invalid thing type");
    if (field === C.SAMPLE.FIELDS.CENSOR) {
        assert(value || !(strikeUps || strikeDowns || strikePoster), "Cannot strike when not censoring");
    } else if (field === C.SAMPLE.FIELDS.DEEPLY_IMPORTANT) {
        assert(!(strikeUps || strikeDowns || strikePoster), "Cannot strike with field deeply important");
    }

    const modAction = await db.modActions.getModAction({ thingId: postId, field });
    if (modAction) {
        assert(modAction.priority <= C.MOD_ACTIONS.PRIORTY.MOD, "Higher priority action already taken");
    }

    const priority = C.MOD_ACTIONS.PRIORTY.MOD;

    await db.modActions.upsertModAction({ thingId: postId, creatorId: userId, strikeUps, strikeDowns, strikePoster, strikeDisputers: false, priority, banLength: C.BAN_LENGTH, version, value, field });

    res.redirect(C.URLS.QPOSTS);
}