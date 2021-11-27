import React from 'react';
import * as C from '../constant';

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
                <tr><td><b>Name</b></td><td><b>Votes*</b></td><td><b>Submit vote</b></td></tr>
                {voteCount.map((e, i) => <tr key={i}>
                    <td>{e.user_name}</td>
                    <td>{e.count}</td>
                    <td><a className="onclick-post" data-reload href={`${C.URLS.SUBMIT_MOD_VOTE}${e.vote}`}><button> &#x2714; </button></a></td>
                </tr>)}
            </table>
            <p>* As of maybe 5 minutes ago.</p>
        </div>
    </div>
}