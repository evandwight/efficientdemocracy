import React from 'react';
import * as C from '../../constant';

const title = "Status"

const element = () =>
    <div>
        <h2>Status: Alpha</h2>
        <p>
            All basic functionality has been implemented and enabled. Bugs and performance need to be worked out.
        </p>
        <h4>Security</h4>
        <p>
            Though I have attempted to secure this site, it is likely vulnerable. For more information about site security see our <a href="https://github.com/evandwight/efficientdemocracy/blob/main/security.md">github</a>.
        </p>
    </div>



export const Status = { title, element, url: C.URLS.ABOUT_STATUS };