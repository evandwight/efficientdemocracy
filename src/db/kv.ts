import { DatabaseApi} from "./databaseApi";
import { existsOne, selectAttr, selectOneAttr } from "./utils";

export default class Kv {
    db: DatabaseApi;
    constructor(db: DatabaseApi) {
        this.db = db;
    }

    set(key, value) {
        return this.db.pool.query(
            `INSERT INTO kv  
            (key, value) VALUES ($1, $2)
            `, [key, {data: value}]).then(existsOne);
    }

    get(key) {
        return this.db.pool.query(
            `SELECT value FROM kv 
            WHERE key = $1`,
            [key])
            .then(selectOneAttr('value'))
            .then(v => v.data);
    }

    selectPrefix(prefix) {
        return this.db.pool.query(
            `SELECT key FROM kv 
            WHERE key LIKE $1
            ORDER BY key DESC`,
            [`${prefix}%`])
            .then(selectAttr('key'));
    }
}