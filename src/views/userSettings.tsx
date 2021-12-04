import React from 'react';
import { Checkbox } from './utils';
import * as C from '../constant';

export const UserSettings = ({ user, csrfToken }) => {
    return <div className="highlight-links">
        <h1>User settings</h1>
        <div>User name: {user.user_name}</div>
        <div>Email: to change your email send an email to {C.HELP_EMAIL}</div>
        <br />
        <form action={C.URLS.SUBMIT_USER_SETTINGS} method="POST">
            <input type="hidden" name="_csrf" value={csrfToken} />
            <Checkbox name={C.USER.COLUMNS.send_emails} label="Would you like to get emails from us?" checked={user.send_emails} />
            <Checkbox name={C.USER.COLUMNS.wants_mod} label="Would you like to be the moderator?" checked={user.wants_mod} />
            <Checkbox name={C.USER.COLUMNS.wants_proxy} label="Would you like to be a proxy?" checked={user.wants_proxy} />
            <h4>Democratic moderation:</h4>
            <Radio group={C.USER.COLUMNS.dm_participate} id={C.USER.DM_PARICIPATE.no} label="don't particpate" user={user}/>
            <Radio group={C.USER.COLUMNS.dm_participate} id={C.USER.DM_PARICIPATE.proxy} label="use a proxy" user={user}/>
            <Radio group={C.USER.COLUMNS.dm_participate} id={C.USER.DM_PARICIPATE.direct} label="do it yourself" user={user}/>
            <div id="proxy_info">
                <div><a href={C.URLS.VIEW_PROXY}>Change</a> your proxy</div>
            </div>
            <div id="direct_info">
                <div><a href={C.URLS.VIEW_MOD_VOTE}>Change</a> your vote for moderator</div>
            </div>
            <div>
                <input type="submit" value="Submit" />
            </div>
        </form>
    </div>
}

export const Radio = ({ group, id, label, user }) =>
    <div>
        <input type="radio" id={id} name={group} value={id} defaultChecked={user.dm_participate === id}/>
        <label htmlFor={id}>{label}</label>
    </div>