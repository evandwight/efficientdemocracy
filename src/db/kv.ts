import { DatabaseApi} from "./databaseApi";
import { assertOne, selectOneAttr } from "./utils";

export default class Kv {
    db: DatabaseApi;
    constructor(db: DatabaseApi) {
        this.db = db;
    }

    set(key, value) {
        return this.db.pool.query(
            `INSERT INTO kv  
            (key, value) VALUES ($1, $2)
            `, [key, {data: value}]).then(assertOne);
    }

    get(key) {
        return this.db.pool.query(
            `SELECT value FROM kv 
            WHERE key = $1`,
            [key])
            .then(selectOneAttr('value'))
            .then(v => v.data);
    }
}