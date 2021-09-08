import db from '../db/databaseApi';
import * as C from '../constant';

export async function submitFirstRunSetup(req, res) {
    const userId = req.user.id;
    const body = { ...req.body };
    const sendEmails = body.hasOwnProperty("send_emails");
    
    await db.users.setSendEmails({userId, sendEmails});
    await db.users.setFirstRunComplete(userId);

    res.redirect(C.URLS.QPOSTS);
}