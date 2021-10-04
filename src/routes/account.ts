import { reactRender } from '../views/utils';
import db from '../db/databaseApi';
import { Login } from '../views/login';
import { Strikes } from '../views/strikes';
import {UserSettings} from '../views/userSettings';
import validator from 'validator';
import assert from 'assert';
import * as C from '../constant';
import DemocraticModerationService from '../services/democraticModerationService';

export function login(req, res) {
    reactRender(res, Login(), {showLogin: false, title:"Login"});
}

export async function logout(req, res) {
    req.logout();
    res.redirect("/")
}

export async function strikes(req, res) {
    const {user} = res.locals;
    const strikes = await DemocraticModerationService.getStrikes(user.id);
    reactRender(res, Strikes({user, strikes}), {title: "Strikes"});
}

export async function userSettings(req, res) {
    const {user, csrfToken} = res.locals;
    reactRender(res, UserSettings({user, csrfToken}), {title: "User settings"});
}

export async function submitUserSettings(req, res) {
    const userId = req.user.id;
    const body = { ...req.body };
    const sendEmails = body.hasOwnProperty("send_emails");
    const firstRunComplete = body.hasOwnProperty("_set_first_run_complete");
    
    await db.users.setSendEmails({userId, sendEmails});

    if (firstRunComplete) {
        await db.users.setFirstRunComplete(userId);
    }
    res.redirect(req.get("Referrer"));
}

export async function unsubscribe(req, res) {
    const { keyId, userId } = req.params;
    assert(validator.isUUID(keyId,4));
    assert(validator.isUUID(userId,4));

    const user = await db.users.getUser(userId);
    assert.strictEqual(user.unsubscribe_key, keyId, "Invalid key");

    await db.users.setSendEmails({userId, sendEmails:false});
    res.send("You have successfully unsubscribed from all emails. To change your settings more go to user settings.");
}