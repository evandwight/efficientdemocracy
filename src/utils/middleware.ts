import * as C from '../constant';
import db from "../db/databaseApi";
import validator from 'validator';
import assert from 'assert';
import DemocraticModerationService from '../services/democraticModerationService';

export async function addCustomLocals(req, res, next) {
    let user;
    if (req.isAuthenticated()) {
        try {
            let userId = req.user.id;
            assert(validator.isUUID(userId, 4));
            // console.log("here");
            user = await db.users.getUser(userId);
            // console.log(user);
            user.sample = await DemocraticModerationService.getOldestSample(user.id);
        } catch (error) {
            console.log(error)

        }
    }
    res.locals.user = user;
    res.locals.csrfToken = req.csrfToken();
    res.locals.showLogin = true;
    res.locals.C = C;
    next();
}

