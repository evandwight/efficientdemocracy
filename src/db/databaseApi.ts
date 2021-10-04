import { v4 as uuidv4 } from "uuid";
import { Pool } from "pg";
import QPosts from './qPosts';
import Votes from "./votes";
import { UUID } from './types';
import Users from "./users";
import Things from "./things";
import Kv from "./kv";
import dbPool from "./dbPool";


export class DatabaseApi {
    uuidv4: () => UUID;
    pool: any;
    realPool: Pool;
    qPosts: QPosts;
    votes: Votes;
    users: Users;
    things: Things;
    kv: Kv;
    isInitialized: boolean;

    constructor() {
        this.uuidv4 = uuidv4;
        this.qPosts = new QPosts(this);
        this.votes = new Votes(this);
        this.users = new Users(this);
        this.things = new Things(this);
        this.kv = new Kv(this);
        this.isInitialized = false;
    }
    end() {
        if (!this.isInitialized) {
            return Promise.resolve();
        }
        this.isInitialized = false;
        return this.pool.end();
    }
    initialize() {
        if (this.isInitialized) {
            return Promise.resolve();
        }
        this.isInitialized = true;
        this.pool = dbPool;
        dbPool.initialize();
        this.realPool = dbPool.pool;
    }
}

export default new DatabaseApi();
