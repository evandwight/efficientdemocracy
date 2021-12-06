import validator from 'validator';
import * as C from '../../constant';
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
    const { user } = res.locals;

    validationAssert(validator.isUUID(proxyId, 4), "Invalid proxyId", 400);
    validationAssert(user.dm_participate === C.USER.DM_PARTICIPATE.proxy,
        "To set a proxy, you must participate in democratic moderation by proxy", 400);

    await DemocraticModerationService.setProxy({ userId: user.id, proxyId });

    res.sendStatus(200);
}