import React from 'react';
import * as C from "../../constant";

export const Page = () =>
    <div>
        <h2>What is this?</h2>
        <p>
            Efficient Democracy is a weekly newsletter of deeply important Hacker News posts. Rather than showing an addictive infinite list of interesting posts we select only those you need to read - no news is good news.
        </p>
        <p>
            We select deeply important posts by <a href={C.URLS.ABOUT_DEMOCRATIC_MODERATION}>estimating</a> a referendum on "Is this deeply important for you to know? By using statistics we can make an educated guess as to what you would find deeply important without ever asking you yourself.
        </p>
        <p>
            Currently, many features of this site are not enabled as there are not enough users to make them function well.
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
            <li>
                Optmized for users, not investors: our goal is to keep <a href={C.URLS.ABOUT_COSTS}>costs</a> low and not take outside investors as <a href="http://johncbogle.com/wordpress/wp-content/uploads/2009/04/columbia409.pdf">a man cannot serve two masters"[pdf]</a>.
            </li>
        </ul>
    </div>
