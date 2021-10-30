import {sendEmail} from './sendNewsletter';
import fs from 'fs';


const ERROR_FILE = "/var/log/effdem/error.log"
const ERROR_LEVEL = 50;
function getErrors() {
    const msgs = fs.readFileSync(ERROR_FILE).toString().split("\n");
    const errors = msgs.map(s => {
        try { 
            return JSON.parse(s)
        } catch (error) {
            return {level: ERROR_LEVEL};
        }
    }).filter(e => e.level >= ERROR_LEVEL);
    return errors;
}

async function run() {
    const errors = getErrors();
    const to = process.env.MONITOR_EMAIL;
    if (!to) {
        throw "Invalid to address";
    }
    const from = "monitor@efficientdemocracy.com"
    const subject = `Errors: ${errors.length}`;
    const text = 
`Errors:
${errors.filter((e, i) => i < 10).map((e, i) => `${i}. ${e.msg} ${e.err?.message}`).join("\n")}
`

    return sendEmail({
        to,
        from,
        text,
        subject,
    });
}

run();