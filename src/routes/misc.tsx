import { reactRender } from '../views/utils';
import React from 'react';
import * as C from '../constant';

export const Sort = (req, res) => {
    reactRender(res, <div className="highlight-links">
        <div>
            <a href={C.URLS.QPOSTS}>Hot - newish, popular posts</a>
        </div>
        <div>
            <a href={C.URLS.NEW_QPOSTS}>New - new posts</a>
        </div>
        <div>
            <a href={C.URLS.DEEPLY_IMPORTANT_QPOSTS}>Deeply important - deeply important posts since last saturday</a>
        </div>
    </div>, {title:"Sort posts"});
}