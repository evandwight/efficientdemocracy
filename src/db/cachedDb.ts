import { CacheEntry } from "./types";
import db from './databaseApi';

export let cache: {[key: string]: CacheEntry} = {};

export class CachedDB {
    static getHackerNewsPosts(offset) {
        const key = "getHackerNewsPosts-"+offset;
        return CachedDB.getFromCache(key, () => db.qPosts.getHackerNewsPosts(offset));
    }
    static getDeeplyImportantPosts(offset) {
        const key = "getDeeplyImportantPosts-"+offset;
        return CachedDB.getFromCache(key, () => db.qPosts.getDeeplyImportantPosts(offset));
    }
    static async getFromCache(key: string, dbFunc: () => any, depth?: number) {
        depth = depth || 0;

        if (depth > 100) {
            throw new Error(`Couldn't load ${key} from database`);
        }

        const val = cache[key];
        const expiry = (val || {}).expiry || new Date(1970, 1, 1);
        const loadingExpiry = (val || {}).loadingExpiry || new Date(1970, 1, 1);

        if (expiry > new Date()) {
            return val.data;
        } else {
            if (loadingExpiry < new Date()) {
                cache[key] = { data: undefined, loadingExpiry: new Date(Date.now() + 100), expiry:undefined};
                const data = await dbFunc();
                cache[key] = {data, loadingExpiry:null, expiry: new Date(Date.now() + 1000*60*5)};
                return data;
            } else {
                await new Promise(r => setTimeout(r, 20));
                return await CachedDB.getFromCache(key, dbFunc, depth + 1);
            }
        }
    }
}