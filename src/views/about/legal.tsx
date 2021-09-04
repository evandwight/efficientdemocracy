import React from 'react';
import * as C from "../../constant";

export const Page = () =>
    <div>
        <h2>Legal</h2>
        <ul>
            <li>
                <a href={C.URLS.ABOUT_PRIVACY}>Privacy policy</a>
            </li>
            <li>
                <a href={C.URLS.ABOUT_TERMS_OF_SERVICE}>Terms of service</a>
            </li>
        </ul>
    </div>
