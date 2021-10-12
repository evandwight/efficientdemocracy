import React from "react";
import * as C from "../constant";
import { QPost } from "../db/types";
import { HackerCommentsLink } from "../views/viewPost";

type propsType = {
    posts: QPost[],
    postsLink: string,
    unsubscribeLink:string,
}
const BASE_URL = "https://efficientdemocracy.com";

export function dateToStr(date) {
    const dom = date.getDate();
    return `${date.toLocaleDateString('en-US',{weekday: 'short'})} ${dateOrdinal(date.getDate())}`;
}

function dateOrdinal(d) {
    return d+(31==d||21==d||1==d?"st":22==d||2==d?"nd":23==d||3==d?"rd":"th");
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
                        <ul style={{listStyleType: "none", opacity: "50%"}}>
                            <li>
                                by {post.user_name}, {dateToStr(post.created)}
                                {!!post.url && <span> | <a href={post.url}>link</a></span>}
                                {!!post.hackernews_id && <span> | <HackerCommentsLink id={post.hackernews_id}/></span>}
                                <span> | <a href={BASE_URL + C.URLS.QPOSTS_VIEW + post.id}>more info</a></span>
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