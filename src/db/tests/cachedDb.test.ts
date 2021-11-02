import { cache, CachedDB, getByOffset } from "../cachedDb";

function createCallCounter() {
    let callNum = 0;
    return function callCounter() {
        callNum += 1;
        return callNum;
    }
}

describe("cachedDb", () => {
    describe('getFromCache', () => {
        it('returns a value', async () => {
            expect(await CachedDB.getFromCache("testa", () => 1 )).toBe(1);
        });
        it('to retrieve value from cache', async () => {
            const dbFunc = createCallCounter();
            expect(await CachedDB.getFromCache("testb", dbFunc)).toBe(1);
            expect(await CachedDB.getFromCache("testb", dbFunc)).toBe(1);
        });
        it('to update value from cache when its expired', async () => {
            const dbFunc = createCallCounter();
            expect(await CachedDB.getFromCache("testc", dbFunc)).toBe(1);
            cache["testc"].expiry = new Date(1970,1,1);
            expect(await CachedDB.getFromCache("testc", dbFunc)).toBe(2);
        });
        it('not call dbFunc when cache is loading', async () => {
            const dbFunc = createCallCounter();
            cache["testd"] = {data: undefined, expiry: undefined, loadingExpiry:new Date(2200,1,1)}
            let error = null;
            try {
                console.log(await CachedDB.getFromCache("testd", dbFunc))
            } catch (e) {
                error = e;
            }
            expect(error).toBeTruthy();
        });
        it('updates the cache when loading has expired', async () => {
            const dbFunc = createCallCounter();
            cache["teste"] = {data: undefined, expiry: new Date(1970, 1, 1), loadingExpiry:new Date(1970,1,1)}
            expect(await CachedDB.getFromCache("teste", dbFunc)).toBe(1);
        });
    });
    describe('getByOffset', () => {
        it('works', async () => {
            let l = [];
            for (let i = 0; i < 1000; i ++) {
                l.push(i);
            }
            let res = getByOffset(0)(l);
            expect(res.length).toBe(31);
            expect(res[0]).toBe(0);

            res = getByOffset(30)(l);
            expect(res.length).toBe(31);
            expect(res[29]).toBe(59);
        });
    });
});