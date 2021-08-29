import React from 'react';
import * as C from "../constant";
import { Checkbox } from './utils';


export const VersionInput = ({field, modActions}) => {
  const ma = modActions[field];
  return !!ma ?  <input type="hidden" name="version" value={ma.version} /> : null;
}

export const PostModActions = ({ post, modActions, csrfToken }) => 
 <div>
    <h1>Moderator Actions</h1>


    <div>User: {post.user_name}</div>
    <div>Title: {post.title}</div>

    <div>Current mod action: {JSON.stringify(modActions)}</div>

    <h4>Censor</h4>

    <form action={C.URLS.SUBMIT_QPOST_MOD_ACTION + `${C.SAMPLE.FIELDS.CENSOR}/${post.id}`} method="POST">
      <input type="hidden" name="_csrf" value={csrfToken} />
      <VersionInput field={C.SAMPLE.FIELDS.CENSOR} modActions={modActions} />
      <Checkbox name="censor" label="Set censor:" checked={post.censor}/>
      <Checkbox name="strike_ups" label="Strike up voters:"/>
      <Checkbox name="strike_downs" label="Strike down voters:"/>
      <Checkbox name="strike_poster" label="Strike poster:"/>
      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>

    <h4>Deeply important</h4>

    <form action={C.URLS.SUBMIT_QPOST_MOD_ACTION + `${C.SAMPLE.FIELDS.DEEPLY_IMPORTANT}/${post.id}`} method="POST">
      <input type="hidden" name="_csrf" value={csrfToken} />
      <VersionInput field={C.SAMPLE.FIELDS.DEEPLY_IMPORTANT} modActions={modActions} />
      <Checkbox name="value" label="Set deeply important:" checked={post.deeply_important}/>
      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>
  </div>;