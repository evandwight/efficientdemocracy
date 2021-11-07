import React from 'react';
import * as C from '../constant';

export const LocalRegisterForm = ({ csrfToken }) =>
    <form action={C.URLS.USER_LOCAL_REGISTER} method="POST">
        <input type="hidden" name="_csrf" value={csrfToken} />
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