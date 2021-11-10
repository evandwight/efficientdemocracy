import { reactRender } from '../../views/utils';
import db from '../../db/databaseApi';
import validator from 'validator';
import { ExpectedInternalError, UnexpectedInternalError, validationAssert, ValidationError } from '../utils';
import * as C from '../../constant';
import bcrypt from 'bcrypt';
import { LocalLogin } from '../../views/localLogin';
import axios, { AxiosResponse } from 'axios';
import { logger } from '../../logger';
import { sendVerificationEmail } from "./sendVerificationEmail";


export function viewLocalLogin(req, res) {
    let message = req.flash('error');
    let { csrfToken } = res.locals;
    reactRender(res, LocalLogin({ message, csrfToken }), { showLogin: false, title: "Login" });
}

export async function submitUserRegister(req, res) {
    const { email, password } = req.body;

    validationAssert(password.length >= 6, "Password must be at least 6 characters", 400);
    validationAssert(validator.isEmail(email), "Invalid email", 400);
    await assertCaptchaToken(req.body['_captchatoken'], req.ip);

    const user = await db.users.getUserByEmail(email);
    // TODO this leaks the registered email addresses
    validationAssert(user === null, `Email already registered. Contact ${C.HELP_EMAIL} for help.`, 400);

    // Validation passed
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = await db.users.createLocalUserWithRandomName({ email, hashedPassword });
    const newUser = await db.users.getUser(id);

    // Sending emails will fail sometimes because it is a separate service
    sendVerificationEmail(newUser).catch(err => logger.warn({ err }, "Failed to send verification email"));

    res.redirect(C.URLS.USER_LOCAL_LOGIN);
}

export async function assertCaptchaToken(token, ip) {
    if (!token) {
        throw new ValidationError("No google captcha token found", 400);
    }

    const body = `secret=${process.env.GOOGLE_CAPTCHA_SECRET_KEY}&response=${token}&remoteip=${ip}`;
    const response: AxiosResponse<{ success: boolean; score: number; action: string; 'error-codes': any; }>
        = await axios.post("https://www.google.com/recaptcha/api/siteverify", body)
            .catch(err => { throw new ExpectedInternalError(err); });
    // External service so expect it to fail sometimes
    if (response.status !== 200) {
        throw new ExpectedInternalError(new Error(`Captcha request failed ${response.status}`));
    }

    const { data } = response;
    // We are providing the wrong arguments to google
    if (!data.success) {
        throw new UnexpectedInternalError(`Captcha success false ${JSON.stringify(data['error-codes'])}`);
    }
    // TODO I don't know what this checks
    // Either user tampered with the form or wrong captcha is being used
    if (data.action !== C.REGISTER_FORM_ACTION) {
        throw new ValidationError(`Invalid google captcha action ${data.action}`, 400);
    }
    if (data.score < 0.5) {
        throw new ValidationError(`Captcha failed. Contact ${C.HELP_EMAIL} for help.`, 400);
    }
}
