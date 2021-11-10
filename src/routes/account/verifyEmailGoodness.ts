import db from '../../db/databaseApi';
import validator from 'validator';
import { validationAssert } from '../utils';
import * as C from '../../constant';

export async function verifyEmailGoodness(req, res) {
    // TODO check that verification email was sent within 15 minutes
    const { keyId, userId, goodness } = req.params;
    // Always send the same error code for invalid requests to avoid leaking information
    const validateRequestAssert = (value) => validationAssert(value, "Invalid request arguments", 400);

    validateRequestAssert(validator.isUUID(keyId, 4));
    validateRequestAssert(validator.isUUID(userId, 4));
    validateRequestAssert(goodness === "good" || goodness === "bad");
    const isGood = goodness === "good";

    const user = await db.users.getUser(userId);
    validateRequestAssert(user.unsubscribe_key === keyId);
    validateRequestAssert(user.email_state !== C.USER.EMAIL_STATE.VERIFIED_GOOD
        && user.email_state !== C.USER.EMAIL_STATE.VERIFIED_BAD);

    const emailState = isGood ? C.USER.EMAIL_STATE.VERIFIED_GOOD : C.USER.EMAIL_STATE.VERIFIED_BAD;
    await db.users.setSetting(userId, C.USER.COLUMNS.email_state, emailState);

    const message = isGood
        ? "Your email has been verified"
        : "Your email has been marked as improper";
    res.send(message);
}