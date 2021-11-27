import * as C from '../../constant';
import db from '../../db/databaseApi';
import { UserSettings } from '../../views/userSettings';
import { reactRender } from '../../views/utils';

export async function userSettings(req, res) {
    const { user, csrfToken } = res.locals;
    reactRender(res, UserSettings({ user, csrfToken }), { title: "User settings" });
}

export async function submitUserSettings(req, res) {
    const userId = req.user.id;
    const body = { ...req.body };
    const sendEmails = body.hasOwnProperty("send_emails");
    const wantsMod = body.hasOwnProperty("wants_mod");

    await db.users.setSetting(userId, C.USER.COLUMNS.send_emails, sendEmails);
    await db.users.setSetting(userId, C.USER.COLUMNS.wants_mod, wantsMod);
    await db.users.setSetting(userId, C.USER.COLUMNS.first_run, false);

    res.redirect(req.get("Referrer"));
}

export async function submitFirstRun(req, res) {
    const userId = req.user.id;
    const body = { ...req.body };
    const sendEmails = body.hasOwnProperty("send_emails");

    await db.users.setSetting(userId, C.USER.COLUMNS.send_emails, sendEmails);
    await db.users.setSetting(userId, C.USER.COLUMNS.first_run, false);

    res.sendStatus(200);
}

