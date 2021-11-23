
import React from 'react';
import * as C from '../../constant';
import { DisputeLink } from './links';
import { RawTable } from './utils';

export const ViewPostModAction = ({ post, field, action, details }) => {
    return <div className="highlight-links">
        <div>Post title: {post.title}</div>
        <div>Details for field: {C.FIELDS.PROPS[field].PRETTY_LABEL}</div>
        <div>Field set to: {(!!action ? !!action.value : false).toString()}</div>
        <div>Field set by: {!!action ? C.MOD_ACTIONS.PRIORITY_PRETTY_PRINT[action.priority] : "default value"}</div>
        <DisagreeOptions post={post} action={action} field={field} />
        {!!details && details}
    </div>
}

export const VoteDetails = ({ dataTable }) => <div>
    <div>
        <h2>Votes for what to set the field to</h2>
        <div style={{ width: "50%" }} className="center-h">
            <canvas id="voteCanvas" width="400" height="400"></canvas>
        </div>
    </div>

    <div>
        <h2>Votes for who should be given a strike</h2>
        <div style={{ width: "50%" }} className="center-h">
            <canvas id="strikeCanvas" width="400" height="400"></canvas>
        </div>
    </div>

    <h4>Raw data</h4>
    <RawTable dataTable={dataTable} />
</div>

export const DisagreeOptions = ({ post, action, field }) => {
    const { AUTO_MOD, MINI_MOD, MOD, REFERENDUM } = C.MOD_ACTIONS.PRIORTY;
    const canDispute = action?.priority !== REFERENDUM;
    const canModVote = [AUTO_MOD, MINI_MOD, MOD].indexOf(action?.priority) !== -1 || !action;
    if (!canDispute && !canModVote) {
        return <div>This decision is final. It has been made by referendum of the community.</div>
    }
    return <div>
        <p>If you disagree then you can:</p>
        <ul>
            {canDispute && <li><DisputeLink post={post} field={field} /> the decision</li>}
            {canModVote && <li><a href={C.URLS.VIEW_MOD_VOTE}>vote</a> for a different moderator</li>}
        </ul>
    </div>
}