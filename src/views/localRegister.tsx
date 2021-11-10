import React from 'react';
import * as C from '../constant';
import { assertEnv } from '../routes/utils';

assertEnv('GOOGLE_CAPTCHA_SITE_KEY');

export const LocalRegisterForm = ({ csrfToken }) =>
    <form action={C.URLS.USER_LOCAL_REGISTER} method="POST"
        id="register-form"
        data-site-key={process.env.GOOGLE_CAPTCHA_SITE_KEY}
        data-action={C.REGISTER_FORM_ACTION}>
        <input type="hidden" name="_csrf" value={csrfToken} />
        <input id="register-form-token" type="hidden" name="_captchatoken" value="" />
        <div>
            <input type="email" id="email" name="email" placeholder="Email" required />
        </div>
        <div>
            <input type="password" id="password" name="password" placeholder="Password" required />
        </div>
        <div>
            <input type="submit" value="Register" />
        </div>
    </form>