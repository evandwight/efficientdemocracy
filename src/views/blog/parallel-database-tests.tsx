import React from 'react';
import * as C from '../../constant';

const title = "Parallelizing database tests with jest and postgres";

const element = () =>
    <div>
        <h2>{title}</h2>
        <p>
            Background: I run jest with a parallel test suite and a serial test suite. The serial test suite allows testing of the database and it's integration. The mixing of test suites created two problems: one, jest-serial-runner kept breaking; two, together they dominated my cpu and made the mouse lag searching for test cases.
        </p>
        <p>
            To work around the global database and global connection pool:
        </p>
        <ul>
            <li>I created a copy of the database for each test case</li>
            <li>I made the global pool route to a different database depending on which testcase is running</li>
        </ul>

        <p>
            Postgres makes it easy to create a new database:
        </p>
        <code>
            CREATE DATABASE copy_name WITH TEMPLATE test_red
        </code>
        <p>
            Jest lets you access the current running testcase anywhere, at anytime. Selecting the right pool based on the current test case is simple:
        </p>
        <code>
{`get pool() {
    return this.pools[expect.getState().currentTestName];
}`}
        </code>
        <p>
            Then voila, suddenly after debugging the hundred errors I introduced the database test cases can be run in parallel and I no longer need jest-serial-runner.
        </p>
    </div>

export const Page = { element, title, url: C.URLS.BLOG_PARALLEL_DATABASE_TESTS, created: new Date(2021, 10, 2)};