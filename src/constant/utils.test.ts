import {mapProp, mapAll} from './utils';

export const SAMPLE_TRUTH_ANSWERS = {
    TRUE: {id: 0, text: "asdfsdf"},
    MOSTLY_TRUE: {id: 1, text: "asdfsdf"},
    MIXTURE: {id: 2, text: "asdfsdf"},
    MOSTLY_FALSE: {id: 3, text: "asdfsdf"},
    FALSE: {id: 4, text: "asdfsdf"},
    UNPROVEN: {id: 5, text: "asdfsdf"},
}


describe("mapProp", () => {
    it("works", () => {
        const res = mapProp([{a:1,  b:2}, {a:"c",  b:3}], 'a', 'b');
        expect(res).toEqual({"1":2, "c":3});
    })
    it("handles none", () => {
        const res = mapProp([], 'a', 'b');
        expect(res).toEqual({});
    })
})

describe("mapAll", () => {
    it("works", () => {
        const res = mapAll([{a:1,  b:2, c: 3}, {a:"c",  b:3, c:4}], 'a', ['b', 'c']);
        expect(res).toEqual({a: [1, "c"], b:{"1": 2, "c": 3}, "c": {"1": 3, "c": 4}});
    })
})