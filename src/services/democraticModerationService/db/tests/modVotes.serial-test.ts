import db from '../../../../db/databaseApi';
import {testApi} from '../../../../testUtils';
import * as C from '../../../../constant';
import { UserId } from '../../../../db/types';
import ModActions from '../modActions';
import ModVotes from '../modVotes';

beforeAll(() => {
    return db.initialize();
});
afterAll(() => {
    return db.end();
});

describe("ModVotesDb", () => {
    beforeEach(() => {
        return testApi.deleteAll();
    });

    describe('upsertVote', () => {
        it('works', async () => {
            const userId = db.uuidv4();
            let vote = db.uuidv4();
            await ModVotes.upsertVote({userId, vote});
            vote = db.uuidv4();
            await ModVotes.upsertVote({userId, vote});
        });
    });
    describe('countVotes', () => {
        it('works', async () => {
            const mod1 = await testApi.createUser();
            await db.users.setSetting(mod1, C.USER.COLUMNS.wants_mod, true);
            const mod2 = await testApi.createUser({userName:"b", email:"bb"});
            await ModVotes.upsertVote({userId: db.uuidv4(), vote:mod1});
            await ModVotes.upsertVote({userId: db.uuidv4(), vote:mod2});
            const counts = await ModVotes.countVotes();
            expect(counts).toEqual([{vote:mod1, user_name: "a", count: 1}]);
        });
    });
});