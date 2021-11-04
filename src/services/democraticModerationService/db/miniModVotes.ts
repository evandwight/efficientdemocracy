import dbPool from "../../../db/dbPool";
import { countToNumber, internalAssertOne, selectRows } from '../../../db/utils';

export default class MiniModVotes {
    static getVotes({ userId, thingId }) {
        return dbPool.query(
            `SELECT *
            FROM mini_mod_votes  
            WHERE user_id = $1 and thing_id = $2`,
            [userId, thingId]).then(selectRows);
    }

    static vote({ thingId, field, userId, vote, strikeUps, strikeDowns, strikePoster }) {
        return dbPool.query(
            `INSERT INTO mini_mod_votes  
            (user_id, thing_id, field, vote, strike_ups, strike_downs, strike_poster) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (user_id, thing_id, field)
            DO UPDATE SET (vote, strike_ups, strike_downs, strike_poster) 
            = ($4, $5, $6, $7)`,
            [userId, thingId, field, vote, strikeUps, strikeDowns, strikePoster]).then(internalAssertOne);
    }

    static countVotes({ thingId, field }) {
        return dbPool.query(
            `SELECT mmv.vote, mmv.strike_ups, mmv.strike_downs, mmv.strike_poster, COUNT(*) as count
            FROM mini_mod_votes as mmv
            INNER JOIN users ON users.id = mmv.user_id
            WHERE thing_id = $1 and field = $2
                and users.is_mini_mod = true
            GROUP BY mmv.vote, mmv.strike_ups, mmv.strike_downs, mmv.strike_poster
            `, [thingId, field]).then(countToNumber);
    }
}