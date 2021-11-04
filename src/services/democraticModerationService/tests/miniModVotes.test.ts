import { countsToSummary } from "../miniModVotes";


describe("MiniModVotes", () => {
    describe('countsToSummary', () => {
        it('works', async () => {
            const counts = [
                {vote: true, strike_ups: false, strike_downs: false, strike_poster: false, count: 1}
              ];
            expect(countsToSummary(counts).vote).toBe(1);
        });
        it('handles empty lists', async () => {
            expect(countsToSummary([])).toBe(null);
        });
    });
});
  