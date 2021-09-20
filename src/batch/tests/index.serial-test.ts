import db from '../../db/databaseApi';
import { testApi } from '../../testUtils';
import axios from "axios";

beforeAll(() => {
    return db.initialize();
});
afterAll(() => {
    return db.end();
});

describe("Batch", () => {
    beforeEach(() => {
        return testApi.deleteAll();
    });

    describe("hackernews", () => {
        it("works", async () => {
            const list = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
            expect(list.data.length).toBe(500);
            const item = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${list.data[0]}.json`);
            expect(typeof item.data.title).toEqual('string');
            expect(typeof item.data.url).toEqual('string');
        });
    });
});