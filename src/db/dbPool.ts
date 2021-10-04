import { getPool } from "./dbConfig";

class CommonPool {
    pool: any;
    initialize() {
        if (!this.pool) {
            this.pool = getPool();
        }
    }
    end() {
        if (this.pool)  {
            this.pool.end();
            this.pool = null;
        }
    }
    get() {
        return this.pool;
    }
    query(query, parameters?) {
        return this.get().query(query, parameters).catch((e) => {
            console.log("Error:", e)
            console.log("Query args:", query, parameters);
            throw e;
        });
    }
    connect = () => this.pool.connect();
}

export default new CommonPool();