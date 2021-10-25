import React from 'react';
import * as C from '../../constant';

const title = "Status"

const element = () =>
    <div>
        <h2>Status: Alpha</h2>
        <h4>Incompleted features:</h4>
        <ul>
            <li>Elected moderators</li>
            <li>Designated proxies</li>
        </ul>
        <h4>Disabled features:</h4>
        <p>Some features are currently disabled as they require a critical mass of users (1000) to make them function well.</p>
        <ul>
            <li>Automatic sample creation</li>
        </ul>
        <h4>Security</h4>
        <p>Though I have attempted to secure this site, it is likely vulnerable. Your email may be leaked if we are hacked.</p>

        <p>For more information about site security see our <a href="https://github.com/evandwight/efficientdemocracy/blob/main/security.md">github</a>.</p>
    </div>



export const Status = { title, element, url: C.URLS.ABOUT_STATUS };