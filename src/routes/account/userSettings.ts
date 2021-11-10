import { reactRender } from '../../views/utils';
import db from '../../db/databaseApi';
import { UserSettings } from '../../views/userSettings';
import { validationAssert } from '../utils';
import * as C from '../../constant';
import { sendVerificationEmail } from "./sendVerificationEmail";

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

export async function requestVerifyEmail(req, res) {
    const { user } = res.locals;
    const tryStates = [
        C.USER.EMAIL_STATE.UNVERIFIED_TRY_1,
        C.USER.EMAIL_STATE.UNVERIFIED_TRY_2,
        C.USER.EMAIL_STATE.UNVERIFIED_TRY_3,
    ];
    const tryIndex = tryStates.indexOf(user.email_state);
    validationAssert(tryIndex >= 0 && tryIndex < tryStates.length - 1, `Too many attempts. Please request help from ${C.HELP_EMAIL}`, 400);

    await db.users.setSetting(user.id, C.USER.COLUMNS.email_state, tryStates[tryIndex + 1]);
    await sendVerificationEmail(user);

    res.sendStatus(200).send("Email sent. Check your email.");
}
