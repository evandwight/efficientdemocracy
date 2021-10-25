import React from 'react';
import * as C from '../../constant';

const title = "Legal";

const element = () =>
    <div>
        <h2>{title}</h2>
        <ul>
            <li>
                <a href={C.URLS.ABOUT_PRIVACY}>Privacy policy</a>
            </li>
            <li>
                <a href={C.URLS.ABOUT_TERMS_OF_SERVICE}>Terms of service</a>
            </li>
        </ul>
    </div>


export const Legal = { title, element, url: C.URLS.ABOUT_LEGAL };