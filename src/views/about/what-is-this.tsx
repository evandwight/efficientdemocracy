import React from "react";
import * as C from "../../constant";

const SIGNUP = C.URLS.USER_LOGIN;
const title = "What is this?";

const Element = () =>
    <div>
        <h2>{title}</h2>
        <p>
            Community curated news: keep up to date with hacker news in less time.
        </p>
        <p>
            Times have changed. What was once scarce is now abundant. A flood of information warps our perspective. Hacker News rewards our curiousity but addicts us to it's infinite feed.
        </p>
        <p>
            TODO: gif of person at slot machine. lever is labled scroll. poop poop poop diamond!
        </p>
        <p> 
            Efficient Democracy converts endless scrolling to a weekly newsletter of just the important stories. No more addiction. Only the news you need.
        </p>
        <p>
            Instead of using your similarity to others to maximize engagement, we use it to curate your news. If your peers mark it as important, so do we. We crowdsource curation, so you do not have to do it alone.
        </p>
        <p>
            Scroll less; feel better.
        </p>
        <p>
            Are you interested in trying it out? <a href={SIGNUP}>Sign up</a>!
        </p>
        <h3>How do we decide what is important?</h3>
        <p>
            To decide the importance of a post, we estimate the result of a referendum on “is this post important?”
        </p>
        <p>
            To categorize the tsunami of posts we made estimating a referendum efficient and accurate.
        </p>
        <h3>But how?</h3>
        <p>
            We use elected moderators to efficiently categorize posts.
        </p>
        <p>
            TODO: cartoon of mods sorting through the poop/diamonds the active horde has brought them
        </p>
        <p>
            Then we correct mistakes by using a statistical sample or referendum on highly disputed categorizations. The efficient corrected by the accurate.
        </p>
        <p>
            TODO: cartoon of horde saying this ones are wrong standing around a poop labeled diamon. Below a big jury (statistical sample) switches it's label.
        </p>
        <p>
            Keep your information diet healthy without the work. <a href={SIGNUP}>Sign up</a>!
        </p>
        <p>
            TODO: picture of list of posts thats mostly diamonds and ends. Diamonds and done!
        </p>
        <h3>Don't have time to particpate?</h3>
        <p>
            Designate a proxy to particpate for you! We remove the bias towards those with excess time and interest by allowing you to designate a proxy.
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
                    <li>Retrospectively, was this post important?</li>
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
            We don't need big tech monoplies to control speech. We can build communities that moderate themselves. Communities where the loudest do not control the conversation[22].
        </p>
        <p>
            To learn more read how it works [55] or <a href={SIGNUP}>sign up</a> and try it out!
        </p>
        <h3>Limited sign ups</h3>
        <p>
            <a href={SIGNUP}>Sign ups</a> have been limited to prevent unexpected performance degredation. If you’ve already signed up, then don’t <a href={SIGNUP}>sign up</a>!
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

export const WhatIsThis = { title, element:Element, url: C.URLS.ABOUT_WHAT_IS_THIS };