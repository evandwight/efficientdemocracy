import React from "react";
import * as C from '../constant';

function FormField({type, id, labelText, required, value}
    :{type: string, id: string, labelText: string, required? : boolean, value?: string}) {
  required = !!required;
  value = value || "";
  return <div>
    <label htmlFor={id}>{labelText}</label>
    <input type={type} id={id} name={id} required={required} value={value}/>
  </div>
}


export const Register = ({ errors, defaultValues, csrfToken }) =>
  (<div>
    <h1>Register</h1>

    Registration closed.
{/* 
    {(typeof errors != 'undefined') &&
      <ul>
        {errors.map(error =>
          (<li> {error.message}</li>))}
      </ul>}

    <form action="/users/register" method="POST">
      <input type="hidden" name="_csrf" value={csrfToken} />
      <FormField type="text" id="name" labelText="Name:" value={defaultValues.name}/>
      <FormField type="text" id="userName" labelText="User name:" value={defaultValues.userName}/>
      <FormField type="email" id="email" labelText="Email:" value={defaultValues.email}/>
      <FormField type="password" id="password" labelText="Password:" value={defaultValues.password}/>
      <FormField type="password" id="password2" labelText="Confirm password:" value={defaultValues.password2}/>
      <FormField type="text" id="code" labelText="Secret code:" value={defaultValues.code}/>
      <div>
        <input type="submit" value="Register" />
      </div>

      <p>Already have an account? <b><a href={C.URLS.USER_LOGIN}>Login</a></b></p>
    </form>*/}
  </div>);