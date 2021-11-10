import React from 'react';
import * as C from '../constant';

export const LocalLogin = ({ message, csrfToken }) =>
    <div>
        <h2>Login</h2>
        {!!message && <p>{message}</p>}
        <LocalLoginForm csrfToken={csrfToken} />
    </div>
export const LocalLoginForm = ({ csrfToken }) =>
    <form action={C.URLS.AUTH_LOCAL} method="POST">
        <input type="hidden" name="_csrf" value={csrfToken} />
        <div>
            <input type="email" id="login-email" name="email" placeholder="Email" required />
        </div>
        <div>
            <input type="password" id="login-password" name="password" placeholder="Password" required />
        </div>
        <div>
            <input type="submit" value="Login" />
        </div>
    </form>