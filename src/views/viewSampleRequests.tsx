import React from 'react';
import * as C from '../constant';

export const ViewSampleRequests = ({ samples }) =>
    <div>
        <h4>Active samples</h4>
        {samples.length === 0
            ? <div>No active samples</div>
            : <div className="highlight-links">
                {samples.map((e, i) =>
                    <div key={i} className={i % 2 === 1 ? "bg-gray-200" : ""}>
                        <div>{e.post.title}</div>
                        <div>{C.FIELDS.PROPS[e.field].PRETTY_LABEL} | <a href={C.URLS.VIEW_SAMPLE_REQUEST + e.id}>vote</a></div>
                    </div>)}
            </div>
        }
    </div>