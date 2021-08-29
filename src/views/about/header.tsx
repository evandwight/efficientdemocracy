import React from 'react';
import * as C from "../../constant";

export const Page = () =>
    <div>
        <table className="bg-blue-400" id="header">
            <tr>
                <td>
                    <a href="/"><b>Efficient Democracy</b></a>
                    <span> </span>
                    <a href={C.URLS.ABOUT_STATUS}>alpha</a>
                    <span> | </span>
                    <a href={C.URLS.ABOUT_WHAT_IS_THIS}>what is this?</a>
                    <span> | </span>
                    <a href={C.URLS.BLOG}>blog</a>
                    <span> | </span>
                    <a href={C.URLS.ABOUT_FAQ}>faq</a>
                </td>
            </tr>
        </table>
        <br />
    </div>
