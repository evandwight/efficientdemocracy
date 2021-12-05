import React from "react";
import * as C from "../../constant";
import { QPost } from "../../db/types";

type propsType = {
    posts: QPost[],
    postsLink: string,
    unsubscribeLink:string,
}

export function dateToStr(date) {
    return `${date.toLocaleDateString('en-US',{weekday: 'short'})} ${dateOrdinal(date.getDate())}`;
}

function dateOrdinal(d) {
    return d+(31==d||21==d||1==d?"st":22==d||2==d?"nd":23==d||3==d?"rd":"th");
}

const GREY_500 = "#6B7280";
const GREY_900 = "#111827";
const BLUE_400 = "#60A5FA";
export function Newsletter({posts, postsLink, unsubscribeLink}: propsType) {
    return <div style={{color: GREY_900}}>
        <div style={{color: BLUE_400}}>
            <h4>Deeply important posts from hacker news</h4>
            Just the news you need and no more
        </div>
        <br/>
        <div>
            {posts.map((post, i) => 
                <div key={i}>
                    <div>{post.title}</div>
                    <div style={{color: GREY_500}}>
                        by {post.hackernews_user_name || post.user_name}, {dateToStr(post.created)}
                        {!!post.url && <span> | <a href={post.url}>link</a></span>}
                        {!!post.hackernews_id && <span> | <a href={C.URLS.HN_COMMENT + post.hackernews_id}>
                                hn comments
                            </a></span>}
                        <span> | <a href={C.URLS.BASE_URL + C.URLS.QPOSTS_VIEW + post.id}>details</a></span>
                    </div>
                </div>)}
            <br/>            
        </div>
        <div>
            <br />
            <hr style={{backgroundColor: BLUE_400}} />
            <div style={{width: "max-content", margin: "auto"}}>
                <a href={postsLink}>view in your browser</a> | <a href={unsubscribeLink}>unsubscribe</a>
            </div>
        </div>
    </div>;
}