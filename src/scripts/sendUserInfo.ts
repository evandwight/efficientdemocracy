import db from "../db/databaseApi";
import { sendMonitorEmail } from './emailUtils';

async function run() {
    const users = await db.users.getUsers();
    const subject = `User count: ${users.length}`;
    const text = 
`Users:
${users.map(e => `${e.user_name} ${e.send_emails}`).join("\n")}
`
    return sendMonitorEmail({subject, text});
}

db.initialize();
run().then(() => db.end());