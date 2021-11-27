const assert = require("assert");
const aws = require("aws-sdk");
const ses = new aws.SES({ region: "us-east-1" });
const docClient = new aws.DynamoDB.DocumentClient();

exports.handler = async function (event) {
    var { subject, text, html, to, from } = event;

    return sendEmail({ to, from, text, html, subject });
};

function notOnBlackList(email) {
    const Key = { email };
    return docClient.get({ TableName: "email-blacklist", Key })
        .promise()
        .then(data => !data.hasOwnProperty("Item"));
}

async function sendEmail({ to, from, text, html, subject }) {
    assert([...to].filter(c => c === "@").length === 1, "There needs to be one email only");
    assert(await notOnBlackList(to), "Email on blacklist");

    from = from || "info@efficientdemocracy.com";

    var body = {};
    if (text) {
        body.Text = { Data: text };
    }
    if (html) {
        body.Html = { Data: html };
    }

    var params = {
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Body: body,

            Subject: { Data: subject },
        },
        Source: from,
    };

    return ses.sendEmail(params).promise();
}