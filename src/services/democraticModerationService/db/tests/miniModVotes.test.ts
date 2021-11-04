import db from '../../../../db/databaseApi';
import MiniModVotes from '../miniModVotes';

describe("ModVotesDb", () => {
    beforeEach(async () => {
        await db.initialize();
    });
    afterEach(async () => {
        await db.end();
    });

    describe('vote', () => {
        it('works', async () => {
            await MiniModVotes.vote({
                thingId: db.uuidv4(),
                field: "censor",
                userId: db.uuidv4(),
                vote: true,
                strikeUps: true,
                strikeDowns: true,
                strikePoster: true
            });
        });
    });
    describe('countVotes', () => {
        it('works', async () => {
            const counts = await MiniModVotes.countVotes({thingId: db.uuidv4(), field: "censor"});
            expect(counts).toEqual([]);
        });
    });
});