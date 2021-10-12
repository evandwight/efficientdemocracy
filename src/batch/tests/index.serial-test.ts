import db from '../../db/databaseApi';
import { testApi } from '../../testUtils';
import axios from "axios";
import * as C from '../../constant';
import { maybeSetField, areTitlesTechnical } from '..';
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
    describe("maybeSetField", () => {
        it("works", async () => {
            const postId = await testApi.createPost({});
            const params = {thingId: postId, field: C.FIELDS.LABELS.DEEPLY_IMPORTANT};
            await maybeSetField({thingId: postId, shouldBe: true, field: C.FIELDS.LABELS.DEEPLY_IMPORTANT});
            expect((await DemocraticModerationService.getModAction(params)).value).toBe(true);
            
            await maybeSetField({thingId: postId, shouldBe: false, field: C.FIELDS.LABELS.DEEPLY_IMPORTANT});
            expect((await DemocraticModerationService.getModAction(params)).value).toBe(false);
        });
    });
    describe("areTitlesTechnical", () => {
        it("works", async () => {
            const titles = [
                'Show HN:',
                'Children Exposed To Religion Have Difficulty Distinguishing Fact From Fiction'
            ]

            expect(await areTitlesTechnical(titles)).toEqual([true, false]);
        });
        it("handles giant titles", async () => {
            const title =  new Array(1000).fill("A").join("");
            const titles = new Array(30).fill(title);

            const res = await areTitlesTechnical(titles);
            expect(res.length).toBe(30);
        });
    });
});