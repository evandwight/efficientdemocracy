import * as C from "../constant";
import React from "react";
import { DownVoteButton, Fields, UpVoteButton } from "./viewPost";


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
            <div className="gray-500">
                by {post.user_name}
                {!!post.url && <span> | <a href={post.url}>link</a></span>}
                <span> | <a href={C.URLS.QPOSTS_VIEW + post.id}>more info</a></span>
                {!!user && user.is_mod && <span> | <a href={C.URLS.QPOSTS_MOD_ACTIONS + post.id}>mod actions</a></span>}
            </div>
            {hasInterestingFields(post) && 
                <div className="gray-500">
                    <Fields post={post} showAllFields={false} showDisputes={false}/>
                </div>}
        </td>
    </tr>
}

export const hasInterestingFields = (post) => C.FIELDS.LIST.filter(field => post[field]).length > 0;