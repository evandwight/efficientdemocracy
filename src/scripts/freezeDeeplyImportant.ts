import db from "../db/databaseApi";
import * as C from "../constant";
import { selectAttr } from "../db/utils";
import { assert } from "console";


export async function run(start, end) {
    const key = `deeply-important-${dateToSortableStr(start)}-to-${dateToSortableStr(end)}`;
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

export function dateToSortableStr(date) {
    const monthStr = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${monthStr}-${dayStr}`;
}

if (require.main === module) {
    console.log("Main mode");
    const start = new Date(process.argv[2]);
    const end = new Date(process.argv[3]);


    db.initialize();
    run(start, end).then(() => db.end());
}