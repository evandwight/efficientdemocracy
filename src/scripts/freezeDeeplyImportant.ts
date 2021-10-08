import db from "../db/databaseApi";
import * as C from "../constant";
import { selectAttr } from "../db/utils";
import { assert } from "console";


export async function run(start, end) {
    const key = `deeply-important-${dateToStr(start)}-to-${dateToStr(end)}`;
    console.log(`Saving posts to ${key}`);
    const posts = await getPosts(start, end);
    const success = await db.kv.set(key, posts);   
    assert(success, "Failed to set kv");
    
    return key;
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
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

if (require.main === module) {
    console.log("Main mode");
    const start = new Date(process.argv[2]);
    const end = new Date(process.argv[3]);


    db.initialize();
    run(start, end).then(() => db.end());
}