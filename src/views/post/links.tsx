import React from 'react';
import * as C from '../../constant';
import { dateToTimeSince } from '../utils';


export const Links = ({ post, user }) => {

    <div>
        by <span className="gray-900">{post.user_name}</span>
        ,  <span className="whitespace-nowrap">{dateToTimeSince(post.created)}</span>
        <MaybeLink maybe={!!post.url} href={post.url}>
            link
        </MaybeLink>
        <MaybeLink maybe={!!post.hackernews_id} href={`https://news.ycombinator.com/item?id=${post.hackernews_id}`}>
            hn comments
        </MaybeLink>
        <MaybeLink maybe={!!user?.is_mod} href={C.URLS.QPOSTS_MOD_ACTIONS + post.id}>
            mod actions
        </MaybeLink>
        <MaybeLink maybe={!!user?.is_mini_mod} href={C.URLS.QPOSTS_MOD_ACTIONS + post.id}>
            mini mod actions
        </MaybeLink>
    </div>
}

export const UserName = ({ name }) => <span>by <span className="gray-900">{name}</span></span>

export const TimeSince = ({ created }) => <span>, {dateToTimeSince(created)}</span>
export const PostUrl = ({ url }: { url?: string }) => <MaybeLink maybe={!!url} href={url}>link</MaybeLink>
export const HnComments = ({ hnId }) => <MaybeLink maybe={!!hnId} href={C.URLS.HN_COMMENT + hnId}>hn comments</MaybeLink>

export const ModActions = ({ isMod, id }) =>
    <MaybeLink maybe={isMod} href={C.URLS.QPOSTS_MOD_ACTIONS + id}>mod actions</MaybeLink>

export const MiniModActions = ({ isMiniMod, id }) =>
    <MaybeLink maybe={isMiniMod} href={C.URLS.QPOSTS_MINI_MOD_ACTIONS + id}>mini mod actions</MaybeLink>

export const MaybeLink = ({ maybe, href, children }: { maybe: boolean, href: string, children: string }) =>
    maybe ? <span> | <a className="whitespace-nowrap" href={href}>{children}</a></span> : <></>;

export const DisputeLink = ({ post, field }) =>
    <a className="onclick-post" href={`${C.URLS.SUBMIT_QPOST_DISPUTE}${post.id}/${field}/${!post[field]}`}>
        dispute
    </a>;

export const UpVoteButton = ({ post, i }: { post: any; i?: number; }) => {
    const active = post.hasOwnProperty('vote') ? post.vote === C.VOTE.UP : false;
    i = i || 0;
    return <a className="center-h icon onclick-vote"
        title="Up vote" id={`up-${i}`} data-other={`down-${i}`}
        href={`${C.URLS.SUBMIT_QPOST_VOTE}${post.id}/${active ? C.VOTE.NONE : C.VOTE.UP}`}>
        <img style={{ width: "1em" }} src={`/public/icons/caret-up-${active ? "active" : "inactive"}.svg`} />
    </a>;
};

export const DownVoteButton = ({ post, i }: { post: any; i?: number; }) => {
    const active = post.hasOwnProperty('vote') ? post.vote === C.VOTE.DOWN : false;
    i = i || 0;
    return <a className="rotate-180 center-h icon onclick-vote"
        title="Down vote" id={`down-${i}`} data-other={`up-${i}`}
        href={`${C.URLS.SUBMIT_QPOST_VOTE}${post.id}/${active ? C.VOTE.NONE : C.VOTE.DOWN}`}>
        <img style={{ width: "1em" }} src={`/public/icons/caret-up-${active ? "active" : "inactive"}.svg`} />
    </a>;
};

export const Fields = ({ post, showDisputes, showAllFields, ignoreFields }) =>
    <span>
        {C.FIELDS.LIST
            .filter(field => !!showAllFields || (post[field] && ignoreFields.indexOf(field) === -1))
            .reduce((acc, field, i) => [...acc,
            <span key={i}>
                {i > 0 && <span>, </span>}
                <a className={!!post[field] ? (C.FIELDS.PROPS[field].GOODNESS ? "green-500" : "red-500") : ""}
                    href={`${C.URLS.QPOSTS_VIEW_MOD_ACTION}${post.id}/${field}`}>
                    {C.FIELDS.PROPS[field].PRETTY_PRINT[post[field] ? 1 : 0]}
                </a>
                {!!showDisputes &&
                    <span> (<DisputeLink {... { post, field }} />)</span>}
            </span>
            ], [])}
    </span>