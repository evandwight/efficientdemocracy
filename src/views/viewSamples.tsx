
import React from 'react';
import * as C from '../constant';
import { stringifyResult } from './viewSampleResult';

// TODO separate each field into it's own section, currently they are just grouped by sql sorting field, type.
export const ViewSamples = ({ samples }) => 
<div className="highlight-links">
    <h2>Samples</h2>
    <ul>
    {samples.map((sample, i) => 
        <li key={i}>
            <a href={C.URLS.VIEW_SAMPLE_RESULT + sample.id}>
                {sample.type === C.SAMPLE.TYPE.LEVEL_1 ? "Sample " : "Referendum "}
                on {C.FIELDS.PROPS[sample.field].PRETTY_LABEL}
            </a>
            <ul style={{"listStyleType": "none"}}>
                <li>{stringifyResult(sample)}</li>
            </ul>
        </li>)}
    </ul>
</div>