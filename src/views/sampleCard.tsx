import React from 'react';
import * as C from "../constant";
import {Checkbox} from "./utils";

function Post({post}) {
    return <div>
        <div>{post.title}</div>
        <div>
          By <span className="gray-900">{post.user_name}</span>  
          {!!post.url && <span> | <a href={post.url}>link</a></span>}
        </div>
    </div>
}

export const SampleCard = ({user, csrfToken}) => {
  const {post, field} = user.sample;
  const config = C.FIELDS.PROPS[field].SAMPLE_CARD;
  return <div className="card">
    {config.TITLE}
    <div className="card">
        <Post post={post} />
    </div>

    <form action={C.URLS.SUBMIT_SAMPLE_VOTE + user.sample.id} method="POST">
      <input type="hidden" name="_csrf" value={csrfToken} />
      <Checkbox name="value" label={config.VALUE_LABEL} checked={post[field]}/>
      {config.STRIKE.POST_VISIBILITY && <Checkbox name="strike_ups" label="Strike up voters:"/>}
      {config.STRIKE.POST_VISIBILITY  && <Checkbox name="strike_downs" label="Strike down voters:"/>}
      {config.STRIKE.POST_VISIBILITY  && <Checkbox name="strike_poster" label="Strike poster:"/>}
      <Checkbox name="strike_disputers" label="Strike disputers:"/>
      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>
  </div>;
}