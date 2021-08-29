import { v4 as uuidv4 } from "uuid";
import { getPool } from "./dbConfig";
import { Pool } from "pg";
import QPosts from './qPosts';
import Votes from "./votes";
import ModActions from "./modActions";
import Samples from "./samples";
import Strikes from "./strikes";
import { UUID } from './types';
import Users from "./users";
import Things from "./things";


export class DatabaseApi {
    uuidv4: () => UUID;
    pool: any;
    realPool: Pool;
    qPosts: QPosts;
    votes: Votes;
    samples: Samples;
    modActions: ModActions;
    strikes: Strikes;
    users: Users;
    things: Things;
    isInitialized: boolean;

    constructor() {
        this.uuidv4 = uuidv4;
        this.qPosts = new QPosts(this);
        this.votes = new Votes(this);
        this.modActions = new ModActions(this);
        this.samples = new Samples(this);
        this.strikes = new Strikes(this);
        this.users = new Users(this);
        this.things = new Things(this);
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
        this.realPool = getPool();
        this.pool = {};
        this.pool.end = () => this.realPool.end();
        this.pool.connect = () => this.realPool.connect();
        this.pool.query = (query, parameters) => {
            // console.log("Query args:", query, parameters);
            return this.realPool.query(query, parameters).catch((e) => {
                console.log("Error:", e)
                console.log("Query args:", query, parameters);
                throw e;
            });
        }
    }
}

export default new DatabaseApi();
