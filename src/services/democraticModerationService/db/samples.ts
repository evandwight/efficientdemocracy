import * as C from '../../../constant';
import db from '../../../db/databaseApi';
import dbPool from "../../../db/dbPool";
import { Sample, ThingId, UserId } from '../../../db/types';
import * as Utils from '../../../db/utils';
import { countToNumber, existsOne, internalAssertOne, selectAttr, selectOne, selectRows } from "../../../db/utils";
import { unexpectedAssert } from '../../../routes/utils';
import ModActions from "./modActions";


export default class Samples {
    static vote({ sampleId, userId, vote, strikeUps, strikeDowns, strikePoster, strikeDisputers }) {
        return dbPool.query(
            `INSERT INTO sample_votes
                (sample_id, user_id, vote, strike_ups, strike_downs, strike_poster, strike_disputers, has_voted, in_sample) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, true, false)
            ON CONFLICT (sample_id, user_id)
            DO UPDATE SET 
                (vote, strike_ups, strike_downs, strike_poster, strike_disputers, has_voted) 
                = ($3, $4, $5, $6, $7, true)
                WHERE sample_votes.has_voted = false`,
            [sampleId, userId, vote, strikeUps, strikeDowns, strikePoster, strikeDisputers]).then(existsOne);
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

    static async getSamplesForUser({ userId, isProxy }): Promise<Sample[]> {
        const samples = await dbPool.query(
            `WITH all_sample_votes as (
                SELECT sample_id, has_voted
                FROM sample_votes
                WHERE 
                    user_id = $1
                UNION
                SELECT sample_id, has_voted
                FROM sample_votes
                    INNER JOIN users ON users.proxy_id = sample_votes.user_id
                WHERE 
                    $2 = true
                    AND users.dm_participate = '${C.USER.DM_PARTICIPATE.proxy}'
                    AND users.proxy_id = $1
            )
            SELECT samples.id, samples.samplee_id, samples.field
            FROM all_sample_votes as sv INNER JOIN samples ON sv.sample_id = samples.id
            WHERE sv.has_voted = false and samples.expires > NOW()
            ORDER BY expires DESC`, [userId, isProxy]).then(selectRows);
        for (const sample of samples) {
            sample.post = await db.qPosts.getPost(sample.samplee_id);
            unexpectedAssert(!!sample.post, "No post found with sample")
        }
        return samples;
    }

    static async createSample({ thingId, userIdsInSample, type, field }) {
        const expiry = Utils.daysFromNow(1);
        return Utils.WithTransaction(db, async (client) => {
            const sampleId = await db.things.create(C.THINGS.SAMPLE, client);
            await client.query(
                `INSERT INTO samples (id, samplee_id, type, expires, field, is_complete)
                VALUES ($1, $2, $3, $4, $5, false)`,
                [sampleId, thingId, type, expiry, field])
                .then(internalAssertOne);
            await Promise.all(userIdsInSample.map(userId =>
                client.query(
                    `INSERT INTO sample_votes (sample_id, user_id, has_voted) VALUES ($1, $2, false)`,
                    [sampleId, userId])
                    .then(internalAssertOne)));
            return sampleId;
        });
    }

    static getThingsWithDisputes({ field, threshold }) {
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
            `WITH in_sample_users as (
                SELECT sv.user_id, sv.sample_id, users.dm_participate, users.proxy_id
                FROM sample_votes as sv
                    INNER JOIN users ON users.id = sv.user_id
                WHERE sv.sample_id = $1 AND sv.in_sample = true
            ),
            all_sample_votes as (
                SELECT isu.user_id, sv.vote, sv.strike_ups, sv.strike_downs, sv.strike_poster, sv.strike_disputers
                FROM in_sample_users as isu
                    INNER JOIN sample_votes as sv ON sv.user_id = isu.user_id and sv.sample_id = isu.sample_id
                WHERE isu.dm_participate = 'direct'
                UNION
                SELECT isu.user_id, sv.vote, sv.strike_ups, sv.strike_downs, sv.strike_poster, sv.strike_disputers
                FROM in_sample_users as isu
                    INNER JOIN users as p_users ON p_users.id = isu.proxy_id
                    INNER JOIN sample_votes as sv ON sv.user_id = isu.proxy_id and sv.sample_id = isu.sample_id
                WHERE isu.dm_participate = 'proxy' AND p_users.wants_proxy = true
            )
            SELECT vote, strike_ups, strike_downs, strike_poster, strike_disputers, COUNT(*) as count 
            FROM all_sample_votes
            GROUP BY vote, strike_ups, strike_downs, strike_poster, strike_disputers`, [sampleId])
            .then(countToNumber);
    }

    static setSampleIsCompleted({ sampleId, result, count }, client?) {
        client = client || dbPool;
        return client.query(
            `UPDATE samples
            SET is_complete = true, result = $2, counts = $3
            WHERE id = $1`,
            [sampleId, JSON.stringify(result), JSON.stringify(count)]).then(internalAssertOne);
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

    static getSamples({ thingId, field }) {
        return dbPool.query(
            `SELECT * FROM samples WHERE samplee_id = $1 and field = $2`,
            [thingId, field]).then(r => r.rows);
    }

    static async completeSample({ sample, result, count }) {
        const { field } = sample;
        const priority = sample.type === C.SAMPLE.TYPE.LEVEL_1 ?
            C.MOD_ACTIONS.PRIORTY.SAMPLE_1 : C.MOD_ACTIONS.PRIORTY.REFERENDUM;
        if (result === null) {
            return Samples.setSampleIsCompleted({ sampleId: sample.id, result, count });
        }
        return Utils.WithTransaction(db, async (client) => {
            return Promise.all([
                Samples.setSampleIsCompleted({ sampleId: sample.id, result, count }, client),
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
                    value: result.vote
                }, client)
            ]);
        });
    }

}