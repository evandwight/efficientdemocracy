import React from 'react';
import * as C from "../../constant";

export const Page = () =>
    <div>
        <h2>How it works:</h2>
        <p>
            In order to curate posts we <a href={C.URLS.ABOUT_DEMOCRATIC_MODERATION}>estimate</a> the result of a referendum on "is this deeply important for you to know?". This lets the community decide for itself what is important. A combination of statistics and incentives allow us to make an educated guess what you will find important without even asking you - thereby providing a curated feed with no dictators.
        </p>
        <p>
            These are the tools we use:
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
            The eventual goal is to recreate Reddit with the discussion reflecting the desires of all users and not just the most active and passionate. Though currently not all <a href={C.URLS.ABOUT_STATUS}>features</a> are implemented or activated.
        </p>
    </div>
