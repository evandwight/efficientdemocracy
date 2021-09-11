import { DatabaseApi } from "./databaseApi";
import * as C from '../constant';
import { assertOne, retryOnceOnUniqueError, selectOne, selectOneAttr, selectRows, WithTransaction } from '../db/utils';
import { User, UserId } from './types';
import { generateSlug } from "random-word-slugs";

export default class Users {
    db: DatabaseApi;
    constructor(db: DatabaseApi) {
        this.db = db;
    }
    createUser({ userName, name, email, hashedPassword }): Promise<UserId> {
        return this.db.things.create(C.THINGS.USER).then(async id => {
            await this.db.pool.query(
                `INSERT INTO users (id, user_name, name, email, password, created_on, unsubscribe_key, is_mod)
                VALUES ($1, $2, $3, $4, $5, $6, $7, false)`,
                [id, userName, name, email, hashedPassword, new Date(), this.db.uuidv4()]);
            return id as UserId;
        });
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

    async createGoogleUserWithRandomName({email, googleId}) {
        return WithTransaction(this.db, async client => {
            const id = await this.db.things.create(C.THINGS.USER, client);

            await retryOnceOnUniqueError(async () => {
                const userName = await this.generateUserName();
                return client.query(
                    `INSERT INTO users (id, user_name, email, google_id, created_on, is_mod, auth_type, unsubscribe_key)
                    VALUES ($1, $2, $3, $4, $5, false, ${C.AUTH_TYPE.GOOGLE}, $6)`,
                    [id, userName, email, googleId, new Date(), this.db.uuidv4()]);
            }).then(assertOne);
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

    setFirstRunComplete(id) {
        return this.db.pool.query(
            `UPDATE users
            SET first_run = false
            WHERE id = $1`,
            [id]);
    }

    setSendEmails({userId, sendEmails}) {
        return this.db.pool.query(
            `UPDATE users
            SET send_emails = $2
            WHERE id = $1`,
            [userId, sendEmails]);
    }

    getUserIdByUnsubscribeKey(unsubscribeKey): Promise<User> {
        return this.db.pool.query(`
            SELECT id FROM users WHERE unsubscribe_key = $1`, [unsubscribeKey])
            .then(selectOneAttr('id'));
    }
}