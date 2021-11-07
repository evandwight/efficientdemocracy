import { reactRender } from '../views/utils';
import db from '../db/databaseApi';
import { Login } from '../views/login';
import { Strikes } from '../views/strikes';
import {UserSettings} from '../views/userSettings';
import validator from 'validator';
import DemocraticModerationService from '../services/democraticModerationService';
import { validationAssert, ValidationError } from './utils';
import * as C from '../constant';
import bcrypt from 'bcrypt';
import { LocalLogin } from '../views/localLogin';

export function login(req, res) {
    reactRender(res, Login({csrfToken: res.locals.csrfToken}), {showLogin: false, title:"Login"});
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
    const wantsMod = body.hasOwnProperty("wants_mod");

    if (!res.locals.user.is_email_verified && sendEmails) {
        throw new ValidationError("Your email address must be verified to enable send-emails", 400);
    }
    
    await db.users.setSetting(userId, C.USER.COLUMNS.send_emails, sendEmails);
    await db.users.setSetting(userId, C.USER.COLUMNS.wants_mod, wantsMod);
    await db.users.setSetting(userId, C.USER.COLUMNS.first_run, false);

    res.redirect(req.get("Referrer"));
}

export async function submitFirstRun(req, res) {
    const userId = req.user.id;
    const body = { ...req.body };
    const sendEmails = body.hasOwnProperty("send_emails");

    if (!res.locals.user.is_email_verified && sendEmails) {
        throw new ValidationError("Your email address must be verified to enable send-emails", 400);
    }
    
    await db.users.setSetting(userId, C.USER.COLUMNS.send_emails, sendEmails);
    await db.users.setSetting(userId, C.USER.COLUMNS.first_run, false);

    res.sendStatus(200);
}


export async function unsubscribe(req, res) {
    const { keyId, userId } = req.params;
    // Always send the same error code for invalid requests to avoid leaking information
    const validateRequestAssert = (value) => validationAssert(value, "Invalid request arguments", 400);

    validateRequestAssert(validator.isUUID(keyId,4));
    validateRequestAssert(validator.isUUID(userId,4));

    const user = await db.users.getUser(userId);
    validateRequestAssert(user.unsubscribe_key === keyId);

    await db.users.setSetting(userId, C.USER.COLUMNS.send_emails, false);
    res.send("You have successfully unsubscribed from all emails. To change your settings more go to user settings.");
}

export function viewLocalLogin(req, res) {
    let message = req.flash('error');
    let {csrfToken} = res.locals;
    reactRender(res, LocalLogin({message, csrfToken}), {showLogin: false, title:"Login"});
}

export async function submitUserRegister(req, res) {
    let { email, password } = req.body;

    if (password.length < 6) {
        throw new ValidationError("Password must be at least 6 characters", 400);
    }

    if (!validator.isEmail(email)) {
        throw new ValidationError("Invalid email", 400);
    }

    const user = await  db.users.getUserByEmail(email)
    if (user !== null) {
        // TODO this leaks the registered email addresses
        throw new ValidationError("Email already registered", 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Validation passed
    await db.users.createLocalUserWithRandomName({email, hashedPassword});


    res.redirect(C.URLS.USER_LOCAL_LOGIN)
}