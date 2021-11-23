import validator from 'validator';
import DemocraticModerationService from '../services/democraticModerationService';
import { formToStrikes, validationAssert } from './utils';

export async function submitSampleVote(req, res) {
    const { sampleId } = req.params;
    validationAssert(validator.isUUID(sampleId, 4), "Invalid sample id", 400);
    const userId = req.user.id;
    const body = { ...req.body };
    const vote = body.hasOwnProperty("vote");
    const strikes = formToStrikes(body);

    await DemocraticModerationService.sampleVote({ sampleId, userId, vote, strikes });

    res.redirect(req.get("Referrer"));
}