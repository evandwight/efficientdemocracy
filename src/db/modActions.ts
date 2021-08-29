import { DatabaseApi } from "./databaseApi";
import { ThingId } from './types';
import { assertOne, selectOne, selectRows, daysFromNow } from "./utils";
import * as C from '../constant';

export default class ModActions {
    db: DatabaseApi;
    constructor(db: DatabaseApi) {
        this.db = db;
    }

    getModAction({thingId, field})  {
        return this.db.pool.query(
            `SELECT * FROM mod_actions WHERE thing_id = $1 and field = $2`,
            [thingId, field]).then(selectOne);
    }

    getModActions(thingId)  {
        return this.db.pool.query(
            `SELECT * FROM mod_actions WHERE thing_id = $1`,
            [thingId]).then(selectRows);
    }

    getModActionsForThingIds(thingIds: ThingId[]) {
        return this.db.pool.query(
            `SELECT *
            FROM mod_actions 
            WHERE thing_id = ANY ($1)`, 
            [thingIds]).then(selectRows);
    }

    deleteModAction({thingId, field, version, priority})  {
        return this.db.pool.query(
            `DELETE FROM mod_actions WHERE thing_id = $1 and field = $4 and version = $2 and priority <= $3`,
            [thingId, version, priority, field]).then(assertOne);
    }

    async upsertModAction({thingId, field, creatorId, strikeUps, strikeDowns, strikePoster, strikeDisputers, priority, banLength, version, value }, client?) {
        if (!client) {
            client = this.db.pool;
        }
        const id = await this.db.things.create(C.THINGS.MOD_ACTION, client);
        const expiry = daysFromNow(banLength);
        version = version || 0;

        // TODO don't error when upsert fails, just don't apply strikes
        await client.query(
            `INSERT INTO mod_actions  
                (id, thing_id, creator_id, expiry, priority, value, version, field) 
                VALUES 
                ($1, $2, $3, $4, $5, $6, $7 + 1, $8)
            ON CONFLICT (thing_id, field)
            DO UPDATE SET 
                (id, thing_id, creator_id, expiry, priority, value, version, field) 
                =
                ($1, $2, $3, $4, $5, $6, $7 + 1, $8)
            WHERE mod_actions.version = $7 and mod_actions.priority <= $5`,
            [id, thingId, creatorId, expiry, priority, value, version, field]).then(assertOne);

        if (strikeUps || strikeDowns) {
            await this.db.strikes.createStrikesForVoters(client, {strikeUps, strikeDowns, thingId, modActionId:id});
        }
        if (strikePoster) {
            await this.db.strikes.createStrikesForPoster(client, {thingId, modActionId:id});
        }
        if (strikeDisputers) {
            await this.db.strikes.createStrikesForDisputers(client, {thingId, modActionId:id, field, value});
        }

        return id;
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