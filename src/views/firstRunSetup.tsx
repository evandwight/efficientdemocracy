import React from 'react';
import * as C from "../constant";
import {Checkbox} from './utils';

export const FirstRunSetup = ({ csrfToken }) =>
  <div>
    <h1>Account setup</h1>
    <form action={C.URLS.FIRST_RUN_SETUP} method="POST">
      <input type="hidden" name="_csrf" value={csrfToken} />
      <Checkbox name="send_emails" label="Would you like to get emails from us?" checked={false}/>
      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>
  </div>