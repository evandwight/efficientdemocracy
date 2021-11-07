import React from 'react';
import * as C from '../constant';
import {LocalLoginForm} from './localLogin';
import {LocalRegisterForm} from './localRegister';

export const Login = ({ csrfToken }) =>
    <div>
        <h3>Google</h3>
        <h4>Login</h4>
        <GoogleLoginButton />
        <h4>Register</h4>
        <GoogleLoginButton />
        <h3>Efficient Democracy</h3>
        <p>
            We recommend using google to authenticate, as currently your password may be leaked.
        </p>
        <h4>Login</h4>
        <LocalLoginForm csrfToken={csrfToken} />
        <h4>Register</h4>
        <LocalRegisterForm csrfToken={csrfToken} />
    </div>

export const GoogleLoginButton = () =>
    <a href={C.URLS.AUTH_GOOGLE}>
        <img style={{ height: "3em" }} src="/public/icons/btn_google_signin_light_normal_web@2x.png" />
    </a>
