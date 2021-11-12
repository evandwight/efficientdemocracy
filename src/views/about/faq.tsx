import React from 'react';
import * as C from '../../constant';

const title = "Frequently asked questions"

const element = () =>
    <div>
        <h2>{title}</h2>
        <p><b>Why is it designed like it's 1999?</b></p>
        <p>Imitation is the sincerest form of flattery. Plus it's easy and fast.</p>
        <p><b>Is this a freedom of speech platform?</b></p>
        <p>No, communities moderate themselves and can be as draconian as they please.</p>
    </div>

export const Faq = { title, element, url: C.URLS.ABOUT_FAQ };