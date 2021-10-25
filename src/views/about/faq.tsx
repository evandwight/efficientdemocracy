import React from 'react';
import * as C from '../../constant';

const title = "Frequently asked questions"

const element = () =>
    <div>
        <h2>{title}</h2>
        <p><b>Why does it look ... the way it does?</b></p>
        <p>I don't know how to program, but even I can write fast html.</p>
    </div>

export const Faq = { title, element, url: C.URLS.ABOUT_FAQ };