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
            Hacker news doesn't know when to stop. You read the next comment hoping it will answer all your questions, but usually it just makes you angry.
        </p>
        <p>
            We convert endless scrolling to a weekly newsletter of just important stories. No more addiction. Only the news you need.
        </p>
        <p>
            They use your similarity to others to find what engages you. We use it to curate your news. If your peers marks it as important, so do we. We crowdsource curation, so you do not have to do it alone.
        </p>
        <p>
            Scroll less; feel better.
        </p>
        <h3>How do we decide importance?</h3>
        <p>
            To decide the importance of a post, we estimate the result of a referendum on “is this post important?”
        </p>
        <p>
            Using consensus to curate.
        </p>
        <h3>But referendums can't handle the tsunami of posts!</h3>
        <p>
            You are right, referendums themselves take too much effort. We make <b>estimating</b> a referendum efficient. First, we use elected moderators to quickly categorize posts. Then for highly disputed categorizations, we correct mistakes with a statistical sample or a referendum. The efficient corrected by the accurate. For more details read about <a href={C.URLS.ABOUT_DEMOCRATIC_MODERATION}>how it works</a>.
        </p>
        <p>
            Want a community run by the community? <a href={SIGNUP}>Sign up</a>!
        </p>
        <h3>No time to participate?</h3>
        <p>
            You can designate a proxy to participate for you! Proxies improve communities by not favoring those with more time or interest.
        </p>
        <p>
            Take back the power and have your voice heard!
        </p>
        <h3>We can estimate referendums on anything!</h3>
        <ul>
            <li>Should this post be quarantined?</li>
            <li>Should this community be quarantined?</li>
            <li>Retrospectively, was this a good decision?</li>
            <li>Is this person an expert in physics?</li>
            <li>As experts in physics, do you think this study is good?</li>
        </ul>
        <p>
            The answers won't always be right but the goal is to improve the signal to noise ratio. Consensus of you peers is a good signal. By making decisions democratically we put them on firm foundations - community buy-in.
        </p>
        <p>
            We do not need big tech monopolies to control speech. We can build communities that moderate themselves [22]. To learn more, read about <a href={C.URLS.ABOUT_HOW_WE_ARE_DIFFERENT}>how we are different</a>!
        </p>
        <p>
            If you've already signed up, then don't <a href={SIGNUP}>sign up</a>.
        </p>
        <h3>Notes</h3>
        <ul>
            <li>[22] - We moderate illegal content separately</li>
        </ul>
    </div>

export const WhatIsThis = { title, element: Element, url: C.URLS.ABOUT_WHAT_IS_THIS };