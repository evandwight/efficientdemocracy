import React from 'react';
import * as C from '../../constant';

const title = "Adding proxies";

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>
            You can now designate a <a href={C.URLS.ABOUT_DESIGNATED_PROXY}>proxy</a> to participate in democratic moderation on your behalf! I hope this feature encourages people who want more balanced online spaces to sign up and allows menosmalo.com to avoid becoming yet another site catering to an extreme.
        </p>
    </div>

export const Page = { element, title, url: C.URLS.BLOG_ADDING_PROXIES, created: new Date(2021, 11, 6)};