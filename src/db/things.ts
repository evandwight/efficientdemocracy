import { selectOne, selectOneAttr } from '../db/utils';
import { DatabaseApi } from "./databaseApi";
import { ThingId, ThingType } from './types';

export default class Things {
    db: DatabaseApi;
    constructor(db: DatabaseApi) {
        this.db = db;
    }

    create(type: ThingType, client?): Promise<ThingId> {
        if (!client) {
            client = this.db.pool;
        }

        return client.query(
            `INSERT INTO things (id, type)
            VALUES ($1, $2)
            RETURNING id`,
            [this.db.uuidv4(), type])
            .then(selectOneAttr('id'));
    }

    getType(id: ThingId): Promise<ThingType> {
        return this.db.pool.query(
            `SELECT type FROM things WHERE id = $1`, [id])
            .then(selectOneAttr('type'));
    }

    get(id: ThingId): Promise<any> {
        return this.db.pool.query(
            `SELECT * FROM things WHERE id = $1`, [id])
            .then(selectOne);
    }
}