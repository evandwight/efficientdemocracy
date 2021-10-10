import { reactRender } from '../views/utils';
import React from 'react';
import * as C from '../constant';

export const Sort = (req, res) => {
    reactRender(res, <div className="highlight-links">
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
    </div>, {title:"Sort posts"});
}