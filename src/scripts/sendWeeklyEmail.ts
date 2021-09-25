import db from "../db/databaseApi";
import { lastWeekday } from "../db/utils";
import { run as freezeDeeplyImportant} from './freezeDeeplyImportant';
import { run as sendNewsletter} from './sendNewsletter';

async function run() {
    const end = lastWeekday(6);
    const start = lastWeekday(6, end);
    const key = await freezeDeeplyImportant(start, end);
    await sendNewsletter(key);
}

if (require.main === module) {
    console.log("Main mode");
    db.initialize();
    run().then(() => db.end());
}