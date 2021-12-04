import React from 'react';
import { Checkbox } from './utils';
import * as C from '../constant';

export const UserSettings = ({ user, csrfToken }) => {
    return <div className="highlight-links">
        <h1>User settings</h1>
        <div>User name: {user.user_name}</div>
        <div><a href={C.URLS.CHANGE_EMAIL}>Change</a> your email</div>
        <br />
        <form action={C.URLS.SUBMIT_USER_SETTINGS} method="POST" autoComplete="off">
            <input type="hidden" name="_csrf" value={csrfToken} />
            <Checkbox name={C.USER.COLUMNS.send_emails} label="Would you like the weekly newsletter?" checked={user.send_emails} />
            <Checkbox name={C.USER.COLUMNS.wants_mod} label="Would you like to be the moderator?" checked={user.wants_mod} />
            <Checkbox name={C.USER.COLUMNS.wants_proxy} label="Would you like to be a proxy?" checked={user.wants_proxy} />
            <h4>Democratic moderation:</h4>
            <DmRadio id={C.USER.DM_PARICIPATE.no} label="don't particpate" user={user}>
            </DmRadio>
            <DmRadio id={C.USER.DM_PARICIPATE.proxy} label="use a proxy" user={user}>
                <div><a href={C.URLS.VIEW_PROXY}>Change</a> your proxy</div>
            </DmRadio>
            <DmRadio id={C.USER.DM_PARICIPATE.direct} label="do it yourself" user={user}>
                <div><a href={C.URLS.VIEW_MOD_VOTE}>Change</a> your vote for moderator</div>
            </DmRadio>
            <div>
                <input type="submit" value="Submit" />
            </div>
        </form>
    </div>
}

export const DmRadio = ({ id, label, user, children }) =>
    <div>
        <input className="onclick-dm-particpate-radio"
            type="radio"
            id={`dm_participate_${id}`}
            name={C.USER.COLUMNS.dm_participate}
            value={id}
            defaultChecked={user.dm_participate === id} />
        <label htmlFor={id}>{label}</label>
        <div className="card" 
            id={`dm_participate_${id}_details`} 
            style={{display: user.dm_participate === id ? "block" : "none"}}>
            {children}        
        </div>
    </div>