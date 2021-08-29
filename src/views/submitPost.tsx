import React from "react";

export const SubmitPost = ({ csrfToken }) =>
    <form action="/submit/qpost" method="POST">
        <input type="hidden" name="_csrf" value={csrfToken} />
        <div>
            <input type="text" id="title" name="title" placeholder="Title" required />
        </div>
        <div>
            <input type="url" id="url" name="url" placeholder="Link" required />
        </div>
        <div>
            <input type="submit" value="Submit" />
        </div>
    </form>;

