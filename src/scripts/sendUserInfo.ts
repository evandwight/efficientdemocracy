import {sendEmail} from './sendNewsletter';
import db from "../db/databaseApi";

async function run() {
    const users = await db.users.getUsers();
    const to = process.env.MONITOR_EMAIL;
    if (!to) {
        throw "Invalid to address";
    }
    const from = "monitor@efficientdemocracy.com"
    const subject = `User count: ${users.length}`;
    const text = 
`Users:
${users.map(e => e.email).join("\n")}
`

    sendEmail({
        to,
        from,
        text,
        subject,
    });
}

run().then(()=> console.log("success"));