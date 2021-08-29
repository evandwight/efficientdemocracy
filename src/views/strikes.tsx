import React from 'react';
import * as C from "../constant";

export const Strikes = ({user, strikes}) =>
  <div>
    <h1>Strike Information</h1>
    <div>You have {strikes.length} strike(s).</div>
    <div>{user.is_banned ? "You are banned." : "You are not banned."}</div>
    <h2>Strike List</h2>
    <ul>{strikes.map((strike,i) => 
        (strike.thing_type === C.THINGS.USER
          ? <UserStrike strike={strike} key={i}/>
          : <SampleStrike strike={strike} key={i}/>)
    )}</ul>
  </div>

const UserStrike = ({strike}) => <li>User "{strike.user_name}" gave you a strike for <a href={C.URLS.QPOSTS_VIEW + strike.thing_id}><b>this</b></a> post.</li>
const SampleStrike = ({strike}) => <li>A sample gave you a strike for <a href={C.URLS.QPOSTS_VIEW + strike.thing_id}><b>this</b></a> post.</li>