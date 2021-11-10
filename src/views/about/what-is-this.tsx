import React from 'react';
import * as C from "../../constant";

const SIGNUP = C.URLS.USER_LOGIN;
const title = "What is this?";

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>
            Community curated news: keep up to date with hacker news in less time.
        </p>
        <p>
            We no longer live with a scarcity of information but with an abundance. Hacker News finds interesting information but organizes it as an addictive infinite list. Efficient Democracy converts endless scrolling to a weekly newsletter of just the important stories. No more addiction. Only the news you need.
        </p>
        <p>
            Hacker News excels because people are mostly the same. What engages others engages you. Instead of using this similarity to maximize engagement, we use it to identify important stories. If your peers mark it as important, so do we. We crowdsource curation, so you don't have to do it alone.
        </p>
        <p>
            Scroll less; feel better.
        </p>
        <p>
            Are you interested in trying it out? <a href={SIGNUP}>Sign up</a>!
        </p>
        <h3>How do we decide what’s important?</h3>
        <p>
            To decide the importance of a post, we estimate the result of a referendum on “is this post important?” Efficient Democracy is an experiment to test if we can estimate referendums with accuracy and efficiency.
        </p>
        <p>
            To address the tsunami of posts, we use moderators elected by the people. The moderator works for you. When they don't  represent your views, fire them.
        </p>
        <p>
            Sometimes firing them is too extreme. Despite some flaws, they may be the best for the job. We avoid the all-or-nothing dichotomy by empowering you to dispute individual decisions. The disputes get settled by statistical sample or even referendum. The efficient corrected by the accurate.
        </p>
        <p>
            Settling disputes requires answering a few questions a week. If this is too much, you can still have your voice heard by designating a proxy to participate on your behalf. To make sure your proxy represents your views, we may ask you a question every few months. These questions let us statistically verify the quality of your proxy. The more users, the less work. [33]
        </p>
        <p>
            No artificial intelligence. No magic. Just people working together to build a better community.
        </p>
        <p>
            Take back the power! <a href={SIGNUP}>Sign up</a> and have your voice heard!
        </p>
        <h3>What else can it do?</h3>
        <p>
            With the power to estimate referendums, we can make decisions based on how groups think. For example:
        </p>
        <ul>
            <li>How people feel about posts:
                <ul>
                    <li>Is this post important? </li>
                    <li>Is it misleading?</li>
                    <li>Should we censor it?</li>
                </ul>
            </li>
            <li>How people feel about anything:
                <ul>
                    <li>Is this person an expert in physics?</li>
                    <li>Should this rule exist? </li>
                    <li>Should we quarantine that community?</li>
                </ul>
            </li>
            <li>How experts feel about anything:
                <ul>
                    <li>Will this study reproduce? </li>
                    <li>Is this accurate?</li>
                </ul>
            </li>
        </ul>
        <p>
            We can build communities that moderate themselves. Communities where the loudest don't control the conversation[22].
        </p>
        <p>
            Want to make it happen? <a href={SIGNUP}>Sign up</a>!
        </p>

        <h3>How could this possibly work when election polls are so often wrong?</h3>
        <p>
            Close elections are difficult to predict, but blowouts are not. We are trying to categorize posts where there is clear consensus - a supermajority. A 51% to 49% split only shows that the categorization is contentious, and therefore you need to make up your mind.
        </p>
        <p>
            When an issue is contentious and important to decide, then we call a referendum. Referendums remove all possibility of mistaken results.
        </p>
        <h3>How do we stop fake accounts?</h3>
        <p>
            Once fake accounts become a problem, we will verify identities for all new accounts[11]. Depending on the severity of the problem, we may mail one-time codes to verify addresses.
        </p>
        <p>
            Please don’t create fake accounts. If you’ve already signed up, then don’t <a href={SIGNUP}>sign up</a>!
        </p>
        <h3>Notes</h3>
        <ul>
            <li>[11]- We won't show real identities publicly. Publicly there is only a changeable pseudonym</li>
            <li>[22]- We moderate illegal content separately</li>
            <li>[33]- Learn more about <a href={C.URLS.ABOUT_HOW_WE_ARE_DIFFERENT}>how we're different</a>!</li>
        </ul>
    </div>

export const WhatIsThis = { title, element, url: C.URLS.ABOUT_WHAT_IS_THIS };