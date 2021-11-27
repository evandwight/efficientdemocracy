import { fromIni } from "@aws-sdk/credential-providers";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
require("dotenv").config();

const lambda = new LambdaClient({
    region: "us-east-1",
    credentials: fromIni(),
});

export function sendEmail(json: {to: string, from?: string, subject: string, text: string, html?: string}) {
    if (process.env.NODE_ENV === 'test') {
        throw new Error("Are you sure you want to send an email while testing?");
    }
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
    });
}

export function sendEmailToCognitoId(json: {toCognitoId: string, from?: string, subject: string, text: string, html?: string}) {
    if (process.env.NODE_ENV === 'test') {
        throw new Error("Are you sure you want to send an email while testing?");
    }
    return lambda.send(new InvokeCommand({
        FunctionName: "sendEmailToCognitoId",
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
    });
}