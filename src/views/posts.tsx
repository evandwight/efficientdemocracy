import * as C from "../constant";
import React from "react";
import { DownVoteButton, Fields, HackerCommentsLink, UpVoteButton } from "./viewPost";
import { QPost, User } from "../db/types";

const SortHeader = ({sortType}) =>
    <div>
        <b>{sortType}</b> | <a href={C.URLS.SORT}>change sort</a>
    </div>;
export const Posts = ({ posts, user, showCensored, moreLink, offset, sortType }: { posts: QPost[], user: User, showCensored: boolean, moreLink: string, offset: number, sortType: string }) => {
    if (posts.length === 0) {
        return <div>
            <SortHeader sortType={sortType}/>
            <div>No results found</div>
        </div>;
    }
    return <div>
        <SortHeader sortType={sortType}/>
        <table id="posts">
            {posts.filter(post => showCensored || !post.censor).map((post, i) => <Post key={i} i={i + offset} {... { post, user }} />)}
        </table>
        {!!moreLink &&
            <div>
                <a href={moreLink}>More</a>
            </div>}
    </div>
}

export const Post = ({ post, i, user }: { post: QPost, i: number, user: User }) => {
    return <tr className={i % 2 === 1 ? "bg-gray-200" : ""}>
        <td className="rank-col">
            {i + 1}
        </td>
        <td className="vote-col">
            <div>
                <UpVoteButton {... { post, i }} />
            </div>
            <div>
                <DownVoteButton {... { post, i }} />
            </div>
        </td>
        <td className="title-col">
            <div>
                {post.censor ? "[Censored]" : post.title}
            </div>
            <div className="gray-500">
                by {post.user_name}
                {!!post.url && <span> | <a href={post.url}>link</a></span>}
                {!!post.hackernews_id && <span> | <HackerCommentsLink id={post.hackernews_id} /></span>}
                <span> | <a href={C.URLS.QPOSTS_VIEW + post.id}>more info</a></span>
                {!!user && user.is_mod && <span> | <a href={C.URLS.QPOSTS_MOD_ACTIONS + post.id}>mod actions</a></span>}
            </div>
            {hasInterestingFields(post) &&
                <div className="gray-500">
                    <Fields post={post} showAllFields={false} showDisputes={false} />
                </div>}
        </td>
    </tr>
}

export const hasInterestingFields = (post) => C.FIELDS.LIST.filter(field => post[field]).length > 0;