import { dateToSortableStr } from "../freezeDeeplyImportant";


describe("freezeDeeplyImportant", () => {
    describe('dateToSortableStr', () => {
        it('works', () => {
            expect(dateToSortableStr(new Date(2021, 8, 5))).toEqual("2021-09-05");
            expect(dateToSortableStr(new Date(2021, 9, 11))).toEqual("2021-10-11");
        });
    });
});
