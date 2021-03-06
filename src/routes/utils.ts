import db from "../db/databaseApi";
import * as C from "../constant";
import assert from "assert";
import { StrikesInfo } from "../services/democraticModerationService/types";

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

export async function assertMiniMod(req, res, next) {
    if (req.isAuthenticated()) {
        const user = await db.users.getUser(req.user.id);

        if (user.is_mini_mod) {
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

export function snakeToCamelCase(s) {
    return s.replace(/([-_][a-z])/ig, ($1) => {
        return $1.toUpperCase()
            .replace('_', '');
    });
}

export function formToStrikes(body, options: {disallowStrikeDisputers?: boolean} = {}): StrikesInfo {
    let strikes = Object.fromEntries(["strike_ups", "strike_downs", "strike_poster", "strike_disputers"]
        .map((v) => [snakeToCamelCase(v), body.hasOwnProperty(v)]));
    if (options.disallowStrikeDisputers) {
        strikes.strikeDisputers = false;
    }
    return strikes;
}

export function assertEnv(name) {
    if (!process.env[name]) {
        throw new Error(`Undefined environment varible ${name}`);
    }
}

export function validationAssert(value: boolean, message: string, code: number) {
    if (!value) {
        throw new ValidationError(message, code);
    }
}

export class ValidationError extends Error {
    code: number;
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

export class ExpectedInternalError extends Error {
    err: Error;
    constructor(err) {
        super(err.message);
        this.err = err;
    }
}

export function unexpectedAssert(value: boolean, message: string) {
    if (!value) {
        throw new UnexpectedInternalError(message);
    }
}

export class UnexpectedInternalError extends Error {
}