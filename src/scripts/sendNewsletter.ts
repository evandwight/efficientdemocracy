import db from "../db/databaseApi";
import * as C from "../constant";
import ReactDOMServer from 'react-dom/server';
import { Newsletter } from "./newsletter";
import { QPost } from "../db/types";
import { sendEmails } from "./emailUtils";
import { logger } from "../logger";


export async function run(key) {
    const users = (await db.users.getUsers())
        .filter(user => !!user.send_emails && user.email_state === C.USER.EMAIL_STATE.VERIFIED_GOOD);
    // const users = [{id: "asdf", unsubscribe_key: "TESTKEY", email: "TESTEMAIl"}];
    console.log(users);

    const postIds = await db.kv.get(key);
    const posts = await Promise.all<QPost>(postIds.map(id => db.qPosts.getPost(id)));
    console.log(posts);
    console.log(newsletterJson({user: {email:"EMAIL", unsubscribe_key:"UNSUB", id: "ID"}, key, posts}));


    const newsletters = users.map(user => newsletterJson({user, key, posts}));
    const result = await sendEmails(newsletters);
    const failures = result.filter(r => !r.success);
    result.forEach(r => console.log(`${r.success ? "sent" : "failed to send"} email to ${r.to} err: ${r.err}`));
    failures.forEach(r => logger.error({ err: r.err }, `Error sending newsletter ${key} to ${r.to}`));
}

function postsToText({posts, postsLink, unsubscribeLink}) {
    const postList = posts.map(post => ` * ${post.title}`).join("\n");
    const text = 
`Deeply important posts:
${postList}

View list: ${postsLink}
Unsubscribe: ${unsubscribeLink}`;
    return text;
}

function html(element) {
    const innerHtml = ReactDOMServer.renderToStaticMarkup(element);
    const htmlTemplate = 
`<!DOCTYPE html>
<html lang="en">

<head>
</head>

<body>
    ${innerHtml}
</body>
</html>`
    return htmlTemplate;
}


function newsletterJson({user, key, posts}) {
    const postsLink = `${C.URLS.BASE_URL}${C.URLS.FROZEN_QPOSTS}${key}`;
    const unsubscribeLink = `${C.URLS.BASE_URL}${C.URLS.EMAIL_UNSUBSCRIBE}${user.id}/${user.unsubscribe_key}`;

    return {
        to: user.email,
        from: "hackernewsletter@efficientdemocracy.com",
        html: html(Newsletter({posts, postsLink, unsubscribeLink})),
        text: postsToText({posts, postsLink, unsubscribeLink}),
        subject: "Efficient democracy - newsletter",
    }
}

if (require.main === module) {
    console.log("Main mode");
    const key = process.argv[2];
    console.log(`Sending ${key}`);
    db.initialize();
    run(key).then(() => db.end());
}