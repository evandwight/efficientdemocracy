import { DatabaseApi } from "./databaseApi";
import { UserId, Sample} from './types';
import { selectOne, selectOneAttr, existsOne, assertOne, selectAttr } from "./utils";
import * as C from '../constant';
import * as Utils from './utils';


export default class Samples {
    db: DatabaseApi;
    constructor(db: DatabaseApi) {
        this.db = db;
    }

    vote({sampleId, userId, vote, strikeUps, strikeDowns, strikePoster, strikeDisputers}) {
        return this.db.pool.query(
            `UPDATE sample_votes  
            SET (vote, strike_ups, strike_downs, strike_poster, strike_disputers, has_voted) 
            = ($3, $4, $5, $6, $7, true)
            WHERE sample_id = $1 and user_id = $2 and has_voted = false`,
            [sampleId, userId, vote, strikeUps, strikeDowns, strikePoster, strikeDisputers]).then(assertOne);
    }

    canUserVote({sampleId, userId}) {
        return this.db.pool.query(`
            SELECT sample_id
            FROM sample_votes
            WHERE sample_id = $1 and user_id = $2 and has_voted = false`, 
            [sampleId, userId]).then(existsOne);
    }

    async getOldestSample(userId: UserId): Promise<Sample> {
        const sample = await this.db.pool.query(`
            SELECT id, samplee_id, field
            FROM sample_votes as sv INNER JOIN samples ON sv.sample_id = samples.id
            WHERE user_id = $1 and has_voted = false and expires > NOW()
            ORDER BY expires DESC
            LIMIT 1`, [userId]).then(selectOne);
        if (sample) {
            sample.post = await this.db.qPosts.getPost(sample.samplee_id).then(r => {
                if (r === null) {
                    throw new Error("Cannot find post for sample");
                } else {
                    return r;
                }
            });
        }
        return sample;
    }

    async createSample({thingId, userIds, type, field, sampleSize}) {
        // select users
        let usersInSample;
        if (!!sampleSize) {
            usersInSample = Utils.generateUniqueRandom(userIds.length - 1, sampleSize).map(v => userIds[v]);
        } else {
            usersInSample = userIds;
        }
        const expiry = Utils.daysFromNow(1);
        // create samples and sample votes
        let id = await this.db.things.create(C.THINGS.SAMPLE);
        return Utils.WithTransaction(this.db, async (client) => {
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

    getThingsWithDisputes({field, threshold}) {
        return this.db.pool.query(`
            SELECT d.thing_id as thing_id
            FROM disputes as d
            LEFT JOIN mod_actions as ma ON d.thing_id = ma.thing_id and d.field = ma.field
            WHERE d.field = $2
                and (ma.value <> d.should_be
                    or (ma.value is null and d.should_be = true))
            GROUP BY d.thing_id
            HAVING count(d.thing_id) >= $1`, [threshold, field]).then(selectAttr('thing_id'));
    }

    getExpiredSamples() {
        return this.db.pool.query(
            `SELECT * from samples
            WHERE is_complete = false and expires < NOW()`).then(result => result.rows);
    }

    countVotes(sampleId) {
        return this.db.pool.query(
            `SELECT vote, strike_ups, strike_downs, strike_poster, strike_disputers, COUNT(*) as count 
            FROM sample_votes INNER JOIN samples ON sample_id = id
            WHERE sample_id = $1
            GROUP BY vote, strike_ups, strike_downs, strike_poster, strike_disputers`, [sampleId])
            .then(result => result.rows.map(v => ({... v, count: parseInt(v.count)})));
    }

    setSampleIsCompleted({sampleId, result, count}, client?) {
        client  = client || this.db.pool;
        return client.query(
            `UPDATE samples
            SET is_complete = true, result = $2, counts = $3
            WHERE id = $1`,
            [sampleId, JSON.stringify(result), JSON.stringify(count)]).then(assertOne);
    }

    getSampleResult(sampleId) {
        return this.db.pool.query(
            `SELECT * FROM samples WHERE id = $1`, [sampleId]).then(selectOne);
    }

    getCompletedSamples({thingId, field}) {
        return this.getSamples({thingId, field}).then(r => r.filter(sample => sample.is_complete));
    }

    getSamples({thingId, field}) {
        return this.db.pool.query(
            `SELECT * FROM samples WHERE samplee_id = $1 and field = $2`,
            [thingId, field]).then(r => r.rows);
    }

    async completeSample({sample, result, count}) {
        const {field} = sample;
        const modAction = await this.db.modActions.getModAction({thingId: sample.samplee_id, field});
        const version = modAction ? modAction.version : undefined;
        const priority = sample.type === C.SAMPLE.TYPE.LEVEL_1 ? 
            C.MOD_ACTIONS.PRIORTY.SAMPLE_1 : C.MOD_ACTIONS.PRIORTY.REFERENDUM;
        if (result === null) {
            return this.setSampleIsCompleted({sampleId:sample.id, result, count});
        }
        return Utils.WithTransaction(this.db, async (client) => {
            return Promise.all([
                this.setSampleIsCompleted({sampleId:sample.id, result, count}, client),
                this.db.modActions.upsertModAction({
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