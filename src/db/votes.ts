import { DatabaseApi} from "./databaseApi";
import { existsOne, internalAssertOne, selectOneAttr } from "./utils";
import { Vote } from './types';

export default class Votes {
    db: DatabaseApi;
    constructor(db: DatabaseApi) {
        this.db = db;
    }

    getVotes({thingIds, userId}) : Promise<[Vote]> {
        return this.db.pool.query(
            `SELECT thing_id, vote
            FROM votes 
            WHERE user_id = $2 AND votes.thing_id = ANY ($1)
            `, [thingIds, userId]).then(result => result.rows) as Promise<[Vote]>;
    }

    getVote({ thingId, userId }) {
        return this.db.pool.query(
            `SELECT vote FROM votes 
            WHERE thing_id = $1 and user_id = $2`,
            [thingId, userId])
            .then(selectOneAttr('vote'));
    }

    insertVote({ thingId, userId, vote }) {
        return this.db.pool.query(
            `INSERT INTO votes  
            (thing_id, user_id, vote) VALUES ($1, $2, $3)`,
            [thingId, userId, vote]).then(internalAssertOne);
    }

    upsertVote({ thingId, userId, vote }) {
        return this.db.pool.query(
            `INSERT INTO votes  
            (thing_id, user_id, vote) VALUES ($1, $2, $3)
            ON CONFLICT (thing_id, user_id)
            DO UPDATE SET vote = $3`,
            [thingId, userId, vote]).then(internalAssertOne);
    }

    submitDispute({thingId, userId, field, shouldBe}) {
        return this.db.pool.query(
            `INSERT INTO disputes  
            (thing_id, user_id, field, should_be) VALUES ($1, $2, $3, $4)
            ON CONFLICT (thing_id, user_id, field)
            DO NOTHING`,
            [thingId, userId, field, shouldBe]).then(existsOne);
    }

}