import { fromIni } from "@aws-sdk/credential-providers";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const lambda = new LambdaClient({
    region: "us-east-1",
    credentials: fromIni(),
});

export function sendMonitorEmail({subject, text}) {
    const to = process.env.MONITOR_EMAIL;
    if (!to) {
        throw new Error("Invalid to address");
    }
    const from = "monitor@efficientdemocracy.com"

    return sendEmail({
        to,
        from,
        text,
        subject,
    });
}


export function sendEmail(json) {
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


export async function sendEmails(jsons: {to: string, html: string, text: string, subject:string}[]): Promise<any[]> {
    // aws limits to 14 emails a second so only send 1 every 100ms
    if (jsons.length === 0) {
        return [];
    }

    const to = jsons[0].to;
    
    const result = await sendEmail(jsons[0])
        .then(() => ({success: true}))
        .catch((err) => ({success: false, err}));
    await new Promise(r => setTimeout(r, 100));
    const rest = await sendEmails(jsons.slice(1));
    return [ {... result, to}, ... rest];
}