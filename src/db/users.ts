import { DatabaseApi } from "./databaseApi";
import * as C from '../constant';
import { internalAssertOne, retryOnceOnUniqueError, selectOne, selectOneAttr, selectRows, WithTransaction } from '../db/utils';
import { User, UserId } from './types';
import { generateSlug } from "random-word-slugs";
import { unexpectedAssert } from "../routes/utils";

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
            .then((result) => result.rows.map(row => row.id));
    }

    getUsers(): Promise<User[]> {
        return this.db.pool.query(`SELECT * FROM users`).then(selectRows);
    }

    async createCognitoUser({id}) {
        await this.db.things.insert({id, type: C.THINGS.USER});

        await retryOnceOnUniqueError(async () => {
            const userName = await this.generateUserName();
            return this.db.pool.query(
                `INSERT INTO users (id, user_name, created_on, unsubscribe_key)
                VALUES ($1, $2, $3, $4)`,
                [id, userName, new Date(), this.db.uuidv4()]);
        }).then(internalAssertOne);
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
        unexpectedAssert(Object.values(C.USER.COLUMNS).includes(propName), "Invalid property");
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
}