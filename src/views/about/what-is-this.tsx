import React from 'react';
import * as C from "../../constant";

export const Page = () =>
    <div className="about-text">
        <h2>What is this?</h2>
        <p>
            Efficient Democracy is a weekly newsletter of deeply important Hacker News posts. Rather than showing an addictive infinite list of interesting posts we select only those you need to read - no news is good news.
        </p>
        <p>
            What is deeply important? It depends on who you ask. We answer it by <a href={C.URLS.ABOUT_DEMOCRATIC_MODERATION}>estimating</a> the result of asking everyone "Is this deeply important for me to know?". By using statistics we can estimate how you would filter your news without ever showing it to you.
        </p>
        <p>
            The eventual goal of Efficient Democracy is to recreate Reddit with the discussion reflecting the desires of all users and not just the most active and passionate. We aim to accomplish this several tools:</p>
        <ul>
            <li>
                <a href={C.URLS.ABOUT_DEMOCRATIC_MODERATION}>Democratic moderation</a>: elected moderators, statistical sampling, referendums, and designated proxies
            </li>
            <li>
                <a href={C.URLS.ABOUT_MODERATE_VISIBILITY}>Moderating visibility</a>: up voting a post makes you as responsible as for it as the poster
            </li>
        </ul>
    </div>
