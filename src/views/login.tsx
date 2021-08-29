import React from 'react';
import * as C from "../constant";

export const Login = ({ errors, csrfToken }) =>
  <div>
    <h1>Login</h1>

    {(typeof errors != 'undefined') &&
      <ul>
        {errors.map(error =>
          (<li> {error.message}</li>))}
      </ul>}

    <form action={C.URLS.USER_LOGIN} method="POST">
      <input type="hidden" name="_csrf" value={csrfToken} />
      <div>
        <input type="email" id="email" name="email" placeholder="Email" required />
      </div>
      <div>
        <input type="password" id="password" name="password" placeholder="Password" required />
      </div>
      <div>
        <input type="submit" value="Login" />
      </div>

      <p>Don't have an account? <b><a href={C.URLS.USER_REGISTER}>Register</a></b></p>
    </form>
  </div>