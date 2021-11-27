'use strict';
console.log('Loading function');
const aws = require('aws-sdk');
const assert = require("assert");
const docClient = new aws.DynamoDB.DocumentClient();


const getEmails = {
    "Bounce": (message) => message.bounce.bouncedRecipients.map(recipient => recipient.emailAddress),
    "Complaint": (message) => message.complaint.complainedRecipients.map(recipient => recipient.emailAddress),
};

const ALLOWED_TYPES = Object.keys(getEmails);

exports.handler = async (event, context) => {
    try {
        console.log('Received event:', JSON.stringify(event));

        const snsEvent = event.Records[0].Sns;
        const messageId = snsEvent.MessageId;
        const message = JSON.parse(snsEvent.Message);
        const { notificationType } = message;

        assert(ALLOWED_TYPES.indexOf(notificationType) !== -1, "Unknown notification type");

        const emails = getEmails[notificationType](message);

        // log all bad events
        await Promise.all(emails.map(email => writeEmailLog(email, messageId, snsEvent)));

        // add emails to blacklist
        await Promise.all(emails.map(email => addEmailToBlacklist(email, messageId)));
        // Process first record. It is unexpected that there are more records so throw an error
        assert(event.Records.length === 1, "Invalid number of records");
    } catch (error) {
        // throwing the original error was garbaling the logs for some reason
        console.log("Error: ", JSON.stringify(error));
        throw new Error("Failure: " + error.toString());
    }

    return { statusCode: 200 };
};

function writeEmailLog(email, messageId, data) {
    const Item = {
        email,
        "messageId#created": `${messageId}#${Date.now()}`,
        data: JSON.stringify(data),
    };

    // Don't overwrite messages
    // Dynamo gets (email, messageId) then checks if attribute email does not exist
    const ConditionExpression = "attribute_not_exists(email)";
    return docClient.put({ TableName: "email-log", Item, ConditionExpression })
        .promise()
        .catch(err => {
            console.log("Error writing email-blacklist.");
            console.log("Item: ", JSON.stringify(Item));
            throw err;
        });
}

function addEmailToBlacklist(email, messageId) {
    const Item = {
        email,
        messageId
    };

    const ConditionExpression = "attribute_not_exists(email)";
    return docClient.put({ TableName: "email-blacklist", Item, ConditionExpression })
        .promise()
        .catch(err => {
            console.log("Error writing email-blacklist.");
            console.log("Item: ", JSON.stringify(Item));

            // Keep only the first bad event in blacklist. email-log has all events
            if (err.code !== "ConditionalCheckFailedException") {
                throw new Error("Error writing email-blacklist. Cause: " + JSON.stringify(err));
            } else {
                console.log("Email already on blacklist.");
            }
        });
}