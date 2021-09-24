import React from 'react';

export const Page = () =>
    <div>
        <h2>Status: Alpha</h2>
        <h4>Incompleted features:</h4>
        <ul>
            <li>Elected moderators</li>
            <li>Designated proxies</li>
        </ul>
        <h4>Disabled features:</h4>
        <ul>
            <li>Visibility voting</li>
            <li>Automatic sample creation - needs 1000 users</li>
        </ul>
        <h4>Security</h4>
        <p>This site is insecure. Your email may be leaked if we are hacked.</p>
        
        <p>For more information about site security see our <a href="https://github.com/evandwight/efficientdemocracy/blob/main/security.md">github</a>.</p>
    </div>

