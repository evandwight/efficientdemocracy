import * as C from "../constant";
import React from "react";
import { DownVoteButton, UpVoteButton } from "./viewPost";

export const Post = (post, i, user) => {
    return <tr className={i % 2 === 1 ? "bg-gray-200" : ""} key={i}>
        <td className="rank-col">
                {i + 1}
        </td>
        <td className="vote-col">
            <div>
                <UpVoteButton post={post} i={i}/>
            </div>
            <div>
                <DownVoteButton post={post} i={i}/>
            </div>
        </td>
        <td className="title-col">
            <div>
                {post.censor ? "[Censored]" : post.title}
            </div>
            <div>
                by <span className="gray-900">{post.user_name}</span>
                {!!post.url && <span> | <a href={post.url}>link</a></span>}
                <span> | <a href={C.URLS.QPOSTS_VIEW + post.id}>details</a></span>
                {!!user && user.is_mod && <span> | <a href={C.URLS.QPOSTS_MOD_ACTIONS + post.id}>mod actions</a></span>}
            </div>
        </td>
    </tr>
}

export const Posts = ({ posts, user, showCensored, moreLink, offset }) => {
    if (posts.length === 0) {
        return <div>No results found</div>;
    }
    return <div>
        <table id="posts">
        {posts.filter(post => showCensored || !post.censor).map((post, i) => Post(post, i + offset, user))}
        </table>
        <div>
            <a href={moreLink}>More</a>
        </div>
    </div>
}