import React from 'react';
import * as C from '../../constant';
export {Page as ReactStaticRender} from './react-static-render';
export {Page as JestSerialCodeCoverage} from './jest-serial-code-coverage';

export const Blogs = ({ entries, page, showNext }) =>
    <div style={{ paddingLeft: "5px", paddingRight: "5px" }}>
        <h2>Blog</h2>
        <ul>
        {entries.map((e, i) => 
            <li key={i}>
                <a href={e.url}>{e.title}</a>
            </li>)}
        </ul>
        {showNext && <a href={C.URLS.BLOG + "/" + (page + 1)}> More </a>}
    </div >