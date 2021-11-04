import React from 'react';
import * as C from "../constant";
import { Checkbox } from './utils';

export const ViewSetMiniMods = ({users, csrfToken}) =>
  <div>
    <h1>Set mini mods</h1>
    <table>{users.map((user,i) => 
        <tr key={i}>
            <td>{user.user_name}</td>
            <td><input className="onclick-post" type="checkbox" defaultChecked={user.is_mini_mod}
                data-href={`${C.URLS.MOD_SUBMIT_SET_MINI_MOD}${user.id}/`}
                data-checkable/>
            </td>
        </tr>     
    )}</table>
  </div>