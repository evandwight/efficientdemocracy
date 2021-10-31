import { countsToWinner } from "../modVotes";

describe("ModVotes", () => {
    describe('countsToWinner', () => {
        it('works', async () => {
            const counts = [
                {'vote': 1, 'count': 1},
                {'vote': 2, 'count': 3},
                {'vote': 3, 'count': 2}];
            expect(countsToWinner(counts)).toBe(2);
        });
        it('handles empty lists', async () => {
            expect(countsToWinner([])).toBe(null);
        });
    });
});