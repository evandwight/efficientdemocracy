import dbPool from "../../../db/dbPool";
import { UserId } from '../../../db/types';
import { countToNumber, internalAssertOne, selectOneAttr } from '../../../db/utils';
import * as C from '../../../constant';

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
            `WITH all_mod_votes as (
                SELECT mod_votes.user_id as user_id, mod_votes.vote as vote
                FROM mod_votes
                    INNER JOIN users ON mod_votes.user_id = users.id
                WHERE users.dm_participate = '${C.USER.DM_PARICIPATE.direct}'
                UNION
                SELECT users.id as user_id, mod_votes.vote as vote
                FROM mod_votes
                    INNER JOIN users ON users.proxy_id = mod_votes.user_id
                    INNER JOIN users as p_users ON p_users.id = users.proxy_id
                WHERE users.dm_participate = '${C.USER.DM_PARICIPATE.proxy}'
                    AND p_users.wants_proxy = true
            )
            SELECT users.id as vote, users.user_name, COUNT(mv.vote) as count 
            FROM all_mod_votes as mv
                RIGHT JOIN users ON mv.vote = users.id
            WHERE users.wants_mod = true
            GROUP BY users.id, users.user_name
            ORDER BY count DESC`)
            .then(countToNumber);
    }
}