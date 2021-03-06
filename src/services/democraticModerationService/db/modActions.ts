import { ThingId } from '../../../db/types';
import { assertOne, selectOne, selectRows, daysFromNow, internalAssertOne } from "../../../db/utils";
import * as C from '../../../constant';
import dbPool from "../../../db/dbPool";
import db from '../../../db/databaseApi';
import Strikes from './strikes';

export default class ModActions {
    static getModAction({thingId, field})  {
        return dbPool.query(
            `SELECT * FROM mod_actions WHERE thing_id = $1 and field = $2`,
            [thingId, field]).then(selectOne);
    }

    static getModActions(thingId: ThingId)  {
        return dbPool.query(
            `SELECT * FROM mod_actions WHERE thing_id = $1`,
            [thingId]).then(selectRows);
    }

    static getModActionsForThingIds(thingIds: ThingId[]) {
        return dbPool.query(
            `SELECT *
            FROM mod_actions 
            WHERE thing_id = ANY ($1)`, 
            [thingIds]).then(selectRows);
    }

    static deleteModAction({thingId, field, priority})  {
        return dbPool.query(
            `DELETE FROM mod_actions WHERE thing_id = $1 and field = $3 and priority <= $2`,
            [thingId, priority, field]).then(internalAssertOne);
    }

    static async upsertModAction({thingId, field, creatorId, strikeUps, strikeDowns, strikePoster, strikeDisputers, priority, banLength, value }, client?) {
        // creatorId should be nullable as mini mods don't need one, nor do automods
        if (!client) {
            client = dbPool;
        }
        const id = await db.things.create(C.THINGS.MOD_ACTION, client);
        const expiry = daysFromNow(banLength);

        // TODO don't error when upsert fails, just don't apply strikes
        await client.query(
            `INSERT INTO mod_actions  
                (id, thing_id, creator_id, expiry, priority, value, field) 
                VALUES 
                ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (thing_id, field)
            DO UPDATE SET 
                (id, thing_id, creator_id, expiry, priority, value, field) 
                =
                ($1, $2, $3, $4, $5, $6, $7)
            WHERE mod_actions.priority <= $5`,
            [id, thingId, creatorId, expiry, priority, value, field]).then(assertOne);

        if (strikeUps || strikeDowns) {
            await Strikes.createStrikesForVoters(client, {strikeUps, strikeDowns, thingId, modActionId:id});
        }
        if (strikePoster) {
            await Strikes.createStrikesForPoster(client, {thingId, modActionId:id});
        }
        if (strikeDisputers) {
            await Strikes.createStrikesForDisputers(client, {thingId, modActionId:id, field, value});
        }

        return id;
    }
    
    static getStrikes(userId) {
        return dbPool.query(
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