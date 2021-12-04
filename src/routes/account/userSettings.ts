import * as C from '../../constant';
import db from '../../db/databaseApi';
import { UserSettings } from '../../views/userSettings';
import { reactRender } from '../../views/utils';
import { validationAssert } from '../utils';

export async function userSettings(req, res) {
    const { user, csrfToken } = res.locals;
    reactRender(res, UserSettings({ user, csrfToken }), { title: "User settings" });
}

export async function submitUserSettings(req, res) {
    const userId = req.user.id;
    const body = { ...req.body };
    const sendEmails = body.hasOwnProperty(C.USER.COLUMNS.send_emails);
    const wantsMod = body.hasOwnProperty(C.USER.COLUMNS.wants_mod);
    const wantsProxy = body.hasOwnProperty(C.USER.COLUMNS.wants_proxy);
    const dmParticipate = body[C.USER.COLUMNS.dm_participate];

    validationAssert(C.USER.DM_PARICIPATE.hasOwnProperty(dmParticipate), "Invalid dm_participate", 400);
    validationAssert(dmParticipate === C.USER.DM_PARICIPATE.no || sendEmails, 
        "To participate in democratic moderation you must enable send_emails", 400);

    await db.users.setSetting(userId, C.USER.COLUMNS.send_emails, sendEmails);
    await db.users.setSetting(userId, C.USER.COLUMNS.wants_mod, wantsMod);
    await db.users.setSetting(userId, C.USER.COLUMNS.wants_proxy, wantsProxy);
    await db.users.setSetting(userId, C.USER.COLUMNS.first_run, false);
    await db.users.setSetting(userId, C.USER.COLUMNS.dm_participate, dmParticipate);

    res.redirect(req.get("Referrer"));
}

export async function submitFirstRun(req, res) {
    const userId = req.user.id;
    const body = { ...req.body };
    const sendEmails = body.hasOwnProperty(C.USER.COLUMNS.send_emails);

    await db.users.setSetting(userId, C.USER.COLUMNS.send_emails, sendEmails);
    await db.users.setSetting(userId, C.USER.COLUMNS.first_run, false);

    res.sendStatus(200);
}

