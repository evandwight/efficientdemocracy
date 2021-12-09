import * as C from '../../../constant';
import db from '../../../db/databaseApi';
import dbPool from "../../../db/dbPool";
import { Sample, ThingId, UserId } from '../../../db/types';
import * as Utils from '../../../db/utils';
import { countToNumber, existsOne, internalAssertOne, selectAttr, selectOne, selectRows } from "../../../db/utils";
import { unexpectedAssert, UnexpectedInternalError } from '../../../routes/utils';
import { DmUser } from '../types';
import ModActions from "./modActions";


export default class Samples {
    static vote({ sampleId, userId, vote, strikeUps, strikeDowns, strikePoster, strikeDisputers }) {
        return dbPool.query(
            `INSERT INTO sample_votes
                (sample_id, user_id, vote, strike_ups, strike_downs, strike_poster, strike_disputers) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (sample_id, user_id)
            DO NOTHING`,
            [sampleId, userId, vote, strikeUps, strikeDowns, strikePoster, strikeDisputers]).then(existsOne);
    }

    static canVote({ sampleId, userId }) {
        return dbPool.query(
            `SELECT *
            FROM in_sample
            WHERE sample_id = $1 AND 
                ((user_id = $2 AND proxy_id IS NULL) OR proxy_id = $2)
            LIMIT 1`, [sampleId, userId]).then(existsOne);
    }

    static async getOldestSample(userId: UserId): Promise<Sample> {
        const sample = await dbPool.query(`
            SELECT id, samplee_id, field
            FROM in_sample as isu
                LEFT JOIN sample_votes as sv ON isu.user_id = sv.user_id AND isu.sample_id = sv.sample_id  
                INNER JOIN samples ON isu.sample_id = samples.id
            WHERE isu.user_id = $1 and sv.user_id IS NULL and samples.expires > NOW()
            ORDER BY expires DESC
            LIMIT 1`, [userId]).then(selectOne);
        if (sample) {
            sample.post = await db.qPosts.getPost(sample.samplee_id).then(r => {
                if (r === null) {
                    throw new UnexpectedInternalError("Cannot find post for sample");
                } else {
                    return r;
                }
            });
        }
        return sample;
    }

    static async getSamplesForUser({ userId, isProxy }): Promise<Sample[]> {
        const samples = await dbPool.query(
            `SELECT samples.id, samples.samplee_id, samples.field
            FROM in_sample as isu
                LEFT JOIN sample_votes as sv ON isu.user_id = sv.user_id AND isu.sample_id = sv.sample_id
                INNER JOIN samples ON isu.sample_id = samples.id
            WHERE sv.user_id IS NULL
                AND (isu.user_id = $1 OR ($2 = true AND isu.proxy_id = $1))
                AND samples.expires > NOW()
            ORDER BY samples.expires DESC`, [userId, isProxy]).then(selectRows);
        for (const sample of samples) {
            sample.post = await db.qPosts.getPost(sample.samplee_id);
            unexpectedAssert(!!sample.post, "No post found with sample")
        }
        return samples;
    }

    static async createSamplesEntry({ sampleId, thingId, type, expiry, field, client }) {
        return client.query(
            `INSERT INTO samples (id, samplee_id, type, expires, field, is_complete)
            VALUES ($1, $2, $3, $4, $5, false)`,
            [sampleId, thingId, type, expiry, field])
            .then(internalAssertOne);
    }

    static async createInSample({ userId, sampleId, proxyId, client }) {
        return client.query(
            `INSERT INTO in_sample (sample_id, user_id, proxy_id) 
            VALUES ($1, $2, $3)`,
            [sampleId, userId, proxyId])
            .then(internalAssertOne);
    }

    static async createSample({ thingId, dmUsersInSample, type, field }:
        { thingId: ThingId, dmUsersInSample: DmUser[], type: number, field: string }) {
        const expiry = Utils.daysFromNow(1);
        return Utils.WithTransaction(db, async (client) => {
            const sampleId = await db.things.create(C.THINGS.SAMPLE, client);
            await Samples.createSamplesEntry({ sampleId, thingId, type, expiry, field, client });
            await Promise.all(dmUsersInSample.map(e => 
                Samples.createInSample({ userId: e.userId, sampleId, proxyId: e.proxyId, client })));
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
            `WITH all_sample_votes as (
                SELECT isu.user_id, sv.vote, sv.strike_ups, sv.strike_downs, sv.strike_poster, sv.strike_disputers
                FROM in_sample as isu
                    INNER JOIN sample_votes as sv ON sv.user_id = isu.user_id and sv.sample_id = isu.sample_id
                WHERE isu.proxy_id IS NULL AND isu.sample_id = $1
                UNION
                SELECT isu.user_id, sv.vote, sv.strike_ups, sv.strike_downs, sv.strike_poster, sv.strike_disputers
                FROM in_sample as isu
                    INNER JOIN sample_votes as sv ON sv.user_id = isu.proxy_id and sv.sample_id = isu.sample_id
                WHERE isu.proxy_id IS NOT NULL AND isu.sample_id = $1
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