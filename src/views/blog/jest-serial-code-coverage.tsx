import React from 'react';

const title = "Code coverage and jest-serial-runner";

const URL = "/public/blog/jest-serial-code-coverage/";

const element = () =>
    <div className="about-text">
        <h2>{title}</h2>
        <p>I need to test this website more - it has bugs. In order to <i>save time</i> I decided to setup code coverage. With Jest it's as simple as running</p>
        <code>npm run test -- --coverage</code>
        <img src={URL + "low.png"}/>
        <p>The coverage was strangely low and low in files I know I tested! Eventually, I checked that jest-serial-runner worked.</p>
        <img src={URL + "none.png"}/>
        <p>Eureka!</p>
        <p>The problem is jest-serial-runner uses it's own older version of jest-runner. By editing node_modules directly, I could test if upgrading the version fixed it.</p>
        <img src={URL + "more.png"}/>
        <p>Success!</p>
        <p>To permanently fix this I changed jest-runner from a dependency to a peer dependency, so that jest-serial-runner always uses the same version of jest as your project. I've submited a <a href="https://github.com/gabrieli/jest-serial-runner/pull/14#issue-722019367">pull request</a> to jest-serial-runner and created a new npm module <a href="https://www.npmjs.com/package/jest-serial-runner2">jest-serial-runner2</a>. Two firsts for me but no new tests were written :/</p>
    </div>

export const Page = {element, title};