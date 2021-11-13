import React from 'react';
import * as C from '../../constant';

const title = "Frequently asked questions"

const element = () =>
    <div>
        <h2>{title}</h2>
        <p><b>Why is it designed like it's 1999?</b></p>
        <p>
            Imitation is the sincerest form of flattery. Plus it's easy and fast.
        </p>
        <p><b>Is this a freedom of speech platform?</b></p>
        <p>
            No, communities moderate themselves and can be as draconian as they please.
        </p>
        <p><b>How could statistical samples possibly work when election polls are so often wrong?</b></p>
        <p>
            Close elections are difficult to predict. Blowout elections are not. We are trying to categorize posts where there is clear consensus - a supermajority. A 51% to 49% split only shows that the categorization is contentious.
        </p>
        <p>
            When an issue is contentious and important to decide, then we call a referendum. Referendums remove all possibility of mistaken results.
        </p>
        <p><b>How do we stop fake accounts?</b></p>
        <p>
            Once fake accounts become a problem, we will verify identities for all new accounts[11]. Depending on the severity of the problem, we may mail one-time codes to verify addresses.
        </p>
        <p>
            We will not show real identities publicly. Publicly there is only a changeable pseudonym.
        </p>
        <p><b>Why a centralized service?</b></p>
        <p>
            Centralized services are easier to write. Even federated services have a problem with centralization - I have to pay amazon to send an email! In the future, I hope to decentralize certain aspects.
        </p>
    </div>

export const Faq = { title, element, url: C.URLS.ABOUT_FAQ };