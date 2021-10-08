import db from '../../db/databaseApi';
import { testApi } from '../../testUtils';
import axios from "axios";
import * as C from '../../constant';
import { maybeSetDeeplyImportant } from '..';
import DemocraticModerationService from '../../services/democraticModerationService';

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
            expect(list.data.length).toBeGreaterThan(1);
            const item = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${list.data[0]}.json`);
            expect(typeof item.data.title).toEqual('string');
            expect(typeof item.data.url).toEqual('string');
        });
    });
    describe("maybeSetDeeplyImportant", () => {
        it("works", async () => {
            const postId = await testApi.createPost({});
            const params = {thingId: postId, field: C.FIELDS.LABELS.DEEPLY_IMPORTANT};
            await maybeSetDeeplyImportant(postId, true);
            expect((await DemocraticModerationService.getModAction(params)).value).toBe(true);
            
            await maybeSetDeeplyImportant(postId, false);
            expect((await DemocraticModerationService.getModAction(params)).value).toBe(false);
        });
    });
});