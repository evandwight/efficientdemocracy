const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
import db from './db/databaseApi';

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
export const initialize = (passport) => {

    const strategy = new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, verifyGoogleLogin);
    passport.use(strategy);

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

export function verifyGoogleLogin(accessToken, refreshToken, profile, done) {
    // id: '',
    // displayName: '',
    // name: { familyName: '', givenName: '' },
    // emails: [ { value: 'a@gmail.com', verified: true } ],
    // photos: [
    //   {
    //     value: 'url'
    //   }
    // ],
    // provider: 'google',
    db.users.getUserByGoogleId(profile.id).then(async user => {
        if (user) {
            return done(null, { id: user.id });
        } else {
            const verifiedEmails = profile.emails.filter(e => e.verified);
            if (verifiedEmails.length === 0) {
                return done(new Error("No verified email"));
            }
            const email = verifiedEmails[0].value;
            return db.users.createGoogleUserWithRandomName({email, googleId: profile.id }).then(id => {
                return done(null, { id });
            });
        }
    }).catch(error => {
        done(error);
    });
}