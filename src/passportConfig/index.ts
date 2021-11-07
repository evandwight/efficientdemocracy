import { createGoogleStrategy } from "./google";
import { createLocalStrategy } from "./local";

export function initializePassport(passport) {
    passport.use(createLocalStrategy());
    passport.use(createGoogleStrategy());

    // Stores user details inside session. serializeUser determines which data of the user
    // object should be stored in the session. The result of the serializeUser method is attached
    // to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide
    //   the user id as the key) req.session.passport.user = {id: 'xyz'}
    passport.serializeUser((user, done) => done(null, user.id));

    // In deserializeUser that key is matched with the in memory array / database or any data resource.
    // The fetched object is attached to the request object as req.user
    passport.deserializeUser((id, done) => {
        // console.log("desearlize id:" + id);
        return done(null, { id });
    });
}
