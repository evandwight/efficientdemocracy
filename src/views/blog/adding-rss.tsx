import React from 'react';
import * as C from '../../constant';

const title = "Adding RSS";

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>After a bit of trial and error RSS has been added!</p>
    </div>

export const Page = { element, title, url: C.URLS.BLOG_ADDING_RSS, created: new Date(2021, 10, 16)};