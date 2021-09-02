import React from 'react';
import * as C from '../../constant';

const title = "TIL: don't use inline scripts";

const element = () =>
    <div className="about-text">
        <h2>{title}</h2>
        <p>Apparently <a href={C.URLS.BLOG_REACT_STATIC_RENDER}>react</a> was trying to warn me. Don't use inline scripts or you'll be <a href="https://developers.google.com/web/fundamentals/security/csp#inline-code-considered-harmful">vulnerable to cross site scripting</a>!</p>

        <p>
            Google has the perfect recommendation for me: attach the onclick listeners after the page loads. No client side react needed. No <a href="https://news.ycombinator.com/">script-src: 'unsafe-inline'</a>. No dangerouslySetInnerHTML. Beautiful.
        </p>

        <code>
{`document.addEventListener('DOMContentLoaded', function () {
  Array.from(document.getElementsByClassName('onclick-vote')).forEach(element => {
    element.addEventListener('click', vote);
  });
});`}
        </code>
    </div>

export const Page = { element, title, url: C.URLS.BLOG_CSP_INLINE_SCRIPT, created: new Date(2021, 8, 1)};