import React from "react";
import * as C from "../../constant";

const SIGNUP = C.URLS.USER_LOGIN;
const title = "What is this?";

const Element = () =>
    <div>
        <h2>{title}</h2>
        <p>
            Community curated news: keep up to date with hacker news without going down the rabbit hole.
        </p>
        <p>
            Hacker news brings you the most engaging stories on the internet, but it doesn't know when to stop. You keep reading hoping the next comment will answer all your questions. Usually, it just makes you angry.
        </p>
        <p>
            Efficient Democracy converts endless scrolling to a weekly newsletter of just the important stories. No more addiction. Only the news you need.
        </p>
        <p>
            They use your similarity to others to find what engages you. Instead, we use it to curate your news. If your peers marks it as important, so do we. We crowdsource curation, so you do not have to do it alone.
        </p>
        <p>
            Scroll less; feel better.
        </p>
        <h3>How do we decide importance?</h3>
        <p>
            To decide the importance of a post, we estimate the result of a referendum on “is this post important?”
        </p>
        <p>
            It's that simple!
        </p>
        <h3>But referendums can't handle the tsunami of posts!</h3>
        <p>
            We make estimating a referendum efficient. First, we use elected moderators to quickly categorize posts.
        </p>
        <p>
            Then we correct mistakes by using a statistical sample or referendum on highly disputed categorizations. The efficient corrected by the accurate. [55]
        </p>
        <p>
            Want a community run by the community? <a href={SIGNUP}>Sign up</a>!
        </p>
        <h3>No time to participate?</h3>
        <p>
            You can designate a proxy to participate for you! Proxies improve communities by not favoring those with more time or more interest.
        </p>
        <p>
            Take back the power and have your voice heard!
        </p>
        <h3>What else can it do?</h3>
        <p>
            With the power to estimate referendums, we can make decisions based on how groups think. For example:
        </p>
        <ul>
            <li>How do people feel about posts:
                <ul>
                    <li>Is this post important? </li>
                    <li>Is it misleading?</li>
                    <li>Should we censor it?</li>
                    <li>Retrospectively, was this post important?</li>
                </ul>
            </li>
            <li>How do people feel about anything:
                <ul>
                    <li>Is this person an expert in physics?</li>
                    <li>Should this rule exist? </li>
                    <li>Should we quarantine that community?</li>
                </ul>
            </li>
            <li>How do experts feel about anything:
                <ul>
                    <li>Will this study reproduce? </li>
                    <li>Is this accurate?</li>
                </ul>
            </li>
        </ul>
        <p>
            We do not need big tech monopolies to control speech. We can build communities that moderate themselves, communities where the loudest do not control the conversation[22].
        </p>
        <p>
            To learn more, read how it works [55]!
        </p>
        <h3>Limited sign ups</h3>
        <p>
            Sign ups are limited to prevent unexpected performance degradation. If you have already signed up, then do not <a href={SIGNUP}>sign up</a>!
        </p>
        <code>
            {`const users = await CachedDB.getUsers();
const enableRegister = users.length < 1000;
...`}
        </code>
        <h3>Notes</h3>
        <ul>
            <li>[22] - We moderate illegal content separately</li>
            <li>[55] - <a href={C.URLS.ABOUT_DEMOCRATIC_MODERATION}>How democratic moderation works</a></li>
        </ul>
    </div>

export const WhatIsThis = { title, element: Element, url: C.URLS.ABOUT_WHAT_IS_THIS };