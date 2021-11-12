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
    </div>