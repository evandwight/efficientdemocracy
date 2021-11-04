import * as C from '../constant';
import React from 'react';

export const ViewModVote = ({ currentModVote, currentMod, voteCount }) => {
  return <div>
    <div>
        Current elected moderator: {currentMod.user_name}
    </div>
    <div>
        Current vote: {!!currentModVote ? currentModVote.user_name : "no vote"}
    </div>
    <div>
        <h4>Eligible moderators</h4>
        <table>
            <b><tr><td>Name</td><td>Votes*</td><td>Submit vote</td></tr></b>
            {voteCount.map((e, i) => <tr key={i}>
                <td>{e.user_name}</td>
                <td>{e.count}</td>
                <td><a className="onclick-post" data-reload href={`${C.URLS.SUBMIT_MOD_VOTE}${e.vote}`}><button>select</button></a></td>
                </tr>)}
        </table>
        <p>* As of maybe 5 minutes ago.</p>
    </div>
  </div>
}