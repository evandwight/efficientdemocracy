import { reactRender } from '../../views/utils';
import { Strikes } from '../../views/strikes';
import DemocraticModerationService from '../../services/democraticModerationService';


export async function strikes(req, res) {
    const { user } = res.locals;
    const strikes = await DemocraticModerationService.getStrikes(user.id);
    reactRender(res, Strikes({ user, strikes }), { title: "Strikes" });
}
