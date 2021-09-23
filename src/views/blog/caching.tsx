import React from 'react';
import * as C from '../../constant';

const title = "Caching version zero";

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>Caching is key the key to scaling. The most expensive query I have is the front page post list. It asks the database to go through all the posts and sort them by their point score. Having the server hold onto this result for a few minutes means the database only runs the query once every few minutes instead of once per user.</p>

        <p>For version zero I cut every corner. The solution I came to was just storing the cache in a plain javascript object. I don't need redis because I only have one front end nodejs process.</p>

        <p>Once again I discovered the importance of tests as even simple functions can have tricky bugs - like forgetting an await, or missing a return value. Both of which I did.</p>
    </div>

export const Page = { element, title, url: C.URLS.BLOG_CACHING, created: new Date(2021, 8, 23)};