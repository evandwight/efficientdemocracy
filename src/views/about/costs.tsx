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
            The community decides. Not advertisers. Not investors. Not lizard people. The community.
        </p>
        <h4>Current costs per month: $4</h4>
        <ul>
            <li>$1 - domain</li>
            <li>$3 - external ip address</li>
            <li>$0.25 - random aws alarms :/</li>
        </ul>
    </div>

export const Costs = { title, element, url: C.URLS.ABOUT_COSTS };