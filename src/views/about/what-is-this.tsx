import React from 'react';
import * as C from "../../constant";

const SIGNUP = C.URLS.USER_LOGIN;

export const Page = () =>
    <div>
        <h2>What is this?</h2>
        <p>
            Community curated news: keep up to date with hacker news in less time.
        </p>
        <p>
            We no longer live with a scarcity of information but with an abundance. Hacker News excels at collecting interesting information but it’s an addictive infinite list. Efficient Democracy converts endless scrolling to a weekly newsletter of just the important stories. No more addiction. Only the news you need.
        </p>
        <p>
            Hacker News excels because people are mostly the same; what engages others, engages you. Instead of using this similarity to maximize engagement, we use it to identitfy important stories. If your peers mark it as important, so do we. We crowdsource curation so you don't have to do it alone.
        </p>
        <p>
            Scroll less; feel better.
        </p>
        <p>
            Interested in trying it out? <a href={SIGNUP}>Sign up</a>!
        </p>
        <h3>How do we decide what’s important?</h3>
        <p>
            To decide the importance of a post, we estimate the result of a referendum on “is this post important?” Efficient Democracy is an experiment to see if we can efficiently and accuractely estimate referendums.
        </p>
        <p>
            Our process begins by using moderators elected by the people. Moderators allow for quickly categorizing posts but unfortunately aren't accurately representative despite being elected. In order to correct their mistakes without needing to fire them, the community can dispute individual issues. The disputed issues then get corrected using a statistical sample or even a full referendum.
        </p>
        <p>
            If you don't want the hassle of answering a few questions a week, you can have your voice heard by designating a proxy to participate on your behalf. We ensure the proxies are representative by asking you one question per quarter. Statistical sampling makes this efficient - the more users, the less work. [33]
        </p>
        <p>
            No artificial intelligence. No magic. Just people working together to build a better community. An efficient democracy.
        </p>
        <p>
            Take the power back. <a href={SIGNUP}>Sign up</a> and have your voice heard!
        </p>
        <h3>What else can it do?</h3>
        <p>
            Being able to efficiently estimating the result of a referendum enables us to
        </p>
        <ul>
            <li>make decisions based on how people feel about a post: is this post important? Is it misleading? Should it be censored?</li>
            <li>make decisions based on how people feel about anything: is this person an expert? Should this rule exist? Should this community be quarantined?</li>
            <li>make decisions based on how a group of experts feel about anything: do you expect this study to be reproducible? Is this accurate?</li>
        </ul>
        <p>
            Most importantly it allows a community to moderate themselves and doesn’t let the loudest control the conversation[22].
        </p>
        <p>
            Want to find out if it can work? <a href={SIGNUP}>Sign up</a>!
        </p>

        <h3>How could this possibly work when election polls are so often wrong?</h3>
        <p>
            Close elections are difficult to predict, blowouts are not. We are trying to categorize posts where there is clear consensus - a super majority. A 51% to 49% split only shows that the categorization is contentious, and that you need to make up your own mind.
        </p>
        <p>
            When an issue is contentious and important to be decided (highly disputed) then a referendum is called to remove all possibility of a mistake.
        </p>
        <h3>How do we stop fake accounts?</h3>
        <p>
            Once fake accounts become a problem, we will verify identities for all new accounts[11]. Depending on the severity of the problem we may need to physically mail one time codes to verify addresses.
        </p>
        <p>
            Please don’t create fake accounts. If you’ve already signed up, then don’t <a href={SIGNUP}>sign up</a>!
        </p>
        <h3>Notes</h3>
        <ul>
            <li>[11]- Publicly users will not be identified by their real identity but by a changeable pseudonym</li>
            <li>[22]- We moderate illegal content separately</li>
            <li>[33]- Learn more about <a href={C.URLS.ABOUT_HOW_IT_WORKS}>how it works</a>!</li>
        </ul>
    </div>