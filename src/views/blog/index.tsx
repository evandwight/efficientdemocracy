import React from 'react';
import * as C from '../../constant';
export {Page as ReactStaticRender} from './react-static-render';
export {Page as JestSerialCodeCoverage} from './jest-serial-code-coverage';
export {Page as CspInlineScript} from './csp-inline-script';
export {Page as SamplingIsMagic} from './sampling-is-magic';
export {Page as Caching} from './caching';
export {Page as MicroserviceOrMonolith} from './microservice-or-monolith';

export const Blogs = ({ entries, page, showNext }) =>
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