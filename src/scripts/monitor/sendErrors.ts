import fs from 'fs';
import { scriptLogger } from '../../logger';
import { sendMonitorEmail } from '../emailUtils';


const ERROR_FILE = "/var/log/effdem/error.log"
const ERROR1_FILE = "/var/log/effdem/error.log.1"
const ERROR_LEVEL = 50;

function readErrorFile(name) {
    try {
        return fs.readFileSync(name).toString().split("\n");
    } catch (err) {
        return [];
    }
}
function getErrors() {
    const msgs = readErrorFile(ERROR_FILE);
    const msgs1 = readErrorFile(ERROR1_FILE);
    const errors = msgs.concat(msgs1).map(s => {
        try {
            if (s === "") {
                return {level: -1};
            } else {
                return JSON.parse(s)
            }
        } catch (error) {
            return {level: ERROR_LEVEL, msg: `Could not parse error log "${s.slice(0, 300)}"`};
        }
    }).filter(e => e.level >= ERROR_LEVEL);
    return errors;
}

async function run() {
    const errors = getErrors();
    const subject = `Errors: ${errors.length}`;
    const text = 
`Errors:
${errors.filter((e, i) => i < 10).map((e, i) => `${i}. ${e.msg} ${e.err?.message}`).join("\n")}
`

    return sendMonitorEmail({text,subject});
}

run()
    .catch(err => scriptLogger.error({err}));