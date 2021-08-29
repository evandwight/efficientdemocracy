import { DatabaseApi } from "./databaseApi";
import {QPost, QPostId, UserId} from "./types";
import { assertOne, selectOne, selectOneAttr } from "./utils";
import * as C from '../constant';

export default class QPosts {
    db: DatabaseApi;
    constructor(db: DatabaseApi) {
        this.db = db;
    }

    getPost(postId): Promise<QPost> {
        return this.db.pool.query(
            `SELECT qposts.id as id, created, title, url, content, qposts.user_id as user_id,
                user_name
            FROM qposts 
                INNER JOIN users ON qposts.user_id = users.id
            WHERE qposts.id = $1`, [postId])
            .then(selectOne) as Promise<QPost>;
    }

    getPostIdByHackerId(hackerId) {
        return this.db.pool.query(
            `SELECT id
            FROM qposts 
            WHERE hackernews_id = $1`, [hackerId])
            .then(selectOneAttr('id'));
    }

    getHackerNewsPosts(offset=0): Promise<QPost[]> {
        return this.db.pool.query(
            `SELECT qposts.id as id, created, title, url, content, qposts.user_id as user_id,
                user_name,
                ((extract(epoch from created) - 1134028003)/45000 + log(GREATEST(abs(hackernews_points)*2, 1))*sign(hackernews_points)) as hot
            FROM qposts 
                INNER JOIN users ON qposts.user_id = users.id
            WHERE qposts.hackernews_points is not null
            ORDER BY hot DESC
            LIMIT 30
            OFFSET $1`, [offset])
            .then(result => result.rows) as Promise<QPost[]>;
    }

    getNewPosts(offset=0): Promise<QPost[]> {
        return this.db.pool.query(
            `SELECT qposts.id as id, created, title, url, content, qposts.user_id as user_id,
                user_name
            FROM qposts 
                INNER JOIN users ON qposts.user_id = users.id
            ORDER BY created DESC
            LIMIT 30
            OFFSET $1`, [offset])
            .then(result => result.rows) as Promise<QPost[]>;
    }

    getDeeplyImportantPosts(offset=0): Promise<QPost[]> {
        return this.db.pool.query(
            `SELECT qposts.id as id, created, title, url, content, qposts.user_id as user_id,
                user_name
            FROM qposts 
                INNER JOIN users ON qposts.user_id = users.id
                INNER JOIN mod_actions ON qposts.id = mod_actions.thing_id
            WHERE mod_actions.field = '${C.SAMPLE.FIELDS.DEEPLY_IMPORTANT}' and
                mod_actions.value
            ORDER BY created DESC
            LIMIT 30
            OFFSET $1`, [offset])
            .then(result => result.rows) as Promise<QPost[]>;
    }

    getPosts(offset=0): Promise<QPost[]> {
        return this.db.pool.query(
            `SELECT qposts.id as id, created, title, url, content, qposts.user_id as user_id,
                user_name,
                COALESCE(up_votes,0) as up_votes,  COALESCE(down_votes,0) as down_votes,
                ((extract(epoch from created) - 1134028003)/45000 + log(GREATEST(abs(COALESCE(up_votes,0) - COALESCE(down_votes,0))*2, 1))*sign(COALESCE(up_votes,0)-COALESCE(down_votes,0))) as hot
            FROM qposts 
                INNER JOIN users ON qposts.user_id = users.id
                LEFT JOIN vote_count ON qposts.id = vote_count.id
            ORDER BY hot DESC
            LIMIT 30
            OFFSET $1`, [offset])
            .then(result => result.rows) as Promise<QPost[]>;
    }

    async submitPost({title, userId, url, content}: {title: string, userId: UserId, url?: string,content?: string}): Promise<QPostId> {
        const thingId = await this.db.things.create(C.THINGS.QPOST);
        await this.db.pool.query(
            `INSERT INTO qposts (id, user_id, title, url, content, created)
            VALUES ($1, $2, $3, $4, $5, $6)`, [thingId, userId, title, url, content, new Date()]);
        return thingId as QPostId;
    }

    async upsertHackerNewsPost(v) {
        // TODO what if this query fails, modactions could not be set! Maybe retry?
        let postId = await this.getPostIdByHackerId(v.id);
        const field = C.SAMPLE.FIELDS.DEEPLY_IMPORTANT;
        const botAccount = C.BOT_ACCOUNT_USER_ID;
        const priority = C.MOD_ACTIONS.PRIORTY.AUTO_MOD;
        const isDeeplyImportant = v.score > 600;
        const modActionArgs = {
            field,
            creatorId: botAccount, 
            strikeUps:false, 
            strikeDowns: false, 
            strikePoster: false,
            strikeDisputers: false,
            priority,
            banLength: 30};
        if (!postId) {
            postId = await this.db.things.create(C.THINGS.QPOST);
            await this.db.pool.query(
                `INSERT INTO qposts  
                (id, user_id, title, url, content, created, hackernews_id, hackernews_points) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [postId, botAccount, v.title, `https://news.ycombinator.com/item?id=${v.id}`, "", new Date(), v.id, v.score])
                .then(assertOne);
            if (isDeeplyImportant) {
                await this.db.modActions.upsertModAction({thingId:postId, value:true, version: 0, ... modActionArgs});
            }
        } else {
            await this.db.pool.query(
                `UPDATE qposts 
                SET hackernews_points = $2
                WHERE id = $1`,
                [postId, v.score]).then(assertOne);
            const modAction = await this.db.modActions.getModAction({thingId: postId, field});
            if ((!modAction && isDeeplyImportant) ||
                (!!modAction && modAction.priority <= priority && modAction.value !== isDeeplyImportant)) {
                await this.db.modActions.upsertModAction({thingId:postId, value:isDeeplyImportant, version: modAction.version, ... modActionArgs});
            }
        }
    }
}