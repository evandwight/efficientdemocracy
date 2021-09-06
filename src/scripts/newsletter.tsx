import React from "react";
import * as C from "../constant";

export function Newsletter({posts, postsLink, unsubscribeLink}) {
    return <div>
        <h2>Deeply important posts</h2>
        <ul>
            {posts.map((post, i) => 
                <li key={i}>
                    {post.title} 
                    <ul>
                        <li>
                            <a href={`https://efficientdemocracy.com${C.URLS.QPOSTS_VIEW + post.id}`}>
                                more info
                            </a>
                        </li>
                    </ul>
                </li>)}
        </ul>
        <br/>
        <div><a href={postsLink}>View posts</a></div>
        <div><a href={unsubscribeLink}>Unsubscribe</a></div>
    </div>;
}