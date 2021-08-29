import React from "react";
import * as C from "../constant";
import {SampleCard} from "./sampleCard";

export const Header = ({ showLogin, user, csrfToken}) =>
    <div>
        <table className="bg-blue-400" id="header">
            <tr>
                <td>
                    <a href="/"><b>Efficient Democracy</b></a>
                    <span> </span>
                    <a href={C.URLS.ABOUT_STATUS}>alpha</a>
                    <span> | </span>
                    <a href={C.URLS.ABOUT_WHAT_IS_THIS}>what is this?</a>
                    <span> | </span>
                    <a href={C.URLS.SORT}>sort</a>
                </td>
                {showLogin ? <td id="userInfo"> <LoginInfo user={user} /> </td> : null}
            </tr>
        </table>
        {showLogin && user && user.sample && <SampleCard user={user} csrfToken={csrfToken}/>}
        <br/>
    </div>

export const LoginInfo = ({ user }) => {
    if (user) {
        return <span>
            <a href={C.URLS.USER_SETTINGS}>{user.user_name}</a> 
            <span> </span>
            (<a href={C.URLS.USER_STRIKES}>{user.strike_count} strikes</a>) 
            <span> | </span>
            <a href={C.URLS.USER_LOGOUT}>Logout</a>
        </span>
    }
    else {
        return <a href={C.URLS.USER_LOGIN}>Login</a>
    }
}