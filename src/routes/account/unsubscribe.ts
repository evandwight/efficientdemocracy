import db from '../../db/databaseApi';
import validator from 'validator';
import { validationAssert } from '../utils';
import * as C from '../../constant';



export async function unsubscribe(req, res) {
    const { keyId, userId } = req.params;
    // Always send the same error code for invalid requests to avoid leaking information
    const validateRequestAssert = (value) => validationAssert(value, "Invalid request arguments", 400);

    validateRequestAssert(validator.isUUID(keyId, 4));
    validateRequestAssert(validator.isUUID(userId, 4));

    const user = await db.users.getUser(userId);
    validateRequestAssert(user.unsubscribe_key === keyId);

    await db.users.setSetting(userId, C.USER.COLUMNS.send_emails, false);
    res.send("You have successfully unsubscribed from all emails. To change your settings more go to user settings.");
}
