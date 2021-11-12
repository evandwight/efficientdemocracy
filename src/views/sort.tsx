import * as C from '../constant';
import React from 'react';

export const Sort = () => <div className="highlight-links">
        <div>
            <a href={C.URLS.QPOSTS}>Hot</a> - newish, popular posts
        </div>
        <div>
            <a href={C.URLS.NEW_QPOSTS}>New</a> - new posts
        </div>
        <div>
            <a href={C.URLS.DEEPLY_IMPORTANT_QPOSTS}>Deeply important</a> - recent deeply important posts
        </div>
        <div>
            <a href={C.URLS.TECHNICAL_QPOSTS}>Technical and hot</a> - hot technical posts
        </div>
        <div>
            <a href={C.URLS.PAST_NEWSLETTERS}>Past newsletters</a> - previous deeply important post newsletters
        </div>
        <div>
            <a href={C.URLS.DISPUTED_QPOSTS}>Highly disputed</a> - highly disputed posts from the last 2 weeks
        </div>
        <div>
            <a href={C.URLS.MINI_MOD_QPOSTS}>Mini mod</a> - posts with mini mod votes from the last 2 weeks
        </div>
    </div>