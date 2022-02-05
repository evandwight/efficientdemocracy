import db from "../../db/databaseApi";
import * as C from "../../constant";
import ReactDOMServer from 'react-dom/server';
import { Newsletter } from "./newsletter";
import { QPost } from "../../db/types";
import { sendEmails } from "../emailUtils";
import { scriptLogger } from "../../logger";


export async function run(key) {
    const users = (await db.users.getUsers())
        .filter(user => !!user.send_emails);
    // const users = [{id: "asdf", unsubscribe_key: "TESTKEY", email: "TESTEMAIl"}];
    scriptLogger.debug({users});

    const postIds = await db.kv.get(key);
    const posts = await Promise.all<QPost>(postIds.map(id => db.qPosts.getPost(id)));
    scriptLogger.debug({posts});
    scriptLogger.debug(newsletterJson({user: {email:"EMAIL", unsubscribe_key:"UNSUB", id: "ID"}, key, posts}));


    const newsletters = users.map(user => newsletterJson({user, key, posts}));
    const result = await sendEmails(newsletters);
    const failures = result.filter(r => !r.success);
    result.forEach(r => scriptLogger.debug(`${r.success ? "sent" : "failed to send"} cognitoId to ${r.toCognitoId} err: ${r.err}`));
    failures.forEach(r => scriptLogger.error({ err: r.err }, `Error sending newsletter ${key} to ${r.toCognitoId}`));
}

function postsToText({posts, postsLink, unsubscribeLink}) {
    const postList = posts.map(post => ` * ${post.title}`).join("\n");
    const text = 
`Deeply important posts from hacker news:
${postList}

View in your browser: ${postsLink}
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
        toCognitoId: user.cognito_id,
        from: "letter@menosmalo.com",
        html: html(Newsletter({posts, postsLink, unsubscribeLink})),
        text: postsToText({posts, postsLink, unsubscribeLink}),
        subject: "Hacker news weekly summary",
    }
}

if (require.main === module) {
    const key = process.argv[2];
    db.initialize()
        .then(() => run(key))
        .catch(err => scriptLogger.error({err}))
        .finally(() => db.end());
}