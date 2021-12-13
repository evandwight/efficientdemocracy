import React from 'react';
import * as C from '../../constant';

const title = "Democratic moderation"

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>
            We want to make decisions by estimating a referendum. The following are tools to estimate a referendum described with how accurate, timely and cost in terms of uninterested user time:
        </p>
        <ul>
            <li>Unsolicited votes - 0 cost, timely but inaccurate due to selection bias</li>
            <li><a href={C.URLS.ABOUT_ELECTED_MODERATORS}>Elected representatives/moderator</a> - 0 cost and timely but inaccurate due to decisions only being influenced by incentives</li>
            <li>Statistical sample - mostly accurate - sampling error - but constant cost per decision and not timely</li>
            <li>Referendum - accurate but N cost per decision and not timely</li>
        </ul>
        <p>
            Though each tool is fatally flawed, combining them allows us to overcome that. The efficiency of elected moderators lets them act as a first line of defense. They make the majority of the decisions and prevent a flood of requests on the community's time. We detect bad decisions with unsolicited votes - disputes - and then correct the decision by triggering a statistical sample. Similarly, statistical samples can be corrected by a referendum. The efficient corrected by the accurate.
        </p>
        <p>
            Disputes have a selection bias so they cannot be trusted to represent the will of the people. As such, we disincentivize abuse by empowering the community to give strikes to disputers when they feel the issue should not have been disputed.
        </p>
        <p>
            This system hybridizes a representative democracy with a direct democracy to share benefits and eliminate flaws.
        </p>
        <h4>Let's work through an example:</h4>
        <ul>
            <li>A moderator has a personal bias against post X. They censor it and gives strikes to all that upvoted the post.</li>
            <li>Active users see the post is improperly censored and organize to dispute the issue.</li>
            <li>A sample is triggered and the big jury overturns the decision and the associated strikes.</li>
        </ul>
        <h4>Proxies</h4>
        <p>
            To remove the bias towards active users we allow a <a href={C.URLS.ABOUT_DESIGNATED_PROXY}>designated proxy</a> to participate on your behalf.
        </p>
        <h4>Benefits of democratic moderation:</h4>
        <ul>
            <li>Disputes provide an outlet for dissent</li>
            <li>Getting community buy-in to decisions allows moderation without fear of backlash</li>
            <li>Reduces the power of elected representatives, which allows more people to be trusted to wield it. With more moderators to share the work, there is more time to engage with the community and more time to consider their decisions.</li>
        </ul>
        <h4>Issues with democratic moderation:</h4>
        <ul>
            <li>Democracy depends on there being few fake accounts so we will eventually need <a href={C.URLS.ABOUT_FAQ_FAKE_ACCOUNTS}>real ids</a></li>
        </ul>

    </div>

export const DemocraticModeration = { title, element, url: C.URLS.ABOUT_DEMOCRATIC_MODERATION };