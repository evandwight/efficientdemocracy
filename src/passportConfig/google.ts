const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
import * as C from '../constant';
import db from '../db/databaseApi';
import { assertEnv, unexpectedAssert, validationAssert } from '../routes/utils';

assertEnv('GOOGLE_CLIENT_ID');
assertEnv('GOOGLE_CLIENT_SECRET');
assertEnv('GOOGLE_CALLBACK_URL');

export const createGoogleStrategy = () => {
    return new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, verifyGoogleLogin);
}

export async function verifyGoogleLogin(accessToken, refreshToken, profile, done) {
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
    try {
        const user = await db.users.getUserByGoogleId(profile.id);
        if (user) {
            unexpectedAssert(user.auth_type === C.AUTH_TYPE.GOOGLE, "Unexpected auth type");
            return done(null, { id: user.id });
        }
        const verifiedEmails = profile.emails.filter(e => e.verified);
        unexpectedAssert(verifiedEmails.length > 0, "No verified email");
        
        const email = verifiedEmails[0].value;
        const emailAlreadyExists = await db.users.getUserByEmail(email);
        validationAssert(!emailAlreadyExists, "Email already exists", 400);
        const id = await db.users.createGoogleUserWithRandomName({ email, googleId: profile.id });
        return done(null, { id });
    } catch (err) {
        done(err);
    }
}