import { DatabaseApi } from "./databaseApi";
import * as C from '../constant';
import { internalAssertOne, retryOnceOnUniqueError, selectOne, selectOneAttr, selectRows, WithTransaction } from '../db/utils';
import { User, UserId } from './types';
import { generateSlug } from "random-word-slugs";
import { internalAssert } from "../routes/utils";

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

    // TODO is this indexed by email????
    // FIX - index it
    getUserByEmail(email: string): Promise<User> {
        return this.db.pool.query(`
            SELECT * FROM users WHERE email = $1`, [email])
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

    async createLocalUserWithRandomName({email, hashedPassword}) {
        return WithTransaction(this.db, async client => {
            const id = await this.db.things.create(C.THINGS.USER, client);

            await retryOnceOnUniqueError(async () => {
                const userName = await this.generateUserName();
                return client.query(
                    `INSERT INTO users (id, user_name, email, password, created_on, is_mod, auth_type, unsubscribe_key, is_email_verified)
                    VALUES ($1, $2, $3, $4, $5, false, ${C.AUTH_TYPE.LOCAL}, $6, false)`,
                    [id, userName, email, hashedPassword, new Date(), this.db.uuidv4()]);
            }).then(internalAssertOne);
            return id;
        });
    }

    async createGoogleUserWithRandomName({email, googleId}) {
        return WithTransaction(this.db, async client => {
            const id = await this.db.things.create(C.THINGS.USER, client);

            await retryOnceOnUniqueError(async () => {
                const userName = await this.generateUserName();
                return client.query(
                    `INSERT INTO users (id, user_name, email, google_id, created_on, is_mod, auth_type, unsubscribe_key, is_email_verified)
                    VALUES ($1, $2, $3, $4, $5, false, ${C.AUTH_TYPE.GOOGLE}, $6, true)`,
                    [id, userName, email, googleId, new Date(), this.db.uuidv4()]);
            }).then(internalAssertOne);
            return id;
        });
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

    getUserByGoogleId(googleId) {
        return this.db.pool.query(`
            SELECT * FROM users WHERE google_id = $1`, [googleId])
            .then(selectOne);
    }

    getUserIdByUnsubscribeKey(unsubscribeKey): Promise<User> {
        return this.db.pool.query(`
            SELECT id FROM users WHERE unsubscribe_key = $1`, [unsubscribeKey])
            .then(selectOneAttr('id'));
    }

    setSetting(userId: UserId, propName: C.USER.COLUMNS, propValue: string|number|boolean) {
        internalAssert(Object.values(C.USER.COLUMNS).includes(propName), "Invalid property");
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