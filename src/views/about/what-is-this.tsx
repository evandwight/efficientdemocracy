import React from 'react';
import * as C from "../../constant";

export const Page = () =>
    <div>
        <h2>What is this?</h2>
        <p>
            We are a weekly newsletter of deeply important Hacker News posts. An alternative to an addictive infinite list of interesting posts. We only select those you need to read - no news is good news.
        </p>
        <p>
            We select posts by <a href={C.URLS.ABOUT_DEMOCRATIC_MODERATION}>estimating</a> the result of a referendum on "is this deeply important for you to know?" By using statistics we can make an educated guess as to what posts you would find deeply important without even asking you.
        </p>
        <p>
            Currently, many <a href={C.URLS.ABOUT_STATUS}>features</a> are not enabled as we don't have enough users to make them function well.
        </p>
        <p>
            The eventual goal is to recreate Reddit with the discussion reflecting the desires of all users and not just the most active and passionate. We aim to accomplish this with several tools:</p>
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
    </div>
