import dbPool from "../../../db/dbPool";
import { UserId } from '../../../db/types';
import { internalAssertOne, selectOneAttr } from '../../../db/utils';

export default class ModVotes {
    static getVote(userId) {
        return dbPool.query(
            `SELECT vote
            FROM mod_votes  
            WHERE user_id = $1`,
            [userId]).then(selectOneAttr('vote'));
    }

    static upsertVote({ userId, vote }) {
        return dbPool.query(
            `INSERT INTO mod_votes  
            (user_id, vote) VALUES ($1, $2)
            ON CONFLICT (user_id)
            DO UPDATE SET vote = $2`,
            [userId, vote]).then(internalAssertOne);
    }

    static countVotes(): Promise<{vote: UserId, user_name: string, count: number}[]> {
        return dbPool.query(
            `SELECT users.id as vote, users.user_name, COUNT(mv.vote) as count 
            FROM mod_votes as mv
            RIGHT JOIN users ON mv.vote = users.id
            WHERE users.wants_mod = true
            GROUP BY users.id, users.user_name
            ORDER BY count DESC`)
            .then(result => result.rows.map(v => ({... v, count: parseInt(v.count)})));
    }
}