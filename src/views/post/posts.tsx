import React from "react";
import * as C from "../../constant";
import { QPost, User } from "../../db/types";
import { DownVoteButton, Fields, HnComments, MaybeLink, MiniModActions, ModActions, PostUrl, TimeSince, UpVoteButton, UserName } from "./links";

const SortHeader = ({sortType}) =>
    <div>
        <b>{sortType}</b> | <a href={C.URLS.SORT}>change sort</a>
    </div>;
export const Posts = ({ posts, user, showCensored, moreLink, offset, sortType, ignoreFields}: { posts: QPost[], user: User, showCensored: boolean, moreLink: string, offset: number, sortType: string, ignoreFields: string[] }) => {
    if (posts.length === 0) {
        return <div>
            <SortHeader sortType={sortType}/>
            <div>All done! There are no posts to read, try another sort.</div>
        </div>;
    }
    return <div>
        <SortHeader sortType={sortType}/>
        <table id="posts">
            {posts.filter(post => showCensored || !post.censor).map((post, i) => <Post key={i} i={i + offset} {... { post, user, ignoreFields }} />)}
        </table>
        {!!moreLink &&
            <div>
                <a href={moreLink}>Next page</a>
            </div>}
    </div>
}

export const Post = ({ post, i, user, ignoreFields}: { post: QPost, i: number, user: User, ignoreFields: string[] }) => {
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
                <UserName name={post.hackernews_user_name || post.user_name}/>
                <TimeSince created={post.created}/>
                <PostUrl url={post.url}/>
                <HnComments hnId={post.hackernews_id}/>
                <MaybeLink maybe={true} href={C.URLS.QPOSTS_VIEW + post.id}>details</MaybeLink>
                <ModActions isMod={user?.is_mod} id={post.id}/>
                <MiniModActions isMiniMod={user?.is_mini_mod} id={post.id}/>
            </div>
            {hasInterestingFields(post, ignoreFields) &&
                <div className="gray-500">
                    <Fields post={post} showAllFields={false} showDisputes={false} ignoreFields={ignoreFields}/>
                </div>}
        </td>
    </tr>
}

export const hasInterestingFields = (post, ignoreFields) => 
    C.FIELDS.LIST.filter(field => post[field] && ignoreFields.indexOf(field) === -1).length > 0
    