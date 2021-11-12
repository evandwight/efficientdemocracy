import * as C from '../constant';
import React from 'react';

export const PastNewsletters = ({keys}) => 
    <div className="highlight-links">
        {keys.map((key, i) => 
            <div key={i}>
                <a href={`${C.URLS.FROZEN_QPOSTS}${key}`}>{key}</a>
            </div>
        )}
    </div>