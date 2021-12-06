import React from "react";
import * as C from "../constant";
import { FirstRunCard } from './firstRunCard';
import { ViewSampleRequest } from "./viewSampleRequest";

export const Header = ({ options, user, csrfToken }) =>
    <div>
        <table className="bg-blue-400" id="header">
            <tr>
                <td>
                    <a href="/"><b>Efficient Democracy</b></a>
                    <span> </span>
                    <a href={C.URLS.ABOUT_STATUS}>alpha</a>
                    <span> | </span>
                    <a href={C.URLS.ABOUT_WHAT_IS_THIS}>what is this?</a>
                    {user?.is_mod && <span> | <a href={C.URLS.MOD_VIEW_MINI_MODS}>mini-mod</a></span>}
                </td>
                {options.showLogin ? <td id="userInfo"> <LoginInfo user={user} /> </td> : null}
            </tr>
        </table>
        {options.showCards && user?.sample && !user?.first_run
            && <SampleCard user={user} csrfToken={csrfToken} />}
        {options.showCards && user?.first_run
            && <FirstRunCard user={user} csrfToken={csrfToken} />}
        <br />
    </div>

export const LoginInfo = ({ user }) => {
    if (user) {
        return <span>
            <a href={C.URLS.USER_SETTINGS}>{user.user_name}</a>
            <span> </span>
            <span style={{ display: "inline-block" }}>
                (<a href={C.URLS.USER_STRIKES}>{user.strike_count} strikes</a>)</span>
            <span> | </span>
            <a href={C.URLS.USER_LOGOUT}>Logout</a>
        </span>
    }
    else {
        return <a href={C.URLS.AUTH_COGNITO}>Login</a>
    }
}

export const SampleCard = ({ user, csrfToken }) =>
    <div className="card">
        <ViewSampleRequest sample={user.sample} csrfToken={csrfToken} />
    </div>;