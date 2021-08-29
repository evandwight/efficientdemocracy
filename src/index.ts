import express from "express";
import db from "./db/databaseApi";
import passport from "passport";
import session from "express-session";
import csrf from 'csurf';
import { addAsync } from '@awaitjs/express';
import * as Routes from './routes';
const initializePassport = require("./passportConfig");
import { assertAuthenticated, assertAuthenticated401, assertNotBanned, assertMod, redirectAuthenticated, assertNotBanned403 } from './routes/utils';
import {addCustomLocals} from './utils';
import * as C from "./constant";
import {runTasks} from "./batch";
import * as About from './views/about';
import { renderAbout } from './routes/about';
import { renderBlog } from './routes/blog';
import * as Blog from './views/blog';
const pgSession = require('connect-pg-simple')(session);

// Setup
require("dotenv").config();

function setup(db) {
  db.initialize();

  const app = express();


  // Middleware

  app.disable('x-powered-by');

  // Parses details from a form
  app.use(express.urlencoded({ extended: false }));

  // Static files
  app.use('/public', express.static(__dirname + '/../public'));

  // Sessions
  app.use(session({
    store: new (pgSession)({ pool: db.realPool }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: true
    }
  }));

  // Authentication
  initializePassport(passport);
  app.use(passport.initialize());
  app.use(passport.session()); // Store our variables to be persisted across the whole session. Works with app.use(Session) above

  // Cross site scripting protection
  const csrfProtection = csrf({ cookie: false });
  app.use(csrfProtection);

  // Custom local variables
  app.use(addCustomLocals);

  const router = addAsync(app);

  // Routes
  router.get("/favicon.ico", (req, res) => res.sendFile('favicon.ico', {root: __dirname + '/../public'}))
  router.get("/", (req, res) => res.redirect(C.URLS.QPOSTS));


  // Misc
  router.get(C.URLS.SORT, Routes.Misc.Sort);

  // About
  router.get(C.URLS.ABOUT_WHAT_IS_THIS, renderAbout(About.WhatIsThis, "What is this?"));
  router.get(C.URLS.ABOUT_FAQ, renderAbout(About.Faq  , "Faq"));
  router.get(C.URLS.ABOUT_DEMOCRATIC_MODERATION, renderAbout(About.DemocraticModeration  , "Democratic moderation"));
  router.get(C.URLS.ABOUT_MODERATE_VISIBILITY, renderAbout(About.ModerateVisibilty  , "Moderate visibility"));
  router.get(C.URLS.ABOUT_STATUS, renderAbout(About.Alpha  , "Alpha"));

  // Blog
  router.get(C.URLS.BLOG + "(/:page)?", Routes.Blog.index);
  router.get(C.URLS.BLOG_REACT_STATIC_RENDER, renderBlog(Blog.ReactStaticRender));

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
  // app.getAsync("/samples/:thingId", Routes.Sample.viewSamples);
  router.postAsync(C.URLS.SUBMIT_SAMPLE_VOTE + ":sampleId", assertAuthenticated, Routes.Sample.submitSampleVote);
  router.getAsync(C.URLS.VIEW_SAMPLES + ":thingId", Routes.Sample.viewSamples);
  router.getAsync(C.URLS.VIEW_SAMPLE_RESULT + ":sampleId", Routes.Sample.viewSampleResult);

  // // Mods
  // app.getAsync("/mods", assertAuthenticated, Routes.Mods.splash);
  // router.postAsync("/submit/mod_vote", assertAuthenticated, Routes.Mods.submitVote);
  router.getAsync(C.URLS.QPOSTS_MOD_ACTIONS + ":id", assertMod, Routes.Mods.viewPostActions);
  router.postAsync(C.URLS.SUBMIT_QPOST_MOD_ACTION + ":field/:id", assertMod, Routes.Mods.submitPostAction);


  // Accounts
  router.get(C.URLS.USER_LOGIN, redirectAuthenticated, Routes.Account.login);
  router.post(C.URLS.USER_LOGIN, passport.authenticate("local", { successRedirect: "/", failureRedirect: C.URLS.USER_LOGIN }));
  router.get(C.URLS.USER_REGISTER, redirectAuthenticated, Routes.Account.register);
  router.postAsync(C.URLS.USER_REGISTER, Routes.Account.userRegister);
  router.get(C.URLS.USER_LOGOUT, Routes.Account.logout);

  router.getAsync(C.URLS.USER_STRIKES, assertAuthenticated, Routes.Account.strikes);
  router.get(C.URLS.USER_SETTINGS, assertAuthenticated, Routes.Account.userSettings);

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
}

export {setup};

