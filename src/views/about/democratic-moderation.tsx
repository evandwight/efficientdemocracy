import React from 'react';

export const Page = () =>
    <div className="about-text">
        <h2>Democratize Moderation</h2>
        <p>
            As bad actors exist, we need moderation. Deciding who qualifies as a bad actor is a matter of taste, so the community should decide for itself.
        </p>

        <p>
            The core principle in every decision is "if everyone voted what would the result be?". This is the foundation for deciding who should be censored. Not advertisers. Not investors. Not lizard people. The community decides[1].
        </p>
        <p>
            Unfortunately, this is not economical. There are too many decisions to be made and not enough time. To make this efficient we use elected moderators, statistical sampling, and designated proxies.
        </p>

        <h4>Referendums</h4>
        <p>
            Referendums answer our core principle directly. However, they must be used sparingly as they mean bothering everyone to resolve a single issue.
        </p>

        <h4>Statistical Sampling</h4>
        <p>
            Statistical sampling is much more efficient than referendums. Sampling is magical. A referendum of a million people can be estimated by sampling as few as 50 people.
        </p>
        <p>
            As sampling is not perfect, we detect errors by allowing users to dispute the result, which then triggers a referendum.
        </p>

        <h4>Elected Moderators</h4>
        <p>
            Sampling is still too expensive, so we use elected moderators as a first line of defense. This allows for timely action and prevents a flood of requests on everyone's time.
        </p>
        <p>
            Like sampling, moderators aren't perfect. Two mechanisms address this: first, users can change their vote at any time to kick the current moderator out of office, and second users can dispute individual moderator decisions in order to trigger a sample.
        </p>

        <h4>Designated Proxy</h4>
        <p>
            Being actively involved takes time. For those who want their voice to be heard but not actively involved, they can designate a proxy to vote for them. Designated proxies are similar to an elected representative.
        </p>
        <p>
            To keep proxies voting aligned to the users who designated them we regularly sample the opinion of the designators and compare it to the voting record of their proxies. When the difference becomes too large, we ask our users to designate new proxies. Ideally, we'd only need to bother a small fraction of designators every quarter.
        </p>
        <h4>Notes</h4>
        <ol>
            <li>As the site grows, we will need to verify new accounts belong to real people</li>
        </ol>
    </div>

