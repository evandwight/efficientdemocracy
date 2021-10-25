import React from 'react';
import * as C from '../../constant';

const title = "Designated Proxy"

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>
            Being actively involved takes time. For those who want their voice to be heard but not actively involved, they can designate a proxy to vote for them. Designated proxies are similar to an elected representative.
        </p>
        <p>
            To keep proxies voting aligned to the users who designated them we regularly sample the opinion of the designators and compare it to the voting record of their proxies. When the difference becomes too large, we ask our users to designate new proxies. Ideally, we'd only need to bother a small fraction of designators every quarter.
        </p>
    </div>

export const DesignatedProxy = { title, element, url: C.URLS.ABOUT_DESIGNATED_PROXY };