import { reactRender } from '../views/utils';
import db from '../db/databaseApi';
import {FirstRunSetup} from '../views/firstRunSetup';
import * as C from '../constant';

export const USERNAME_REGEX = RegExp('[A-Za-z0-9_]*');

export function firstRunSetup(req, res) {
    const {csrfToken} = res.locals;
    reactRender(res, FirstRunSetup({csrfToken}), {showLogin: false, title:"Account setup"});
}

export async function submitFirstRunSetup(req, res) {
    const userId = req.user.id;
    const body = { ...req.body };
    const sendEmails = body.hasOwnProperty("send_emails");
    
    await db.users.setSendEmails({userId, sendEmails});
    await db.users.setFirstRunComplete(userId);

    res.redirect(C.URLS.QPOSTS);
}