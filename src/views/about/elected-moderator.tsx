import React from 'react';
import * as C from '../../constant';

const title = "Elected moderators"

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>
            Moderators help us achieve our goal of efficiently estimating a referendum. Though inaccurate, moderators can make decisions in a timely and efficient manner. Elected moderators are incentivized to represent the will of their community because if they aren't doing a good job then they can be replaced.
        </p>
        <p>
            However, when your only option is to fire your representative, it traps you in an all-or-nothing dichotomy. We avoid this situation by empowering you to dispute individual decisions. Highly disputed decisions get settled with inefficient but accurate estimators such as statistical sampling or a referendum. The efficient corrected by the accurate.
        </p>
        <p>
            A single moderator gives accountability and decidability, but lacks the ability to judge millions of posts and has individual bias. To overcome these flaws we let the moderator designate as many mini moderators as needed. The mini mods vote how to moderate a post, and whatever the majority decides determines how the post is moderated. By designating a fraction of the community as mini mods, large volumes of posts can be moderated with care, while also using the wisdom of the crowd to remove individual bias.
        </p>
    </div>

export const ElectedModerator = { title, element, url: C.URLS.ABOUT_ELECTED_MODERATORS };