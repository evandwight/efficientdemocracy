import validator from 'validator';
import db from '../../db/databaseApi';
import DemocraticModerationService from '../../services/democraticModerationService';
import { reactRender } from '../../views/utils';
import { ViewProxy } from '../../views/viewProxy';
import { validationAssert } from '../utils';

export async function viewProxy(req, res) {
    const proxyId = await DemocraticModerationService.getProxy(req.user.id);
    const currentProxy = !!proxyId ? await db.users.getUser(proxyId) : null;
    const proxies = await DemocraticModerationService.getProxies();

    reactRender(res, ViewProxy({ currentProxy, proxies }), { title: "Select your proxy", includeVotesJs: true });
}

export async function submitProxy(req, res) {
    const { proxyId } = req.params;
    const userId = req.user.id;

    validationAssert(validator.isUUID(proxyId, 4), "Invalid proxyId", 400);

    await DemocraticModerationService.setProxy({ userId, proxyId });
    console.log(await DemocraticModerationService.getProxy(userId));

    res.sendStatus(200);
}