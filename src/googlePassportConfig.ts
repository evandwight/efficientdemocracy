const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
import db from './db/databaseApi';

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://efficientdemocracy.com/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        console.log("Google login success:", profile);
        db.users.getUserByGoogleId(profile.id).then(user => {
            console.log("Found user", user);
            if (user) {
                return done(null, {id: user.id});
            } else {
                return db.users.createGoogleUser({userName:"userName", email: "email", googleId: profile.id}).then(id => {
                    console.log("Created user", id);
                    done(null, {id});
                });
            }
        }).catch(error => {
            console.log(error);
            done(error);
        });
    }
));