import React from 'react';
import * as C from '../../constant';

const title = "Democratic moderation"

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>
            Ideally, we would make every decision based on what the community wants - a referendum on each issue. Practically, we cannot but we can estimate the result of a referendum. We use the following tools to do exactly that:
        </p>
        <ul>
            <li>Referendums - the gold standard, deployed to definitively resolve a highly disputed decision.</li>
            <li>Statistical sampling - vastly more efficient than a referendum, as the opinion of millions can be estimated by asking as few as 50 people. Every decision can be disputed to trigger a referendum.</li>
            <li><a href={C.URLS.ABOUT_ELECTED_MODERATORS}>Elected moderators</a> - first line of defense that allows for timely action and prevents a flood of requests on the community's time. Every decision can be disputed to trigger a sample or even a referendum.</li>
        </ul>
        <p>
            To remove the bias towards active users we allow a <a href={C.URLS.ABOUT_DESIGNATED_PROXY}>designated proxy</a> to particpate on your behalf.
        </p>
    </div>

export const DemocraticModeration = {title, element, url: C.URLS.ABOUT_DEMOCRATIC_MODERATION};