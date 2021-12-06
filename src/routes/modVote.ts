import { reactRender } from '../views/utils';
import { validationAssert } from './utils';
import validator from 'validator';
import DemocraticModerationService from '../services/democraticModerationService';
import { ViewModVote } from '../views/viewModVote';
import db from '../db/databaseApi';
import { CachedDB } from '../db/cachedDb';
import * as C from '../constant';

export async function viewModVote(req, res) {
    const currentModId = await DemocraticModerationService.getMod();
    const currentMod = await db.users.getUser(currentModId);
    const currentModVoteId = await DemocraticModerationService.getModVote(req.user.id);
    const currentModVote = !!currentModVoteId ? await db.users.getUser(currentModVoteId) : null;
    const voteCount = await CachedDB.countModVotes();

    reactRender(res, ViewModVote({ currentMod, currentModVote, voteCount }), { title: "Select moderator", includeVotesJs: true });
}

export async function submitModVote(req, res) {
    const { vote } = req.params;
    const { user } = res.locals;

    validationAssert(validator.isUUID(vote,4), "Invalid vote", 400);
    validationAssert(user.wants_proxy || user.dm_participate === C.USER.DM_PARTICIPATE.direct,
        "To vote for mod, you must participate in democratic moderation directly", 400);

    await DemocraticModerationService.setModVote({userId: user.id, vote});

    res.sendStatus(200);
}