import * as C from "../constant";
import React from "react";
import { DownVoteButton, UpVoteButton } from "./viewPost";


export const Posts = ({ posts, user, showCensored, moreLink, offset }) => {
    if (posts.length === 0) {
        return <div>No results found</div>;
    }
    return <div>
        <table id="posts">
        {posts.filter(post => showCensored || !post.censor).map((post, i) => <Post key={i} i={i+offset} {... {post, user}}/>)}
        </table>
        <div>
            <a href={moreLink}>More</a>
        </div>
    </div>
}

export const Post = ({post, i, user}) => {
    return <tr className={i % 2 === 1 ? "bg-gray-200" : ""}>
        <td className="rank-col">
                {i + 1}
        </td>
        <td className="vote-col">
            <div>
                <UpVoteButton {... {post, i}}/>
            </div>
            <div>
                <DownVoteButton {... {post, i}}/>
            </div>
        </td>
        <td className="title-col">
            <div>
                {post.censor ? "[Censored]" : post.title}
            </div>
            <div>
                by <span className="gray-900">{post.user_name}</span>
                {!!post.url && <span> | <a href={post.url}>link</a></span>}
                <span> | <a href={C.URLS.QPOSTS_VIEW + post.id}>more info</a></span>
                {!!user && user.is_mod && <span> | <a href={C.URLS.QPOSTS_MOD_ACTIONS + post.id}>mod actions</a></span>}
            </div>
            {hasInterestingFields(post) && 
                <div>
                    {fieldsToString(post)}
                </div>}
        </td>
    </tr>
}

export const hasInterestingFields = (post) => C.SAMPLE.FIELD_LIST.filter(field => post[field]).length > 0;

export const fieldsToString = (post) => 
    C.SAMPLE.FIELD_LIST
        .filter(field => post[field])
        .map(field => C.SAMPLE.FIELDS_PRETTY[field][1])
        .join(" | ");