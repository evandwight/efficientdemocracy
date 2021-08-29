
import React from 'react';
import * as C from '../constant';
import { stringifyResult } from './viewSampleResult';

export const ViewSamples = ({ samples }) => 
<div className="highlight-links">
    <h2>Samples</h2>
    <ul>
    {samples.map((sample, i) => 
        <li key={i}>
            <a href={C.URLS.VIEW_SAMPLE_RESULT + sample.id}>
                {sample.type === C.SAMPLE.TYPE.LEVEL_1 ? "Sample" : "Referendum"}
            </a>
            <ul style={{"listStyleType": "none"}}>
                <li>{stringifyResult(sample)}</li>
            </ul>
        </li>)}
    </ul>
</div>