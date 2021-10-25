import React from 'react';
import * as C from '../../constant';

const title = "Why we moderate visibility";

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>
            The purpose of suspending bad posters is to prevent people from seeing bad posts. However, this doesn't solve the problem because the people who promoted a bad post can keep doing so. Voters have more control over what the community sees than posters; a post on the front page of Reddit will be seen by millions whereas a post without any up votes will be seen by almost no one. A bad post seen by no one doesn't matter. We hold voters responsible for what they promote.
        </p>
        <p>
            An added benefit is that this makes the decision to moderate more impactful. Instead of just suspending a single poster, the thousands responsible for putting the post on the front page can be suspended.
        </p>
        <h4>Solicited votes vs unsolicited votes</h4>
        <p>
            Not all votes are the same. Users are held responsible for unsolicited votes (up votes, down votes, disputes) but not for solicted votes (samples, referendums) as we don't want to discourage participation.
        </p>
    </div>


export const ModerateVisibilty = { title, element, url: C.URLS.ABOUT_MODERATE_VISIBILITY };
