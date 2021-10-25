import React from 'react';
import * as C from "../../constant";

export const Page = () =>
    <div>
        <h2>How we are different:</h2>
        <p>
            We aim to reimagine Reddit so the discussion reflects the desires of all users and not just the most active and passionate. The following tools differentiate us:
        </p>
        <ul>
            <li>
                <a href={C.URLS.ABOUT_DEMOCRATIC_MODERATION}>Democratic moderation</a>: elected moderators, statistical sampling, referendums, and designated proxies
            </li>
            <li>
                <a href={C.URLS.ABOUT_MODERATE_VISIBILITY}>Moderating visibility</a>: up voting a post makes you as responsible for it as the poster
            </li>
            <li>
                <a href={C.URLS.ABOUT_COSTS}>Being optimized for users, not investors</a>: our goal is to keep costs low and not take outside investment as "a man cannot serve two masters"<a href="http://johncbogle.com/wordpress/wp-content/uploads/2009/04/columbia409.pdf">[pdf]</a>.
            </li>
        </ul>
        <p>
            Currently not all <a href={C.URLS.ABOUT_STATUS}>features</a> are implemented or activated.
        </p>
    </div>
