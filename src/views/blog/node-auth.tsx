import React from 'react';
import * as C from '../../constant';

const title = "Authentication with express";

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>
            Authentication is complex. The happy path is simple but <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html">making it secure isn't</a>. Express doesn't have a standard way to do authentication; you have to write your own. Now that I've rewritten mine 3 times I can say aws cognito seems like a decent choice for business to consumer apps. First I'll consider alternatives and then explain why I think cognito is better.
        </p>
        <h3>Write it myself</h3>
        <p>
            PassportJs provides an easy local-auth strategy that has a painless setup. The problem is how do you know it's secure? Without a security expert what you wrote may leak sensitve information.
        </p>
        <h3>Run ruby's <a href="https://github.com/heartcombo/devise">devise</a></h3>
        <p>
            The setup and running has complications. Doubly so since I don't know ruby on rails. Also, to keep it separate from the main app means an entirely separate server. That doubles the number of servers!
        </p>
        <h3>Auht0</h3>
        <p>
            I've seen auth0 widely recommended but their prices are intended for business to employee apps and not business to consumer apps. I wrongly assumed this was typical.
        </p>
        <h3>Aws cognito</h3>
        <p>
            Aws cognito is inexpensive. For any user count I'm likely to need it's less than the equivalent server. It's also easy to setup - only one day to configure and integrate it.
        </p>
        <p>
            I haven't reviewed the security, but not even I can access the passwords. All sensitive information is only used by aws lambda functions. For example, to send an email the app tells lambda the recipient's cognito id. The email never leaves cognito + lambda. However, two things concern me:
        </p>
        <ul>
            <li>Register has no captcha to protect leaking of emails through guess and check</li>
            <li>Login only produces an "access" oauth2 token, not an "id" token that fits my purpose better</li>
        </ul>
        <p>
            Though not perfect, aws cognito provides a trustworthy authentication that I don't need to think about. I wish I knew about it sooner :P
        </p>
    </div>

export const Page = { element, title, url: C.URLS.BLOG_NODE_AUTH, created: new Date(2021, 10, 27)};