import { interpretResults } from "../endSamples";

describe("endSamples", () => {
    describe('interpretResults', () => {
        it('works', async () => {
            const count = [
                {"count": 1, "strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": true},
            ]
            const res = interpretResults(count);
            expect(res).toEqual({"strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": true});
        });

        it('no qurom', async () => {
            const count = [
                {"count": 1, "strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": true},
                {"count": 1, "strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": null},
                {"count": 1, "strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": false},
            ]
            const res = interpretResults(count);
            expect(res).toEqual(null);
        });
        it('removes nulls from vote consideration', async () => {
            const count = [
                {"count": 6, "strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": true},
                {"count": 2, "strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": null},
                {"count": 5, "strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": false},
            ]
            const res = interpretResults(count);
            expect(res).toEqual({"strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": true});
        });
        it('computes strikes correctly', async () => {
            const count = [
                {"count": 6, "strike_disputers": true, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": true},
                {"count": 5, "strike_disputers": false, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": true},
            ]
            const res = interpretResults(count);
            expect(res).toEqual({"strike_disputers": true, "strike_downs": true, "strike_poster": false, "strike_ups": false, "vote": true});
        });
        it('considers voting against as a vote not to strike', async () => {
            const count = [
                {"count": 5, "strike_disputers": true, "strike_downs": false, "strike_poster": false, "strike_ups": false, "vote": true},
                {"count": 3, "strike_disputers": false, "strike_downs": false, "strike_poster": false, "strike_ups": false, "vote": true},
                {"count": 5, "strike_disputers": true, "strike_downs": false, "strike_poster": false, "strike_ups": false, "vote": false},
            ]
            const res = interpretResults(count);
            expect(res).toEqual({"strike_disputers": false, "strike_downs": false, "strike_poster": false, "strike_ups": false, "vote": true});
        });
    });
});