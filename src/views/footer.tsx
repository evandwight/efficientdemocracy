import React from "react";
import * as C from '../constant';

export const Footer = () =>
<div>
    <br/>
    <hr className="blue-400"/>
    <div style={{display:"flex", justifyContent:"center"}}>
        <a href={C.URLS.ABOUT_LEGAL}>legal</a>
    </div>
    <br/>
</div>