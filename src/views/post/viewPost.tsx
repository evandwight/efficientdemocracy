import React from 'react';
import { DownVoteButton, Fields, HnComments, MiniModActions, ModActions, PostUrl, TimeSince, UpVoteButton, UserName } from "./links";



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
            <UserName name={post.hackernews_user_name || post.user_name}/>
            <TimeSince created={post.created}/>
            <PostUrl url={post.url}/>
            <HnComments hnId={post.hackernews_id}/>
            <ModActions isMod={user?.is_mod} id={post.id}/>
            <MiniModActions isMiniMod={user?.is_mini_mod} id={post.id}/>
          </div>
          <div>
              <Fields post={post} showDisputes={true} showAllFields={true} ignoreFields={[]}/>
          </div>
        </td>
      </tr>
    </table>
  </div>
}
