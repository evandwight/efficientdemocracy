import React from "react";
import * as C from '../constant';

export const Footer = () =>
    <div>
        <br />
        <hr className="blue-400" />
        <div id="footer">
            <a href={C.URLS.ABOUT_LEGAL}>legal</a>
            <span> | </span>
            <a href={C.URLS.BLOG}>blog</a>
            <span> | </span>
            <a href={C.URLS.ABOUT_FAQ}>faq</a>
        </div>
        <br />
    </div>