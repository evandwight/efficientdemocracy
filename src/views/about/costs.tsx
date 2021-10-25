import React from 'react';
import * as C from '../../constant';

const title = "Costs"

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>
            We aim to keep costs low in order to avoid outside investment and being forced to optimize for investors instead of users.
        </p>
        <p>
            The people are the foundation for decisions. Not advertisers. Not investors. Not lizard people. The community decides.
        </p>
        <h4>Current costs per month: $4</h4>
        <ul>
            <li>$1 - domain</li>
            <li>$3 - external ip address</li>
        </ul>
    </div>

export const Costs = { title, element, url: C.URLS.ABOUT_COSTS };