import React from 'react';
import * as C from '../../constant';

const title = "Replacing ejs with react to generate static html";

const element = () =>
    <div className="about-text">
        <h2>{title}</h2>
        <p><b>TLDR:</b> don't do it if you need to call client side javascript</p>
        <p>I started with <a href="https://ejs.co/">ejs</a> but ran into two problems: first, I couldn't pass parameters to partial views and second, my views kept breaking due to typos and refactoring. The first problem is easy to solve: just read the <a href="https://ejs.co/#docs">docs more carefully</a>! The second problem is more difficult. Here are the solutions I considered:</p>
        <ul>
            <li>Unit test the views - this caught typos but refactoring required carefully updating the tests - pass</li>
            <li>End to end http tests for every view - this would work but I didn't have a way to run http tests at the time - pass</li>
            <li>Use react instead of ejs - compile time type checking and nicer syntax - you son of a bitch I'm in</li>
        </ul>

        <p>Everything was going beautifully. Look at how much prettier it is when you don't need to escape from javascript to "html"!</p>
        <h4>Ejs</h4>
        <code>
{`<% if (posts.length > 0) { %>
    <div>
        <%= posts.forEach(post => { %>
            <%- include("component/post", {post: post}); %>
        <% }) %>
    </div>
<% } %>`}
        </code>
        <h4>React:</h4>
        <code>
            
{`{(posts.length > 0) && 
    <div> 
        {posts.map(post => <Post post={post}/>} 
    </div>`}
        </code>

        <p>Getting the react elements to the client was simple: just call ReactDOMServer.renderToStaticMarkup, put the result in an html template string, and then res.send the result off to the client.</p>

        <p>Then my dreams died when I tried to invoke client side javascript on an onclick handler. React just silently ignored it! React doesn't want a string, it wants a javascript function. That javascript function needs to be webpacked, sent to the client, and linked to the DOM by react. Say goodbye to your simple html + javascript. You need the full react stack! Luckily, you can ignore what react wants and just set onclick using dangerouslySetInnerHTML - ugh.</p>
        
        <p>So thats the story for why I'm living on the wild side. I'll reconsider my solution when I need to put user input inside the danger zone.</p>

        <h4>Summary</h4>
        <p>Pros:</p>
        <ul>
            <li>Compile time type checking</li>
            <li>Prettier syntax as "html" in a javascript context doesn't need escaping</li>
        </ul>
        <p>Cons:</p>
        <ul>
            <li>Safe client side javascript needs client side react</li>
            <li>Views changes require a recompile</li>
        </ul>

    </div>

export const Page = {element, title, url: C.URLS.BLOG_REACT_STATIC_RENDER, created: new Date(2021, 7, 26)};