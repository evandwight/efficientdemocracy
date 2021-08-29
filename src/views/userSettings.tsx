import React from 'react';

export const UserSettings = ({user}) =>
  <div>
    <h1>User settings</h1>
    <div>User name: {user.user_name}</div>
    <div>Email: {user.email}</div>
  </div>
