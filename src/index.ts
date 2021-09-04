import express from "express";
import db from "./db/databaseApi";
import passport from "passport";
import session from "express-session";
import csrf from 'csurf';
import { addAsync } from '@awaitjs/express';
import * as Routes from './routes';
import { assertAuthenticated, assertAuthenticated401, assertNotBanned, assertMod, redirectAuthenticated, assertNotBanned403 } from './routes/utils';
import { addCustomLocals } from './utils';
import * as C from "./constant";
import { runTasks } from "./batch";
import * as About from './views/about';
import { renderAbout } from './routes/about';
import { BLOG_ENTRIES, renderBlog } from './routes/blog';
import helmet from 'helmet';
import { logger } from './logger';
import hpp from 'hpp';
import toobusy from 'toobusy-js'
const pgSession = require('connect-pg-simple')(session);
import * as GooglePassport from "./googlePassportConfig";

// Setup
require("dotenv").config();

function setup(db) {
  db.initialize();

  const app = express();


  // Middleware

  // security settings:
  app.use(hpp()); // HTTP Parameter Pollution(HPP)
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        "script-src-attr": null, // firefox doesn't support but uses "script-src" value 'self'
        "script-src": ["'self'"],
      },
    })
  );

  app.use(function (req, res, next) {
    if (toobusy()) {
      // log if you see necessary
      res.status(503).send("Server Too Busy");
    } else {
      next();
    }
  });

  // Parses details from a form
  app.use(express.urlencoded({ extended: false }));

  // Static files
  // use before session, otherwise it creates multiple sessions on each page load
  // https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive
  app.use('/public', express.static(__dirname + '/../public'));

  // Sessions
  let sessionOptions: any = {
    store: new (pgSession)({ pool: db.realPool }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "sesId-d48s",
    cookie: {
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60 * 1000, // 365 days
    }
  };
  if (process.env.NODE_ENV === "production") {
    app.set('trust proxy', 1) // trust first proxy
    sessionOptions.cookie.secure = true // serve secure cookies
  }
  app.use(session(sessionOptions));

  // Authentication
  GooglePassport.initialize(passport);
  app.use(passport.initialize());
  app.use(passport.session()); // Store our variables to be persisted across the whole session. Works with app.use(Session) above

  // Cross site scripting protection
  const csrfProtection = csrf({ cookie: false });
  app.use(csrfProtection);

  // Custom local variables
  app.use(addCustomLocals);
  app.use((req, res, next) => {
    const excludeUrls = [C.URLS.FIRST_RUN_SETUP, C.URLS.USER_LOGOUT];
    if (req.isAuthenticated() && res.locals.user.first_run && excludeUrls.indexOf(req.url) === -1) {
      res.redirect(C.URLS.FIRST_RUN_SETUP);
    } else {
      next();
    }
  })


  const router = addAsync(app);

  // Routes
  router.get("/favicon.ico", (req, res) => res.sendFile('favicon.ico', { root: __dirname + '/../public' }))
  router.get("/", (req, res) => res.redirect(C.URLS.QPOSTS));


  // Misc
  router.get(C.URLS.SORT, Routes.Misc.Sort);

  // // Qiri Posts
  router.getAsync(C.URLS.QPOSTS + "(/:page)?", Routes.QPost.list);
  router.getAsync(C.URLS.NEW_QPOSTS + "(/:page)?", Routes.QPost.listNew);
  router.getAsync(C.URLS.DEEPLY_IMPORTANT_QPOSTS + "(/:page)?", Routes.QPost.listDeeplyImportant);

  router.getAsync(C.URLS.QPOSTS_VIEW + ":id", Routes.QPost.viewPost);
  router.getAsync(C.URLS.SUBMIT_QPOST, [assertAuthenticated, assertNotBanned], Routes.QPost.viewSubmitPost);
  router.postAsync(C.URLS.SUBMIT_QPOST, [assertAuthenticated, assertNotBanned], Routes.QPost.submitPost);
  router.postAsync(C.URLS.SUBMIT_QPOST_VOTE + ":postId/:vote", [assertAuthenticated401, assertNotBanned403], Routes.QPost.submitVote);

  router.postAsync(C.URLS.SUBMIT_QPOST_DISPUTE + ":postId/:field/:should_be", [assertAuthenticated401, assertNotBanned403], Routes.QPost.submitDispute);


  // // Samples
  router.postAsync(C.URLS.SUBMIT_SAMPLE_VOTE + ":sampleId", assertAuthenticated, Routes.Sample.submitSampleVote);
  router.getAsync(C.URLS.VIEW_SAMPLES + ":thingId", Routes.Sample.viewSamples);
  router.getAsync(C.URLS.VIEW_SAMPLE_RESULT + ":sampleId", Routes.Sample.viewSampleResult);

  // // Mods
  router.getAsync(C.URLS.QPOSTS_MOD_ACTIONS + ":id", assertMod, Routes.Mods.viewPostActions);
  router.postAsync(C.URLS.SUBMIT_QPOST_MOD_ACTION + ":field/:id", assertMod, Routes.Mods.submitPostAction);


  // Accounts
  router.get(C.URLS.USER_LOGIN, redirectAuthenticated, Routes.Account.login);
  router.get(C.URLS.USER_LOGOUT, Routes.Account.logout);

  router.getAsync(C.URLS.USER_STRIKES, assertAuthenticated, Routes.Account.strikes);
  router.get(C.URLS.USER_SETTINGS, assertAuthenticated, Routes.Account.userSettings);

  // About
  router.get(C.URLS.ABOUT_LEGAL, renderAbout(About.Legal, "Legal"));
  router.get(C.URLS.ABOUT_PRIVACY, renderAbout(About.Privacy, "Privacy"));
  router.get(C.URLS.ABOUT_TERMS_OF_SERVICE, renderAbout(About.TermsOfService, "Terms of service"));
  router.get(C.URLS.ABOUT_WHAT_IS_THIS, renderAbout(About.WhatIsThis, "What is this?"));
  router.get(C.URLS.ABOUT_FAQ, renderAbout(About.Faq, "Faq"));
  router.get(C.URLS.ABOUT_DEMOCRATIC_MODERATION, renderAbout(About.DemocraticModeration, "Democratic moderation"));
  router.get(C.URLS.ABOUT_MODERATE_VISIBILITY, renderAbout(About.ModerateVisibilty, "Moderate visibility"));
  router.get(C.URLS.ABOUT_STATUS, renderAbout(About.Alpha, "Alpha"));

  // Blog
  router.get(C.URLS.BLOG + "(/:page)?", Routes.Blog.index);
  BLOG_ENTRIES.forEach(entry => router.get(entry.url, renderBlog(entry)));

  // Google
  router.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', "https://www.googleapis.com/auth/userinfo.email"] }));
  router.get('/auth/google/callback', passport.authenticate('google', { successRedirect: "/", failureRedirect: C.URLS.USER_LOGIN }));

  router.get(C.URLS.FIRST_RUN_SETUP, Routes.FirstRunSetup.firstRunSetup);
  router.postAsync(C.URLS.FIRST_RUN_SETUP, Routes.FirstRunSetup.submitFirstRunSetup);



  // Custom error handler
  router.use(function (err, req, res, next) {
    logger.error({ severity: "error", url: req.originalUrl, method: req.method, ip: req.ip, message: err.message, stack: err.stack, time: Date.now() });
    if (process.env.NODE_ENV !== "production") {
      console.log(err);
    }
    res.sendStatus(500);
  });

  return router;
}

// start the Express server
if (require.main === module) {
  console.log("Main mode");
  const router = setup(db);
  const PORT = process.env.PORT || 3000;
  router.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
  });

  setInterval(runTasks, 5 * 60 * 1000);


  process.on("uncaughtException", function (err) {
    logger.error({ severity: "error", message: err.message, stack: err.stack, time: Date.now() });
    process.exit(); // exit the process to avoid unknown state
  });
}

export { setup };

