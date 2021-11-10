import { UnexpectedInternalError } from '../utils';
import * as C from '../../constant';
import { sendEmail } from '../../utils/sendAwsEmail';
import { logger } from '../../logger';

let sentMail = 0;

export async function sendVerificationEmail(user) {
    // TODO rework into active monitoring of mail statistics
    logger.info(`Sent email to ${user.email}`);
    sentMail += 1;
    if (sentMail > 10) {
        throw new UnexpectedInternalError("Sent too many verification emails");
    }

    const verifyLink = `${C.URLS.EMAIL_VERIFY_GOODNESS}good/${user.unsubscribe_key}/${user.id}`;
    const unverifyLink = `${C.URLS.EMAIL_VERIFY_GOODNESS}bad/${user.unsubscribe_key}/${user.id}`;
    return sendEmail({
        from: "info@efficientdemocracy.com",
        to: user.email,
        subject: "Please verify your email address",
        text: `Hello!

Your email was used to sign up for Efficient Democracy. 

To verify your email click ${verifyLink}

If you did not expect to receive this email click ${unverifyLink}

Have a good day!`
    });
}
