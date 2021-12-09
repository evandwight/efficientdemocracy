import { generateSlug } from "random-word-slugs";
import * as C from '../constant';
import { internalAssertOne, retryOnceOnUniqueError, selectAttr, selectOne, selectOneAttr, selectRows } from '../db/utils';
import { unexpectedAssert } from "../routes/utils";
import { DmUser } from "../services/democraticModerationService/types";
import { DatabaseApi } from "./databaseApi";
import { User, UserId } from './types';

export default class Users {
    db: DatabaseApi;
    constructor(db: DatabaseApi) {
        this.db = db;
    }

    getUser(userId: UserId): Promise<User> {
        return this.db.pool.query(`
            SELECT * FROM users WHERE id = $1`, [userId])
            .then(selectOne);
    }

    getUserByCognitoId(cognitoId): Promise<User> {
        return this.db.pool.query(`
            SELECT * FROM users WHERE cognito_id = $1`, [cognitoId])
            .then(selectOne);
    }

    // TODO not indexed by user_name
    // FIX - index it
    getUserByUserName(userName): Promise<User> {
        return this.db.pool.query(`
            SELECT * FROM users WHERE user_name = $1`, [userName])
            .then(selectOne);
    }

    // TODO this could return millions of records
    // NO FIX
    getUserIds(): Promise<UserId[]> {
        return this.db.pool.query(`SELECT id FROM users`)
            .then(selectAttr('id'));
    }

    getDmUsers(): Promise<DmUser[]> {
        return this.db.pool.query(
            `SELECT id , dm_participate, proxy_id
            FROM users
            WHERE dm_participate <> 'no'`)
            .then(selectRows)
            .then(e => ({userId: e.id, proxyId: e.dm_participate === 'proxy' ? e.proxy_id : null}));
    }

    getUsers(): Promise<User[]> {
        return this.db.pool.query(`SELECT * FROM users`).then(selectRows);
    }

    async createCognitoUser({cognitoId}) {
        const id = await this.db.things.create(C.THINGS.USER);

        await retryOnceOnUniqueError(async () => {
            const userName = await this.generateUserName();
            return this.db.pool.query(
                `INSERT INTO users (id, cognito_id, user_name, created_on, unsubscribe_key)
                VALUES ($1, $2, $3, $4, $5)`,
                [id, cognitoId, userName, new Date(), this.db.uuidv4()]);
        }).then(internalAssertOne);

        return id;
    }

    async generateUserName(){
        for (let i = 0; i < 10; i++) {
            const userName = generateSlug();
            const user = await this.getUserByUserName(userName);
            if (!user) {
                return userName;
            }
        }
        throw new Error("Unable to find unique user name")
    }

    getUserIdByUnsubscribeKey(unsubscribeKey): Promise<User> {
        return this.db.pool.query(`
            SELECT id FROM users WHERE unsubscribe_key = $1`, [unsubscribeKey])
            .then(selectOneAttr('id'));
    }

    setSetting(userId: UserId, propName: C.USER.COLUMNS, propValue: string|number|boolean|Date) {
        unexpectedAssert(C.USER.COLUMNS.hasOwnProperty(propName), "Invalid property");
        const columnName = C.USER.COLUMNS[propName]; 
        return this.db.pool.query(
            `UPDATE users
            SET "${columnName}" = $2
            WHERE id = $1`,
            [userId, propValue]).then(internalAssertOne);
    }
    
    getMod(): Promise<UserId> {
        return this.db.pool.query(`SELECT id FROM users WHERE is_mod = true`).then(selectOneAttr('id'));
    }

    getProxies() {
        return this.db.pool.query(
            `SELECT id, user_name
            FROM users
            WHERE wants_proxy = true`
        ).then(selectRows);
    }
}