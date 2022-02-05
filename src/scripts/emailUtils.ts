import { sendEmail, sendEmailToCognitoId } from "../utils/sendAwsEmail";

export function sendMonitorEmail({subject, text}) {
    const to = process.env.MONITOR_EMAIL;
    if (!to) {
        throw new Error("Invalid to address");
    }
    const from = "monitor@menosmalo.com"

    return sendEmail({
        to,
        from,
        text,
        subject,
    });
}

export async function sendEmails(jsons: {toCognitoId: string, from: string, html: string, text: string, subject:string}[]): Promise<any[]> {
    // aws limits to 14 emails a second so only send 1 every 100ms
    if (jsons.length === 0) {
        return [];
    }

    const toCognitoId = jsons[0].toCognitoId;
    
    const result = await sendEmailToCognitoId(jsons[0])
        .then(() => ({success: true}))
        .catch((err) => ({success: false, err}));
    await new Promise(r => setTimeout(r, 100));
    const rest = await sendEmails(jsons.slice(1));
    return [ {... result, toCognitoId}, ... rest];
}