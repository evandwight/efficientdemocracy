import React from 'react';
import * as C from '../../constant';
export {Page as ReactStaticRender} from './react-static-render';

export const Blogs = ({ entries, page, showNext }) =>
    <div style={{ paddingLeft: "5px", paddingRight: "5px" }}>
        <h2>Blog</h2>
        {entries.map((e, i) => 
            <div key={i}>
                <a href={e.url}><b>{e.title}</b></a>
                <br/>
            </div>)}
        {showNext && <a href={C.URLS.BLOG + "/" + (page + 1)}> More </a>}
    </div >