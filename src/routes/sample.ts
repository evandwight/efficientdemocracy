import validator from 'validator';
import db from '../db/databaseApi';
import DemocraticModerationService from '../services/democraticModerationService';
import { reactRender } from '../views/utils';
import { ViewSampleRequest } from '../views/viewSampleRequest';
import { ViewSampleRequests } from '../views/viewSampleRequests';
import { formToStrikes, unexpectedAssert, validationAssert } from './utils';
import * as C from '../constant';
export async function submitSampleVote(req, res) {
    const { sampleId } = req.params;
    validationAssert(validator.isUUID(sampleId, 4), "Invalid sample id", 400);
    const {user} = res.locals;
    const body = { ...req.body };
    const vote = body.hasOwnProperty("vote");
    const strikes = formToStrikes(body);

    validationAssert(user.wants_proxy || user.dm_participate === C.USER.DM_PARTICIPATE.direct,
        "To participate in democratic moderation change your settings", 400);

    await DemocraticModerationService.sampleVote({ sampleId, userId: user.id, vote, strikes });

    res.redirect(req.get("Referrer"));
}

export async function viewSampleRequests(req, res) {
    const { user } = res.locals;

    let samples = await DemocraticModerationService.getSamplesForUser({userId: user.id, isProxy: user.wants_proxy});

    reactRender(res, ViewSampleRequests({ samples }), { title: "Sample requests", showCards: false });
}

export async function viewSampleRequest(req, res) {
    const { sampleId } = req.params;
    validationAssert(validator.isUUID(sampleId, 4), "Invalid sample id", 400);

    let sample = await DemocraticModerationService.getSampleResult(sampleId);
    validationAssert(!!sample, "Sample not found", 404);
    sample.post = await db.qPosts.getPost(sample.samplee_id);
    unexpectedAssert(!!sample.post, "No post found with sample")

    reactRender(res, ViewSampleRequest({ sample, csrfToken: res.locals.csrfToken }),
        { title: "Sample request", showCards: false });
}