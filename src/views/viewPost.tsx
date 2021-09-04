import * as C from '../constant';
import React from 'react';

export const DisputeLink = ({post, field}) => 
  <a className="onclick-post" 
    href={`${C.URLS.SUBMIT_QPOST_DISPUTE}${post.id}/${field}/${!post.censor}`}>
      dispute
    </a>

export const UpVoteButton = ({post, i}: {post:any, i?: number}) => {
  const active = post.hasOwnProperty('vote') ? post.vote === C.VOTE.UP : false; 
  i = i || 0;
  return <a className="center-h icon onclick-vote"
    title="Up vote" id={`up-${i}`} data-other={`down-${i}`}
    href={`${C.URLS.SUBMIT_QPOST_VOTE}${post.id}/${active ? C.VOTE.NONE : C.VOTE.UP}`}>
      <img style={{width: "1em"}} src={`/public/icons/caret-up-${active ? "active" : "inactive"}.svg`}/>
    </a>
}

export const DownVoteButton = ({post, i} : {post:any, i?: number}) => {
  const active = post.hasOwnProperty('vote') ? post.vote === C.VOTE.DOWN : false; 
  i = i || 0;
  return <a className="rotate-180 center-h icon onclick-vote"
    title="Down vote" id={`down-${i}`} data-other={`up-${i}`}
    href={`${C.URLS.SUBMIT_QPOST_VOTE}${post.id}/${active ? C.VOTE.NONE : C.VOTE.DOWN}`}>
      <img style={{width: "1em"}} src={`/public/icons/caret-up-${active ? "active" : "inactive"}.svg`}/>
    </a>
}

export const ViewPost = ({ post, user }) => {
  return <div>
    <table>
      <tr>
        <td className="vote-col">
          <div>
              <UpVoteButton post={post}/>
          </div>
          <div>
              <DownVoteButton post={post}/>
          </div>
        </td>
        <td className="title-col">
          <div>{post.title}</div>
          <div>
            by <span className="gray-900">{post.user_name}</span>
            {!!post.url && <span> | <a href={post.url}>link</a></span>}
            {!!user && user.is_mod && <span> | <a href={C.URLS.QPOSTS_MOD_ACTIONS + post.id}>mod actions</a></span>}
            {post.has_samples > 0 && <span> | <a href={C.URLS.VIEW_SAMPLES + post.id}>view samples</a></span>}
          </div>
          <div>
              <Fields {... {post}}/>
          </div>
        </td>
      </tr>
    </table>
  </div>
}

export const Fields = ({post}) => 
  <span>
    {C.SAMPLE.FIELD_LIST.reduce((acc, field, i) => [... acc, 
        <span key={i}>
          {i > 0 && <span>, </span>}
          {C.SAMPLE.FIELDS_PRETTY[field][post[field] ? 1 : 0]}
          <span> </span>
          (<DisputeLink {... {post, field}}/>)
        </span>
      ], [])}
  </span>