import { getPool } from "./dbConfig";
import { TestPool } from '../testUtils/testDbPool';

class CommonPool {
    pool: any;
    initialize(): Promise<void> {
        if (!this.pool) {
            this.pool = getPool();
        }
        return Promise.resolve();
    }
    end(): Promise<void> {
        if (this.pool)  {
            this.pool.end();
            this.pool = null;
        }
        return Promise.resolve();
    }
    get() {
        return this.pool;
    }
    query(query, parameters?) {
        return this.get().query(query, parameters).catch((e) => {
            if (process.env.NODE_ENV === "dev") {
                console.log("Error:", e)
                console.log("Query args:", query, parameters);
            }
            throw e;
        });
    }
    connect = () => this.pool.connect();
    getSessionPool() {
        return this.pool;
    }
}

const defaultPool = process.env.NODE_ENV !== "test" ? new CommonPool() : new TestPool();

export default defaultPool;