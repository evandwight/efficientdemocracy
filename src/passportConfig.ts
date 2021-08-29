const LocalStrategy = require("passport-local").Strategy;
import { UserId } from './db/types';
import db from './db/databaseApi';
const bcrypt = require("bcrypt");

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
      interface User {
          id: UserId;
      }
  }
}

function initialize(passport) {
  const authenticateUser = (email, password, done) => {
    db.users.getUserByEmail(email).then((user) => {
      // console.log("user", user)
      if (user === null) {
        return done(null, false, {
          message: "Incorrect email or password"
        });
      } else {
        // console.log("bcrypt", password, user.password)
        bcrypt.compare(password, user.password).then(isMatch => {
          if (isMatch) {
            // console.log("Login success");
            return done(null, user);
          } else {
            // console.log("Login failed. Password mismatch");
            return done(null, false, { message: "Incorrect email or password" });
          }
        }).catch(error => {
          console.log(error);
          return done(error);
        });
      }
    }).catch(error => {
      console.log(error);
      return done(error);
    });
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      authenticateUser
    )
  );
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

module.exports = initialize;