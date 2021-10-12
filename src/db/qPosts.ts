import { DatabaseApi } from "./databaseApi";
import {QPost, QPostId, UserId} from "./types";
import { internalAssertOne, lastSaturday, selectAttr, selectOne, selectOneAttr } from "./utils";
import * as C from '../constant';
import { HnPost } from "../batch/types";

export default class QPosts {
    db: DatabaseApi;
    constructor(db: DatabaseApi) {
        this.db = db;
    }

    getPost(postId): Promise<QPost> {
        return this.db.pool.query(
            `SELECT qposts.id as id, created, title, url, content, hackernews_id, qposts.user_id as user_id,
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

    getPostsByIds(postIds: QPostId[]): Promise<QPost[]> {
        return this.db.pool.query(
            `SELECT qposts.id as id, created, title, url, content, hackernews_id, qposts.user_id as user_id,
                user_name
            FROM qposts 
                INNER JOIN users ON qposts.user_id = users.id
            WHERE qposts.id = ANY ($1)`, [postIds])
            .then(result => result.rows as QPost[]);
    }

    getHackerNewsPosts(): Promise<{id: QPostId, hot: number}[]> {
        return this.db.pool.query(
            `WITH scored_posts as (
                SELECT qposts.id as id, qposts.created,
                (COALESCE(hackernews_points, 0) + 10 * (COALESCE(up_votes, 0) - COALESCE(down_votes,0))) as score
                FROM qposts 
                    LEFT JOIN vote_count ON qposts.id = vote_count.id
            )
            SELECT id,
                ((extract(epoch from created) - 1134028003)/45000 + log(GREATEST(abs(score)*2, 1))*sign(score)) as hot
            FROM scored_posts
            ORDER BY hot DESC
            LIMIT 1000`)
            .then(result => result.rows) as Promise<{id: QPostId, hot: number}[]>;
    }

    getNewPosts(offset=0): Promise<QPostId[]> {
        return this.db.pool.query(
            `SELECT id
            FROM qposts
            ORDER BY created DESC
            LIMIT ${C.POSTS_PER_PAGE + 1}
            OFFSET $1`, [offset])
            .then(selectAttr("id")) as Promise<QPostId[]>;
    }

    getDeeplyImportantPosts(): Promise<QPostId[]> {
        return this.db.pool.query(
            `SELECT qposts.id as id
            FROM qposts 
                INNER JOIN mod_actions ON qposts.id = mod_actions.thing_id
            WHERE mod_actions.field = '${C.FIELDS.LABELS.DEEPLY_IMPORTANT}' and
                mod_actions.value and
                qposts.created >= $1
            ORDER BY created DESC
            LIMIT 1000`, [lastSaturday()])
            .then(selectAttr("id")) as Promise<QPostId[]>;
    }

    getTechnical(): Promise<QPostId[]> {
        return this.db.pool.query(
            `WITH scored_posts as (
                SELECT qposts.id as id, qposts.created,
                (COALESCE(hackernews_points, 0) + 10 * (COALESCE(up_votes, 0) - COALESCE(down_votes,0))) as score
                FROM qposts 
                    LEFT JOIN vote_count ON qposts.id = vote_count.id
            )
            SELECT scored_posts.id as id,
                ((extract(epoch from created) - 1134028003)/45000 + log(GREATEST(abs(score)*2, 1))*sign(score)) as hot
            FROM scored_posts
                INNER JOIN mod_actions ON scored_posts.id = mod_actions.thing_id
            WHERE mod_actions.field = '${C.FIELDS.LABELS.TECHNICAL}' and
                mod_actions.value
            ORDER BY hot DESC
            LIMIT 1000`)
            .then(selectAttr("id")) as Promise<QPostId[]>;
    }

    getPosts(offset=0): Promise<QPost[]> {
        return this.db.pool.query(
            `SELECT qposts.id as id, created, title, url, content, hackernews_id, qposts.user_id as user_id,
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

    async upsertHackerNewsPost(v: HnPost): Promise<QPostId> {
        // TODO what if this query fails, modactions could not be set! Maybe retry?
        let postId = await this.getPostIdByHackerId(v.id);

        if (!postId) {
            postId = await this.db.things.create(C.THINGS.QPOST);
            await this.db.pool.query(
                `INSERT INTO qposts  
                (id, user_id, title, url, content, created, hackernews_id, hackernews_points) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [postId, C.BOT_ACCOUNT_USER_ID, v.title, v.url, "", new Date(v.time * 1000), v.id, v.score])
                .then(internalAssertOne);
        } else {
            await this.db.pool.query(
                `UPDATE qposts 
                SET hackernews_points = $2
                WHERE id = $1`,
                [postId, v.score]).then(internalAssertOne);
        }
        
        return postId;
    }
}