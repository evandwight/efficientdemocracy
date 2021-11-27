import db from '../db/databaseApi';
import DemocraticModerationService from '../services/democraticModerationService';
import { createCognitoStrategy } from './cognito';

export function initializePassport(passport) {
    passport.use(createCognitoStrategy());

    // Stores user details inside session. serializeUser determines which data of the user
    // object should be stored in the session. The result of the serializeUser method is attached
    // to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide
    //   the user id as the key) req.session.passport.user = {id: 'xyz'}
    passport.serializeUser((user, done) => done(null, user.id));

    // In deserializeUser that key is matched with the in memory array / database or any data resource.
    // The fetched object is attached to the request object as req.user
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await db.users.getUser(id);
            user.sample = await DemocraticModerationService.getOldestSample(id);
            return done(null, user);
        } catch (err) {
            return done (err);
        }
    });
}