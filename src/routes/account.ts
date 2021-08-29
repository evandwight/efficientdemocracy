const bcrypt = require("bcrypt");
import { reactRender } from '../views/utils';
import db from '../db/databaseApi';
import { Login } from '../views/login';
import { Register } from '../views/register';
import { Strikes } from '../views/strikes';
import {UserSettings} from '../views/userSettings';
import * as C from "../constant";
import validator from 'validator';

export const USERNAME_REGEX = RegExp('[A-Za-z0-9_]*');

export function login(req, res) {
    const {errors, csrfToken} = res.locals;
    reactRender(res, Login({errors, csrfToken}), {showLogin: false, title:"Login"});
}

export function register(req, res) {
    const {errors, csrfToken} = res.locals;
    reactRender(res, Register({errors, defaultValues:{}, csrfToken}), {showLogin:false, title:"Register"});
}

export async function userRegister(req, res) {
    let { userName, name, email, password, password2, code } = req.body;
    let errors = [];

    console.log({
        userName,
        name,
        email,
        password,
        password2
    });

    if (code != process.env.LOGIN_CODE){
        errors.push({ message: "Invalid code" });
    }

    if (!userName || !name || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
    }

    if (!USERNAME_REGEX.test(userName)) {
        errors.push({ message: "Username may only contain alphanumeric characters and underscore" })
    }

    if (password.length < 6) {
        errors.push({ message: "Password must be a least 6 characters long" });
    }

    if (password !== password2) {
        errors.push({ message: "Passwords do not match" });
    }

    if (!validator.isEmail(email)) {
        errors.push({ message: "Invalid email" });
    }

    const user = await  db.users.getUserByEmail(email)
    if (user !== null) {
        errors.push({message: "Email already registered"});
    }

    if (errors.length > 0) {
        const defaultValues = {userName, name, email, password, password2, code};
        reactRender(res, Register({errors, defaultValues, csrfToken: req.csrfToken()}), {showLogin: false, title:"Register"});
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Validation passed
        return db.users.createUser({ userName, name, email, hashedPassword }).then(() => {
            res.redirect(C.URLS.USER_LOGIN);
        });
    }
}

export async function logout(req, res) {
    req.logout();
    res.redirect("/")
}

export async function strikes(req, res) {
    const {user} = res.locals;
    const strikes = await db.modActions.getStrikes(user.id);
    reactRender(res, Strikes({user, strikes}), {title: "Strikes"});
}

export async function userSettings(req, res) {
    const {user} = res.locals;
    reactRender(res, UserSettings({user}), {title: "User settings"});
}