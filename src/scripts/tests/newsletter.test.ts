import { dateToStr } from "../newsletter";

describe("newsletter", () => {
    describe('dateToStr', () => {
        it('works', () => {
            expect(dateToStr(new Date(2021, 9, 25))).toEqual("Mon 25th");
            expect(dateToStr(new Date(2021, 9, 3))).toEqual("Sun 3rd");
        });
    });
});
