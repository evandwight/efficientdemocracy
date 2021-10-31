import * as C from '../../../constant';
import dbPool from "../../../db/dbPool";
import { ThingId } from '../../../db/types';
import { internalAssertOne } from '../../../db/utils';

export default class ModVotes {
    static upsertVote({ userId, vote }) {
        return dbPool.query(
            `INSERT INTO mod_votes  
            (user_id, vote) VALUES ($1, $2)
            ON CONFLICT (user_id)
            DO UPDATE SET vote = $2`,
            [userId, vote]).then(internalAssertOne);
    }

    static countVotes(): Promise<{vote: ThingId, count: number}[]> {
        return dbPool.query(
            `SELECT mv.vote, COUNT(*) as count 
            FROM mod_votes as mv
            INNER JOIN users ON mv.vote = users.id
            WHERE mv.vote is not null and wants_mod = true
            GROUP BY mv.vote`)
            .then(result => result.rows.map(v => ({... v, count: parseInt(v.count)})));
    }
}