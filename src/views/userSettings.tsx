import React from 'react';
import { Checkbox } from './utils';
import * as C from  '../constant';

export const UserSettings = ({user, csrfToken}) =>
  <div className="highlight-links">
    <h1>User settings</h1>
    <div>User name: {user.user_name}</div>
    <div>Email: {user.email}</div>
    <div><a href={C.URLS.VIEW_MOD_VOTE}>Change</a> your vote for moderator</div>
    <br/>
    <form action={C.URLS.SUBMIT_USER_SETTINGS} method="POST">
      <input type="hidden" name="_csrf" value={csrfToken} />
      <Checkbox name="send_emails" label="Would you like to get emails from us?" checked={user.send_emails}/>
      <Checkbox name="wants_mod" label="Would you like to be the moderator?" checked={user.wants_mod}/>
      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>
  </div>
