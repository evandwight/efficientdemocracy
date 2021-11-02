import React from 'react';
import * as C from '../../constant';
export * as BlogEntries from './blogEntries';

export const BlogPage = ({ entries, page, showNext }) =>
    <div>
        <h2>Blog</h2>
        <ul>
        {entries.map((e, i) => 
            <li key={i}>
                <a href={e.url}>{e.title}</a>
                <ul className="no-bullet">
                    <li>{e.created.toDateString()}</li>
                </ul>
            </li>)}
        </ul>
        {showNext && <a href={C.URLS.BLOG + "/" + (page + 1)}> More </a>}
    </div >