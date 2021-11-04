import React from 'react';
import * as C from '../../constant';

const title = "Elected moderators"

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>
            Our goal in moderation is to estimate a referendum. Moderators complement referendums because unlike referendums, moderators are timely and take only a single person's time.
        </p>
        <p>
            To align moderator decisions with the communitiy, moderatores are elected by the community. If the community doesn't like how the moderator acts, they can replace them. Further, if the community only disagrees with a single moderator descision they don't need to replace them. They can dispute that decision adn trigger a sample or referendum.
        </p>
        <p>
            A single moderator gives accountability and decidability, but lacks the ability to judge millions of posts and has indiidual bias. To overcome these flaws we let the moderator designate as many mini moderators as needed. The mini mods vote how to moderate a post, and whatever the majority decides determines how the post is moderated. By designating a fraction of the community as mini mods, large volumes of posts can be moderated with care while also using the wisdom of the crowd to remove individual bias.
        </p>
    </div>

export const ElectedModerator = { title, element, url: C.URLS.ABOUT_ELECTED_MODERATORS };