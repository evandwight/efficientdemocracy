import { reactRender } from '../views/utils';
import React from 'react';
import * as C from '../constant';

export const Sort = (req, res) => {
    reactRender(res, <div className="highlight-links">
        <a href={C.URLS.QPOSTS}>Hot</a>
        <br/>
        <a href={C.URLS.NEW_QPOSTS}>New</a>
        <br/>
        <a href={C.URLS.DEEPLY_IMPORTANT_QPOSTS}>Deeply important</a>
    </div>, {title:"Sort posts"});
}