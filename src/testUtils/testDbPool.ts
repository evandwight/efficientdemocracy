import { getConfig } from "../db/dbConfig";
const { Pool } = require("pg");
import { v4 as uuidv4 } from "uuid";


export class TestPool {
    pools: {[key: string]: any};
    keyToDbName: {[key: string]: string};
    constructor() {
        this.pools = {};
        this.keyToDbName = {};
    }
    async initialize(): Promise<void> {
        const k = this.testKey();
        if (!this.pools.hasOwnProperty(k)) {
            const dbName = `testdb${uuidv4().replace(/-/g, '')}`;
            this.keyToDbName[k] = dbName;
            await createDatabase(dbName);
            this.pools[k] = getTestPool(dbName);
        }
    }
    async end(): Promise<void> {
        const k = this.testKey();
        if (this.pools.hasOwnProperty(k)) {
            this.pools[k].end();
            this.pools[k] = undefined;
            await deleteDatabase(this.keyToDbName[k]);
        }
    }
    testKey() {
        const s = expect.getState();
        return `${s.testPath}####${s.currentTestName}`;
    }
    get pool() {
        return this.pools[this.testKey()];
    }
    get() {
        return this.pool;
    }
    query(query, parameters?) {
        // console.log({query})
        const showError = this.testKey().indexOf("expect-db-error") === -1;
        return this.get().query(query, parameters).catch((e) => {
            if (showError) {
                console.log("Error:", e)
                console.log("Query args:", query, parameters);
            }
            throw e;
        }).then(r => {
            // console.log({r});
            return r;
        });
    }
    connect = () => this.pool.connect();
    getSessionPool() {
        return this.pool;
    }
}

function getTestPool(dbName) {
    if (process.env.NODE_ENV !== "test") {
        throw new Error("This is only for testing!");
    }
    const config = {... getConfig(), database: dbName};
    return new Pool(config);
}

async function createDatabase(name) {
    const metaPool = getTestPool("meta");
    try {
        await metaPool.query(`CREATE DATABASE ${name} WITH TEMPLATE test_red`);
        // console.log(`Created db ${name}`);
    } catch(error) {
        console.log({error})
    } finally {
        metaPool.end();
    }
}
async function deleteDatabase(name) {
    const metaPool = getTestPool("meta");
    try {
        await metaPool.query(`DROP DATABASE ${name}`);
        // console.log(`deleted db ${name}`);
    } catch(error) {
        console.log({error})
    } finally {
        metaPool.end();
    }
}