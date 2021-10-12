import { CacheEntry } from "./types";
import db from './databaseApi';
import * as C from '../constant';

export let cache: {[key: string]: CacheEntry} = {};

export function getByOffset(offset) {
    offset = offset || 0;
    return l => l.slice(offset, offset + C.POSTS_PER_PAGE + 1);
}

export class CachedDB {
    static getHackerNewsPosts(offset) {
        const key = "getHackerNewsPosts";
        return CachedDB.getFromCache(key, () => db.qPosts.getHackerNewsPosts())
            .then(getByOffset(offset));
    }
    static getDeeplyImportantPosts(offset) {
        const key = "getDeeplyImportantPosts";
        return CachedDB.getFromCache(key, () => db.qPosts.getDeeplyImportantPosts())
            .then(getByOffset(offset));
    }
    static getTechnical(offset) {
        const key = "getTechnical";
        return CachedDB.getFromCache(key, () => db.qPosts.getTechnical())
            .then(getByOffset(offset));
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