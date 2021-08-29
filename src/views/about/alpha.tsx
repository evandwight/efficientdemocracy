import React from 'react';

export const Page = () =>
    <div className="about-text">
        <h2>Status: Alpha</h2>
        <h4>Incompleted features:</h4>
        <ul>
            <li>Elected moderators</li>
            <li>Designated proxies</li>
        </ul>
        <h4>Security</h4>
        <p>This site is insecure. Please do not reuse passwords, or an email address you don't want leaked. Known
            insecurities:</p>
        <ul>
            <li>Login - timing attacks, no request limitations</li>
            <li>Registration - leaks email information</li>
        </ul>
        
        <p>For more information about site security see our <a href="https://github.com/evandwight/efficientdemocracy/blob/main/security.md">github</a>.</p>
    </div>

