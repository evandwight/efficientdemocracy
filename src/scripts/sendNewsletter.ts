import { fromIni } from "@aws-sdk/credential-providers";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import db from "../db/databaseApi";
import * as C from "../constant";
import ReactDOMServer from 'react-dom/server';
import { Newsletter } from "./newsletter";


const lambda = new LambdaClient({
    region: "us-east-1",
    credentials: fromIni(),
});

async function run(key) {
    const users = (await db.users.getUsers())
        .filter(user => !!user.send_emails);
    // const users = [{id: "asdf", unsubscribe_key: "TESTKEY", email: "TESTEMAIL"}];
    console.log(users);

    const postIds = await db.kv.get(key);
    const posts = await Promise.all(postIds.map(id => db.qPosts.getPost(id)));
    console.log(posts);

    console.log(postsToText({posts, postsLink:"asdf", unsubscribeLink: "adsf"}));

    await Promise.all(users.map(user => sendNewsletter({
        email: user.email,
        postsLink: `https://efficientdemocracy.com${C.URLS.FROZEN_QPOSTS}${key}`,
        unsubscribeLink: `https://efficientdemocracy.com${C.URLS.EMAIL_UNSUBSCRIBE}${user.id}/${user.unsubscribe_key}`,
        posts
    }).then(() => console.log(`sent email to ${user.email}`))));
    
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



async function sendNewsletter({email, postsLink, unsubscribeLink, posts}) {
    return sendEmail({
        to: email,
        html: html(Newsletter({posts, postsLink, unsubscribeLink})),
        text: postsToText({posts, postsLink, unsubscribeLink}),
        subject: "Efficient democracy - newsletter",
    });
}

function sendEmail(json) {
    return lambda.send(new InvokeCommand({
        FunctionName: "sendEmail",
        InvocationType: "RequestResponse",
        LogType: "None",
        Payload: new TextEncoder().encode(JSON.stringify(json)),
    })).then(data => {
        const payload = JSON.parse(new TextDecoder("utf-8").decode(data.Payload));
        // TODO I don't know the correct way to catch errors
        if (data.FunctionError !== undefined) {
            throw new Error(JSON.stringify(payload));
        } else {
            return payload;
        }
    }).catch(err => console.log(err));
}

if (require.main === module) {
    console.log("Main mode");
    const key = process.argv[2];
    console.log(`Sending ${key}`);
    db.initialize();
    run(key).then(() => db.end());
}