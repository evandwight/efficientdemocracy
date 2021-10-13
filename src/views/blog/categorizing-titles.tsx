import React from 'react';
import * as C from '../../constant';

const title = "Automatically categorizing posts by their titles";

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>People frequently request that hacker news only show programming related posts. That probably isn't going to happen but thankfully we can implement it ourselves due to them <a href="https://github.com/HackerNews/API">sharing all the data</a>.</p>

        <p>I copied Ed King's <a href="https://www.kaggle.com/kinguistics/classifying-news-headlines-with-scikit-learn">work</a> to implement a naive bayes classifier on headlines. The only remaining difficulty was creating the training set. I bulk categorized posts by their domains: stackoverflow is technical, forbes isn't techincal, etc. This was surprisingly effective. For example I wrongly categorized arstechinca as techincal, and when I removed it accuracy shot up from 80% to 94%!</p>

        <p>The implementation is far from good, but it works well enough for a initial version.</p>
    </div>

export const Page = { element, title, url: C.URLS.BLOG_CATEGORIZING_TITLES, created: new Date(2021, 9, 13)};