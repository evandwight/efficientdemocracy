import db from "../db/databaseApi";
import * as C from "../constant";
import assert from "assert";

export function assertAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        return res.redirect(C.URLS.USER_LOGIN);
        // res.sendStatus(401);
    }
}

export function assertAuthenticated401(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        return res.sendStatus(401);
    }
}

export function assertNotBanned403(req, res, next) {
    if (res.locals.user.is_banned) {
        return res.sendStatus(403)
    }
    else {
        next();
    }
}

export function assertNotBanned(req, res, next) {
    if (res.locals.user.is_banned) {
        return res.redirect(C.URLS.USER_STRIKES);
    }
    else {
        next();
    }
}

export async function assertMod(req, res, next) {
    if (req.isAuthenticated()) {
        const user = await db.users.getUser(req.user.id);

        if (user.is_mod) {
            next();
            return;
        }
    }
    res.sendStatus(401);
}

export function redirectAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    else {
        next();
    }
}

export function assertFieldExists(field) {
    assert(C.FIELDS.LIST.indexOf(field) !== -1, "Invalid field");
}