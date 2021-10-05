import { dateToTimeSince } from '../utils';

describe("utils", () => {
    describe('dateToTimeSince', () => {
        it('handles years', () => {
            const res = dateToTimeSince(new Date((new Date()).getTime() - 31536000000))
            expect(res).toEqual("1 year ago");
        });
        it('handles hours', () => {
            const res = dateToTimeSince(new Date((new Date()).getTime() - 2*60*60*1000))
            expect(res).toEqual("2 hours ago");
        });
        it('handles seconds', () => {
            const res = dateToTimeSince(new Date((new Date()).getTime()))
            expect(res).toEqual("0 seconds ago");
        });
    });
});