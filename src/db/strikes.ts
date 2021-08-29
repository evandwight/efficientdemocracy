import { DatabaseApi } from "./databaseApi";
import * as C from '../constant';

export default class Strikes {
    db: DatabaseApi;
    constructor(db: DatabaseApi) {
        this.db = db;
    }

    updateStrikes() {
        return this.db.pool.query(`
            WITH count_strikes AS (
                SELECT s.user_id as user_id, count(mod_actions.id) as strike_count, (count(mod_actions.id) > 2) as is_banned
                FROM strikes as s LEFT JOIN mod_actions ON s.mod_action_id = mod_actions.id
                GROUP BY s.user_id
            )
            UPDATE users
            SET is_banned = cs.is_banned, strike_count =  cs.strike_count
            FROM count_strikes as cs
            WHERE users.id = cs.user_id and (users.is_banned <> cs.is_banned or users.strike_count <> cs.strike_count)
            `)
    }

    createStrikesForVoters(client, {strikeUps, strikeDowns, modActionId, thingId}) {
        return client.query(
            `INSERT INTO strikes (mod_action_id, user_id)
            SELECT $1, user_id 
            FROM votes 
            WHERE thing_id = $2 and 
                (${!!strikeUps} = true and vote = ${C.VOTE.UP})
                or (${!!strikeDowns} = true and vote = ${C.VOTE.DOWN})
            ON CONFLICT DO NOTHING`,
            [modActionId, thingId]);
    }

    createStrikesForPoster(client, {modActionId, thingId}) {
        return client.query(
            `INSERT INTO strikes (mod_action_id, user_id)
            SELECT $1, user_id
            FROM qposts
            WHERE id = $2
            ON CONFLICT DO NOTHING`,
            [modActionId, thingId]);
    }

    createStrikesForDisputers(client, {modActionId, thingId, value, field}) {
        return client.query(
            `INSERT INTO strikes (mod_action_id, user_id)
            SELECT $1, user_id 
            FROM disputes
            WHERE thing_id = $2 and should_be <> $3 and field = $4
            ON CONFLICT DO NOTHING`,
            [modActionId, thingId, value, field]);
    }

    getStrikes(userId) {
        return this.db.pool.query(
            `SELECT mod_actions.thing_id, mod_actions.creator_id,  mod_actions.field,
                things.type as thing_type, users.user_name
            FROM mod_actions 
            INNER JOIN strikes ON mod_actions.id = strikes.mod_action_id
            INNER JOIN things ON mod_actions.creator_id = things.id
            LEFT JOIN users ON mod_actions.creator_id = users.id
            WHERE strikes.user_id = $1`
            , [userId]).then(r => r.rows);
    }
}