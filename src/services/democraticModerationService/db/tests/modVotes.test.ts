import db from '../../../../db/databaseApi';
import {testApi} from '../../../../testUtils';
import * as C from '../../../../constant';
import { UserId } from '../../../../db/types';
import ModActions from '../modActions';
import ModVotes from '../modVotes';

describe("ModVotesDb", () => {
    beforeEach(async () => {
        await db.initialize();
    });
    afterEach(async () => {
        await db.end();
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
        it('uses wants mod and excludes no participate', async () => {
            const mod1 = await testApi.createUserWithSettings("mod1", [
                [C.USER.COLUMNS.wants_mod, true]
            ]);
            const mod2 = await testApi.createUserWithSettings("mod2", [
                [C.USER.COLUMNS.wants_mod, false]
            ]);
            const user1 = await testApi.createUserWithSettings("user1", [
                [C.USER.COLUMNS.dm_participate, C.USER.DM_PARICIPATE.direct]
            ]);
            const user2 = await testApi.createUserWithSettings("user2", [
                [C.USER.COLUMNS.dm_participate, C.USER.DM_PARICIPATE.direct]
            ]);
            const user3 = await testApi.createUserWithSettings("user3", [
                [C.USER.COLUMNS.dm_participate, C.USER.DM_PARICIPATE.no]
            ]);
            await ModVotes.upsertVote({userId: user1, vote:mod1});
            await ModVotes.upsertVote({userId: user2, vote:mod2});
            await ModVotes.upsertVote({userId: user3, vote:mod1});
            const counts = await ModVotes.countVotes();
            expect(counts).toEqual([{vote:mod1, user_name: "mod1", count: 1}]);
        });
        it('uses proxies', async () => {
            const mod1 = await testApi.createUserWithSettings("mod1", [
                [C.USER.COLUMNS.wants_mod, true]
            ]);
            const proxy1 = await testApi.createUserWithSettings("proxy1", [
                [C.USER.COLUMNS.wants_proxy, true]
            ]);
            const user1 = await testApi.createUserWithSettings("user1", [
                [C.USER.COLUMNS.dm_participate, C.USER.DM_PARICIPATE.proxy],
                [C.USER.COLUMNS.proxy_id, proxy1],
            ]);
            const user2 = await testApi.createUserWithSettings("user2", [
                [C.USER.COLUMNS.dm_participate, C.USER.DM_PARICIPATE.proxy],
                [C.USER.COLUMNS.proxy_id, null],
            ]);
            await ModVotes.upsertVote({userId: proxy1, vote:mod1});
            const counts = await ModVotes.countVotes();
            expect(counts).toEqual([{vote:mod1, user_name: "mod1", count: 1}]);
        });
    });
});