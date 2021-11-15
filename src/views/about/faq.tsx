import React from 'react';
import * as C from '../../constant';

const title = "Frequently asked questions"

const element = () =>
    <div>
        <h2>{title}</h2>
        <div id="why-1999">
            <h4>Why is it designed like it's 1999?</h4>
            <p>
                Imitation is the sincerest form of flattery. Plus it's easy and fast.
            </p>
        </div>
        <div id="freedom-of-speech">
            <h4>Is this a freedom of speech platform?</h4>
            <p>
                No, communities moderate themselves and can be as draconian as they please.
            </p>
        </div>
        <div id="nazi">
            <h4>You are just making a forum for nazis!</h4>
            <p>
                Most people aren't nazis. They seem prevalent online because they are active and loud. Proxies stop active people from controlling the community.
            </p>
        </div>
        <div id="election-polls">
            <h4>How could statistical samples possibly work when election polls are so often wrong?</h4>
            <p>
                Close elections are difficult to predict. Blowout elections are not. We are trying to categorize posts where there is clear consensus - a supermajority. A 51% to 49% split only shows that the categorization is contentious.
            </p>
            <p>
                When an issue is contentious and important to decide, then we call a referendum. Referendums remove all possibility of mistaken results.
            </p>
        </div>
        <div id="fake-accounts">
            <h4>How do we stop fake accounts?</h4>
            <p>
                Once fake accounts become a problem, we will verify identities for all new accounts. Depending on the severity of the problem, we may mail one-time codes to verify addresses.
            </p>
            <p>
                We will not show real identities publicly. Publicly there is only a changeable pseudonym.
            </p>
        </div>
        <div id="federation">
            <h4>Why a centralized service?</h4>
            <p>
                Centralized services are easier to write. Even federated services have a problem with centralization - I have to pay amazon to send an email! In the future, I hope to decentralize certain aspects.
            </p>
        </div>
    </div>

export const Faq = { title, element, url: C.URLS.ABOUT_FAQ };