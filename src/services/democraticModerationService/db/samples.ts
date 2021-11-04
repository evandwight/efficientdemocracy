import dbPool from "../../../db/dbPool";
import { UserId, Sample, ThingId} from '../../../db/types';
import { selectOne, selectOneAttr, existsOne, assertOne, selectAttr, selectRows, countToNumber } from "../../../db/utils";
import * as C from '../../../constant';
import * as Utils from '../../../db/utils';
import db from '../../../db/databaseApi';
import ModActions from "./modActions";


export default class Samples {
    static vote({sampleId, userId, vote, strikeUps, strikeDowns, strikePoster, strikeDisputers}) {
        return dbPool.query(
            `UPDATE sample_votes  
            SET (vote, strike_ups, strike_downs, strike_poster, strike_disputers, has_voted) 
            = ($3, $4, $5, $6, $7, true)
            WHERE sample_id = $1 and user_id = $2 and has_voted = false`,
            [sampleId, userId, vote, strikeUps, strikeDowns, strikePoster, strikeDisputers]).then(assertOne);
    }

    static canUserVote({sampleId, userId}) {
        return dbPool.query(`
            SELECT sample_id
            FROM sample_votes
            WHERE sample_id = $1 and user_id = $2 and has_voted = false`, 
            [sampleId, userId]).then(existsOne);
    }

    static async getOldestSample(userId: UserId): Promise<Sample> {
        const sample = await dbPool.query(`
            SELECT id, samplee_id, field
            FROM sample_votes as sv INNER JOIN samples ON sv.sample_id = samples.id
            WHERE user_id = $1 and has_voted = false and expires > NOW()
            ORDER BY expires DESC
            LIMIT 1`, [userId]).then(selectOne);
        if (sample) {
            sample.post = await db.qPosts.getPost(sample.samplee_id).then(r => {
                if (r === null) {
                    throw new Error("Cannot find post for sample");
                } else {
                    return r;
                }
            });
        }
        return sample;
    }

    static async createSample({thingId, userIds, type, field, sampleSize}) {
        // select users
        let usersInSample;
        if (!!sampleSize) {
            usersInSample = Utils.generateUniqueRandom(userIds.length - 1, sampleSize).map(v => userIds[v]);
        } else {
            usersInSample = userIds;
        }
        const expiry = Utils.daysFromNow(1);
        // create samples and sample votes
        let id = await db.things.create(C.THINGS.SAMPLE);
        return Utils.WithTransaction(db, async (client) => {
            const sampleId = await client.query(
                `INSERT INTO samples (id, samplee_id, type, expires, field, is_complete)
                VALUES ($1, $2, $3, $4, $5, false)
                RETURNING id`,
                [id, thingId, type, expiry, field])
                .then(selectOneAttr('id'));
            await Promise.all(usersInSample.map(userId => client.query(
                `INSERT INTO sample_votes (sample_id, user_id, has_voted) VALUES ($1, $2, false)`, [sampleId, userId])));
            return sampleId;
        });
    }

    static getThingsWithDisputes({field, threshold}) {
        return dbPool.query(`
            SELECT d.thing_id as thing_id
            FROM disputes as d
            LEFT JOIN mod_actions as ma ON d.thing_id = ma.thing_id and d.field = ma.field
            WHERE d.field = $2
                and (ma.value <> d.should_be
                    or (ma.value is null and d.should_be = true))
            GROUP BY d.thing_id
            HAVING count(d.thing_id) >= $1`, [threshold, field]).then(selectAttr('thing_id'));
    }

    static getExpiredSamples() {
        return dbPool.query(
            `SELECT * from samples
            WHERE is_complete = false and expires < NOW()`).then(selectRows);
    }

    static countVotes(sampleId) {
        return dbPool.query(
            `SELECT vote, strike_ups, strike_downs, strike_poster, strike_disputers, COUNT(*) as count 
            FROM sample_votes INNER JOIN samples ON sample_id = id
            WHERE sample_id = $1
            GROUP BY vote, strike_ups, strike_downs, strike_poster, strike_disputers`, [sampleId])
            .then(countToNumber);
    }

    static setSampleIsCompleted({sampleId, result, count}, client?) {
        client  = client || dbPool;
        return client.query(
            `UPDATE samples
            SET is_complete = true, result = $2, counts = $3
            WHERE id = $1`,
            [sampleId, JSON.stringify(result), JSON.stringify(count)]).then(assertOne);
    }

    static getSampleResult(sampleId) {
        return dbPool.query(
            `SELECT * FROM samples WHERE id = $1`, [sampleId]).then(selectOne);
    }

    static getCompletedSamples(thingId: ThingId) {
        return dbPool.query(
            `SELECT * 
            FROM samples 
            WHERE samplee_id = $1 and is_complete
            ORDER BY type ASC, field ASC`, [thingId])
            .then(selectRows);
    }

    static getSamples({thingId, field}) {
        return dbPool.query(
            `SELECT * FROM samples WHERE samplee_id = $1 and field = $2`,
            [thingId, field]).then(r => r.rows);
    }

    static async completeSample({sample, result, count}) {
        const {field} = sample;
        const modAction = await ModActions.getModAction({thingId: sample.samplee_id, field});
        const version = modAction ? modAction.version : undefined;
        const priority = sample.type === C.SAMPLE.TYPE.LEVEL_1 ? 
            C.MOD_ACTIONS.PRIORTY.SAMPLE_1 : C.MOD_ACTIONS.PRIORTY.REFERENDUM;
        if (result === null) {
            return Samples.setSampleIsCompleted({sampleId:sample.id, result, count});
        }
        return Utils.WithTransaction(db, async (client) => {
            return Promise.all([
                Samples.setSampleIsCompleted({sampleId:sample.id, result, count}, client),
                ModActions.upsertModAction({
                    thingId: sample.samplee_id,
                    field,
                    creatorId: sample.id,
                    strikeUps: result.strike_ups,
                    strikeDowns: result.strike_downs,
                    strikePoster: result.strike_poster,
                    strikeDisputers: result.strike_disputers,
                    priority,
                    banLength: C.BAN_LENGTH,
                    version,
                    value: result.vote}, client)
                ]);
            });
    }

}