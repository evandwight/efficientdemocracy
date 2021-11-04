import React from 'react';
import * as C from "../../constant";
import { Checkbox } from '../utils';

export const PostModActions = ({ post, miniModVotes, csrfToken }) =>
    <div>
        <h1>Mini-moderator Actions</h1>

        <div>User: {post.user_name}</div>
        <div>Title: {post.title}</div>

        <h2>Fields</h2>
        {C.FIELDS.LIST.map((field, i) => {
            const v = miniModVotes[field];
            return <div key={i}>
                <h4>{C.FIELDS.PROPS[field].PRETTY_LABEL}</h4>
                <form action={C.URLS.SUBMIT_QPOST_MINI_MOD_ACTION + `${field}/${post.id}`} method="POST">
                    <input type="hidden" name="_csrf" value={csrfToken} />
                    <Checkbox name="value" label="Set value:" checked={v?.vote} />
                    <Checkbox name="strike_ups" label="Strike up voters:" checked={v?.strike_ups} />
                    <Checkbox name="strike_downs" label="Strike down voters:" checked={v?.strike_downs} />
                    <Checkbox name="strike_poster" label="Strike poster:" checked={v?.strike_poster}/>
                    <div>
                        <input type="submit" value="Submit" />
                    </div>
                </form>
            </div>
        })}
    </div>;