import React from 'react';
import * as C from '../../constant';

const title = "Elected moderators"

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>
            Sampling is still too expensive, so we use elected moderators as a first line of defense. This allows for timely action and prevents a flood of requests on everyone's time.
        </p>
        <p>
            Like sampling, moderators aren't perfect. Two mechanisms address this: first, users can change their vote at any time to kick the current moderator out of office, and second users can dispute individual moderator decisions in order to trigger a sample.
        </p>
    </div>

export const ElectedModerator = { title, element, url: C.URLS.ABOUT_ELECTED_MODERATORS };