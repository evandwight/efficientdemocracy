import { fromIni } from "@aws-sdk/credential-providers";
import db from "../db/databaseApi";
import * as C from "../constant";
import { selectAttr } from "../db/utils";


async function run(start, end, key) {
    const posts = await getPosts(start, end);
    return db.kv.set(key, posts);   
}

async function getPosts(start, end) {
    return db.pool.query(
        `SELECT qposts.id as id
        FROM qposts 
            INNER JOIN mod_actions ON qposts.id = mod_actions.thing_id
        WHERE mod_actions.field = '${C.FIELDS.LABELS.DEEPLY_IMPORTANT}' and mod_actions.value
            and (created BETWEEN $1 AND $2)
        ORDER BY created DESC`,[start, end]).then(selectAttr("id"));
}

function dateToStr(date) {
    return date.toLocaleString(undefined, {year: 'numeric', month: '2-digit', day: '2-digit'});
}

if (require.main === module) {
    console.log("Main mode");
    const start = new Date(process.argv[2]);
    const end = new Date(process.argv[3]);
    const key = `deeply-important-${dateToStr(start)}-to-${dateToStr(end)}`;
    console.log(`Saving posts to ${key}`);
    db.initialize();
    run(start, end, key).then(() => db.end());
}