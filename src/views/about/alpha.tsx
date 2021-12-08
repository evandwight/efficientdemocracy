import React from 'react';
import * as C from '../../constant';

const title = "Status"

const element = () =>
    <div>
        <h2>Status: Alpha</h2>
        <h4>Unimplemented features</h4>
        <ul>
            <li>Submitting posts (not needed till the community is large)</li>
            <li>Multiple subcommunities</li>
            <li>Validating proxy representation</li>
            <li>Explainations for moderator decisions</li>
        </ul>
        <p>
            Bugs and performance need to be worked out.
        </p>
        <h4>Security</h4>
        <p>
            Though I have attempted to secure this site, it is likely vulnerable. For more information about site security see our <a href="https://github.com/evandwight/efficientdemocracy/blob/main/security.md">github</a>.
        </p>
    </div>



export const Status = { title, element, url: C.URLS.ABOUT_STATUS };