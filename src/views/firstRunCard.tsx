import React from 'react';
import * as C from "../constant";
import {Checkbox} from "./utils";

export const FirstRunCard = ({user, csrfToken}) => {
  return <div className="card">
    <form action={C.URLS.SUBMIT_USER_SETTINGS} method="POST">
      <input type="hidden" name="_csrf" value={csrfToken} />
      <input type="hidden" name="_set_first_run_complete" value={1} />
      <Checkbox name="send_emails" label="Would you like to get emails from us?" checked={user.send_emails}/>
      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>
  </div>;
}