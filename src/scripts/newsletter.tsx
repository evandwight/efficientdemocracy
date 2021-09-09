import React from "react";
import * as C from "../constant";
import { QPost } from "../db/types";

type propsType = {
    posts: QPost[],
    postsLink: string,
    unsubscribeLink:string,
}

export function Newsletter({posts, postsLink, unsubscribeLink}: propsType) {
    return <div style={{backgroundColor: "#F3F4F6", color: "#111827"}}>
        <div style={{backgroundColor: "#60A5FA"}}>
            <b>Efficient democracy</b> - deeply important posts from hacker news
        </div>
        <div>
            <ul>
                {posts.map((post, i) => 
                    <li key={i}>
                        {post.title} 
                        <ul style={{listStyleType: "none"}}>
                            <li>
                                <a href={`https://efficientdemocracy.com${C.URLS.QPOSTS_VIEW + post.id}`}>
                                    more info
                                </a>
                            </li>
                        </ul>
                    </li>)}
            </ul>
            <br/>
            
        </div>
        <div>
            <br />
            <hr style={{backgroundColor:"#60A5FA"}} />
            <div style={{width: "max-content", margin: "auto"}}><a href={postsLink}>view posts</a> | <a href={unsubscribeLink}>unsubscribe</a></div>
        </div>
    </div>;
}