import { DatabaseApi } from "./databaseApi";
import * as C from '../constant';
import { selectOne } from '../db/utils';
import { User, UserId } from './types';

export default class Users {
    db: DatabaseApi;
    constructor(db: DatabaseApi) {
        this.db = db;
    }
    createUser({ userName, name, email, hashedPassword }): Promise<UserId> {
        return this.db.things.create(C.THINGS.USER).then(async id => {
            await this.db.pool.query(
                `INSERT INTO users (id, user_name, name, email, password, created_on, is_mod)
                VALUES ($1, $2, $3, $4, $5, $6, false)`,
                [id, userName, name, email, hashedPassword, new Date()]);
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
    getUsers(): Promise<User[]> {
        return this.db.pool.query(`SELECT id FROM users`)
            .then((result) => result.rows.map(row => row.id));
    }

    createGoogleUser({ userName, email, googleId}) {
        return this.db.things.create(C.THINGS.USER).then(async id => {
            await this.db.pool.query(
                `INSERT INTO users (id, user_name, email, google_id, created_on, is_mod, auth_type)
                VALUES ($1, $2, $3, $4, $5, false, ${C.AUTH_TYPE.GOOGLE})`,
                [id, userName, email, googleId, new Date()]);
            return id as UserId;
        });
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
}