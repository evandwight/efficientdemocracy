import { cache, CachedDB } from "../cachedDb";

function createCallCounter() {
    let callNum = 0;
    return function callCounter() {
        callNum += 1;
        return callNum;
    }
}

describe("cachedDb", () => {
    beforeEach(() => {
        cache["test"] = undefined;
    })
    describe('getFromCache', () => {
        it('returns a value', async () => {
            expect(await CachedDB.getFromCache("test", () => 1 )).toBe(1);
        });
        it('to retrieve value from cache', async () => {
            const dbFunc = createCallCounter();
            expect(await CachedDB.getFromCache("test", dbFunc)).toBe(1);
            expect(await CachedDB.getFromCache("test", dbFunc)).toBe(1);
        });
        it('to update value from cache when its expired', async () => {
            const dbFunc = createCallCounter();
            expect(await CachedDB.getFromCache("test", dbFunc)).toBe(1);
            cache["test"].expiry = new Date(1970,1,1);
            expect(await CachedDB.getFromCache("test", dbFunc)).toBe(2);
        });
        it('not call dbFunc when cache is loading', async () => {
            const dbFunc = createCallCounter();
            cache["test"] = {data: undefined, expiry: undefined, loadingExpiry:new Date(2200,1,1)}
            let error = null;
            try {
                console.log(await CachedDB.getFromCache("test", dbFunc))
            } catch (e) {
                error = e;
            }
            expect(error).toBeTruthy();
        });
        it('updates the cache when loading has expired', async () => {
            const dbFunc = createCallCounter();
            cache["test"] = {data: undefined, expiry: new Date(1970, 1, 1), loadingExpiry:new Date(1970,1,1)}
            expect(await CachedDB.getFromCache("test", dbFunc)).toBe(1);
        });
    });
});