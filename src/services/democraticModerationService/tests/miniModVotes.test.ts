import { countsToSummary } from "../miniModVotes";


describe("MiniModVotes", () => {
    describe('countsToSummary', () => {
        it('works', async () => {
            const counts = [
                {vote: true, strike_ups: true, strike_downs: false, strike_poster: false, count: 2},
                {vote: false, strike_ups: true, strike_downs: false, strike_poster: false, count: 1}
              ];
            expect(countsToSummary(counts).vote).toEqual(2/3);
            expect(countsToSummary(counts).true.strike_ups).toBe(2/3);
            expect(countsToSummary(counts).false.strike_ups).toBe(1/3);
        });
        it('handles empty lists', async () => {
            expect(countsToSummary([])).toBe(null);
        });
    });
});
  