import express from "express";
import db from "./db/databaseApi";
import passport from "passport";
import session from "express-session";
import csrf from 'csurf';
import { addAsync } from '@awaitjs/express';
import * as Routes from './routes';
import { assertAuthenticated, assertAuthenticated401, assertNotBanned, assertMod, redirectAuthenticated, assertNotBanned403, ValidationError, assertMiniMod, ExpectedInternalError } from './routes/utils';
import { addCustomLocals } from './utils/middleware';
import * as C from "./constant";
import { runTasks } from "./batch";
import { renderAbout } from './routes/about';
import * as About from './views/about';
import { BlogEntries } from './views/blog';
import { renderBlog } from './routes/blog';
import helmet from 'helmet';
import { logger } from './logger';
import hpp from 'hpp';
import toobusy from 'toobusy-js'
const pgSession = require('connect-pg-simple')(session);
import { initializePassport } from './passportConfig';
import flash from 'connect-flash';

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
                "script-src": [
                    "'self'",
                    "'sha256-X+zrZv/IbzjZUnhsbWlsecLbwjndTpG0ZynXOif7V+k='" // for script "0" workaround firefox fouc bug https://bugzilla.mozilla.org/show_bug.cgi?id=1404468
                ],
            },
        })
    );
    // needed for redirecting form submissions
    app.use(helmet.referrerPolicy({ policy: "same-origin" }));
    // Disable csp for register page to allow for google captcha
    const registerCSP = helmet.contentSecurityPolicy({
        useDefaults: true,
        directives:{
            "script-src": ["*", "'unsafe-inline'"],
            "style-src": ["*", "'unsafe-inline'"],
            "default-src": ["*"],
        }});

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
    app.use('/public', express.static(__dirname + '/../public', { maxAge: '31557600' })); // 1 year

    // Sessions
    let sessionOptions: any = {
        store: new (pgSession)({ pool: db.pool.getSessionPool() }),
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

    app.use(flash());

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
    router.get("/favicon.ico", (req, res) => res.sendFile('favicon.ico', { root: __dirname + '/../public' }))
    router.get("/", (req, res) => res.redirect(C.URLS.DEEPLY_IMPORTANT_QPOSTS));


    // Misc
    router.get(C.URLS.SORT, Routes.Misc.Sort);

    // // Qiri Posts
    router.getAsync(C.URLS.QPOSTS + "/:page?", Routes.QPost.list);
    router.getAsync(C.URLS.NEW_QPOSTS + "/:page?", Routes.QPost.listNew);
    router.getAsync(C.URLS.DEEPLY_IMPORTANT_QPOSTS + "/:page?", Routes.QPost.listDeeplyImportant);
    router.getAsync(C.URLS.TECHNICAL_QPOSTS + "/:page?", Routes.QPost.listTechnical);

    router.getAsync(C.URLS.FROZEN_QPOSTS + ":key/:page?", Routes.QPost.listFrozen);

    router.getAsync(C.URLS.QPOSTS_VIEW + ":id", Routes.QPost.viewPost);
    router.getAsync(C.URLS.SUBMIT_QPOST, [assertAuthenticated, assertNotBanned], Routes.QPost.viewSubmitPost);
    router.postAsync(C.URLS.SUBMIT_QPOST, [assertAuthenticated, assertNotBanned], Routes.QPost.submitPost);
    router.postAsync(C.URLS.SUBMIT_QPOST_VOTE + ":postId/:vote", [assertAuthenticated401, assertNotBanned403], Routes.QPost.submitVote);

    router.postAsync(C.URLS.SUBMIT_QPOST_DISPUTE + ":postId/:field/:should_be", [assertAuthenticated401, assertNotBanned403], Routes.QPost.submitDispute);


    // Samples
    router.postAsync(C.URLS.SUBMIT_SAMPLE_VOTE + ":sampleId", assertAuthenticated, Routes.Sample.submitSampleVote);
    router.getAsync(C.URLS.VIEW_SAMPLES + ":thingId", Routes.Sample.viewSamples);
    router.getAsync(C.URLS.VIEW_SAMPLE_RESULT + ":sampleId", Routes.Sample.viewSampleResult);

    // ModVote
    router.getAsync(C.URLS.VIEW_MOD_VOTE, assertAuthenticated, Routes.ModVote.viewModVote);
    router.postAsync(C.URLS.SUBMIT_MOD_VOTE + ":vote", assertAuthenticated, Routes.ModVote.submitModVote);

    // Mods
    router.getAsync(C.URLS.QPOSTS_MOD_ACTIONS + ":id", assertMod, Routes.Mods.viewPostActions);
    router.postAsync(C.URLS.SUBMIT_QPOST_MOD_ACTION + ":field/:id", assertMod, Routes.Mods.submitPostAction);
    router.getAsync(C.URLS.MOD_VIEW_MINI_MODS, assertMod, Routes.Mods.viewSetMiniMods);
    router.postAsync(C.URLS.MOD_SUBMIT_SET_MINI_MOD + ":userId/:value", assertMod, Routes.Mods.setMiniMod);

    // Mini mods
    router.getAsync(C.URLS.QPOSTS_MINI_MOD_ACTIONS + ":id", assertMiniMod, Routes.MiniMods.viewPostActions);
    router.postAsync(C.URLS.SUBMIT_QPOST_MINI_MOD_ACTION + ":field/:id", assertMiniMod, Routes.MiniMods.submitPostAction);

    // Accounts
    router.get(C.URLS.USER_LOGIN, registerCSP, redirectAuthenticated, Routes.Account.login);
    router.get(C.URLS.USER_LOGOUT, Routes.Account.logout);

    router.getAsync(C.URLS.USER_STRIKES, assertAuthenticated, Routes.Account.strikes);
    router.get(C.URLS.USER_SETTINGS, assertAuthenticated, Routes.Account.userSettings);
    router.postAsync(C.URLS.SUBMIT_USER_SETTINGS, assertAuthenticated, Routes.Account.submitUserSettings);
    router.postAsync(C.URLS.SUBMIT_USER_FIRST_RUN, assertAuthenticated, Routes.Account.submitFirstRun);
    router.postAsync(C.URLS.SUBMIT_USER_REQUEST_VERIFY_EMAIL, assertAuthenticated, Routes.Account.submitFirstRun);

    // Passport 

    // * Local
    router.get(C.URLS.USER_LOCAL_LOGIN, redirectAuthenticated, Routes.Account.viewLocalLogin);
    router.postAsync(C.URLS.USER_LOCAL_REGISTER, redirectAuthenticated, Routes.Account.submitUserRegister);
    router.post(C.URLS.AUTH_LOCAL, redirectAuthenticated,
        passport.authenticate("local", { successRedirect: "/", failureRedirect: C.URLS.USER_LOCAL_LOGIN, failureFlash: true }));

    // * Google
    router.get(C.URLS.AUTH_GOOGLE, redirectAuthenticated,
        passport.authenticate('google', {
            scope: [
                'https://www.googleapis.com/auth/plus.login'
                , "https://www.googleapis.com/auth/userinfo.email"]
        }));
    router.get(C.URLS.AUTH_GOOGLE_CALLBACK, redirectAuthenticated,
        passport.authenticate('google', { successRedirect: "/", failureRedirect: C.URLS.USER_LOGIN }));


    // About
    Object.values(About).forEach(e => router.get(e.url, renderAbout(e.element, e.title)));

    // Blog
    router.get(C.URLS.BLOG + "(/:page)?", Routes.Blog.index);
    Object.values(BlogEntries).forEach(entry => router.get(entry.url, renderBlog(entry)));

    // Email
    // Unsecure - get changes database state so it should be post, however it needs to be embedded in links in emails
    router.getAsync(C.URLS.EMAIL_UNSUBSCRIBE + ':userId/:keyId', Routes.Account.unsubscribe);
    router.getAsync(C.URLS.EMAIL_VERIFY_GOODNESS + ':goodness/:userId/:keyId', Routes.Account.verifyEmailGoodness);

    // Custom 404 page not found
    // Disable on test to allow login
    if (process.env.NODE_ENV !== "test") {
        app.use(function () {
            throw new ValidationError("Page not found", 404);
        })
    }

    // Custom error handler
    router.use(function (err, req, res, next) {
        if (err) {
            if (process.env.NODE_ENV !== "production") {
                console.log(err);
            }
            if (err instanceof ValidationError) {
                logger.warn({ req, err }, "Request validation error");
                res.status(err.code).send(`Error: ${err.message}`);
            } else if (err instanceof ExpectedInternalError) {
                logger.warn({ req, err }, "Expected internal error");
                res.status(500).send(`Error handling request`);
            } else if (err.code === 'EBADCSRFTOKEN') {
                logger.warn({ req, err }, "Invalid csrf");
                res.status(400).send(`Invalid request`);
            } else {
                logger.error({ req, err }, "Error handling request");
                res.sendStatus(500);
            }
        } else {
            next();
        }
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

    setInterval(async () => {
        try {
            await runTasks()
        } catch (err) {
            logger.error({ err }, "Failed running tasks");
        }
    }, 5 * 60 * 1000);


    process.on("uncaughtException", function (err) {
        logger.fatal({ err }, "Uncaught exception");
        if (process.env.NODE_ENV !== 'production') {
            console.log(err);
        }
        process.exit(); // exit the process to avoid unknown state
    });
}

export { setup };