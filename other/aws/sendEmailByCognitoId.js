const assert = require("assert");
const aws = require("aws-sdk");
const ses = new aws.SES({ region: "us-east-1" });
const docClient = new aws.DynamoDB.DocumentClient();

var cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
const USER_POOL_ID = 'us-east-1_DshC0YKlj';

exports.handler = async function (event) {
    var { subject, text, html, toCognitoId, from } = event;

    assert(/^[\w\-]{36}$/.test(toCognitoId), "Invalid toCognitoId");
    const to = await getVerifiedEmailFromCognito(toCognitoId);

    return sendEmail({ to, from, text, html, subject });
};

function getValue(arrayMap, name) {
    return arrayMap.find(e => e.Name === name)?.Value
}

function getVerifiedEmailFromCognito(cognitoId) {
    var params = {
        UserPoolId: USER_POOL_ID, /* required */
        AttributesToGet: ['email', 'email_verified'],
        Filter: `sub=\"${cognitoId}\"`,
        Limit: '1',
    };
    return cognitoidentityserviceprovider.listUsers(params)
        .promise()
        .then(data => {
            assert(data.Users.length === 1, "Could not find user");
            const { Attributes } = data.Users[0];
            const email_verified = getValue(Attributes, "email_verified") === "true";
            assert(email_verified, "Email not verified");
            const email = getValue(Attributes, "email");
            assert(!!email, "Email address falsey");

            return email;
        });
}

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