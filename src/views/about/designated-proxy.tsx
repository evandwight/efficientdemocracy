import React from 'react';
import * as C from '../../constant';

const title = "Designated proxy"

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>
            Being actively involved takes time and ends up excluding the majority of people from participating.  This introduces a bias towards those with excess time or extreme interest.
        </p>
        <p>
            We give users the power to designate a proxy to act on their behalf. This lowers the barrier to participation and removes the bias towards extremes. Proxies give the silent majority a voice.
        </p>
        <p>
            To keep proxies aligned with their users we regularly sample users' opinion and compare it to the voting record of their proxy. When the difference becomes too large, users must designate new proxies. Statistical sampling allows us to only bother a small fraction of users every quarter.  The more users, the less work.
        </p>
        <p>
            Proxies will never be perfect representatives but the alternative is no representation at all.
        </p>
        <p>
            To particpate in democratic moderation via proxy: change the <a href={C.URLS.USER_SETTINGS}>setting</a> and <a href={C.URLS.VIEW_PROXY}>pick a proxy</a>.
        </p>
    </div>

export const DesignatedProxy = { title, element, url: C.URLS.ABOUT_DESIGNATED_PROXY };