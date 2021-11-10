const LocalStrategy = require("passport-local").Strategy;
import db from '../db/databaseApi';
import bcrypt from 'bcrypt';
import * as C from '../constant';

const gibberishPassword = "$2b$10$.jkelwkOZZ10C0FBaMBPs.KCUDIhlPFjaFGjcUY7ZwsiPRLrWE.Vy";

export async function authenticateUser(email, password, done) {
    try {
        const user = await db.users.getUserByEmail(email);
        const isMatch = await bcrypt.compare(password, !!user ? user.password : gibberishPassword);
        if (user === null
            || user.auth_type !== C.AUTH_TYPE.LOCAL
            || !isMatch) {

            done(null, false, { message: "Incorrect email or password" });
            return;
        } else {
            return done(null, user);
        }
    } catch (err) {
        done(err);
    }
}

export const createLocalStrategy = () => {
    return new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        authenticateUser
    )
}