
import React from "react";
import ReactDOMServer from 'react-dom/server';
import {Header} from "./header";
import {Footer} from "./footer";
import {Page as AboutHeader} from "./about/header";

type reactRenderOptions = {
    title?: string, 
    showLogin?: boolean,
    includeChartJs?: boolean,
    dangerousChartData?: any,
    includeVotesJs?: boolean,
    includeScript?: string,
    includeRegisterJs?: boolean,
    cspNonce?: string,
}

export const DefaultWrapper = (props: {showLogin, user, csrfToken, children}) => 
    <div>
        <Header {... props}/>
            <div id="inner-content">
                {props.children}
            </div>
        <Footer/>
    </div>

export const reactRender = (res, element, options?: reactRenderOptions) => {
    options = options || {};
    const showLogin = options.hasOwnProperty("showLogin") ? options.showLogin : true;
    const innerHtml = ReactDOMServer.renderToStaticMarkup(
        <DefaultWrapper showLogin={showLogin} user={res.locals.user} csrfToken={res.locals.csrfToken}>
            {element}
        </DefaultWrapper>
        );
    if (options.includeRegisterJs) {
        options.cspNonce = res.locals.cspNonce;
    }
    res.send(HtmlBoilerPlate(innerHtml, res.locals.csrfToken, options));
}


export const reactAboutRender = (res, element: JSX.Element, title: string, includeScript?: string) => {
    const innerHtml = ReactDOMServer.renderToStaticMarkup(
        <div>
            <AboutHeader />
            <div id="about-content">
                {element}
            </div>
            <Footer/>
        </div>);
    const options = {
        title,
        includeScript,
    }
    res.send(HtmlBoilerPlate(innerHtml, res.locals.csrfToken, options));
}

export const Checkbox = ({name, label, checked}: {name: string, label: string, checked?: boolean}) => {
    return <div>
      <label htmlFor={name}>{label}</label>
      <input type="checkbox" id={name} name={name} value="1" defaultChecked={!!checked}/>
    </div>;
}

export const dateToTimeSince = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    const INTERVALS = [
        {interval: 31536000, epochStr: "year"},
        {interval: 2592000, epochStr: "month"},
        {interval: 86400, epochStr: "day"},
        {interval: 3600, epochStr: "hour"},
        {interval: 60, epochStr: "minute"},
        {interval: 1, epochStr: "second"}
    ];

    for (const {interval, epochStr} of INTERVALS) {
        const epochs = Math.floor(seconds/interval);
        if (epochs >= 1 || interval === 1) {
            return `${epochs} ${epochStr}${epochs !== 1 ? "s" : ""} ago`;
        }
    }
  }

export function HtmlBoilerPlate(innerHtml: string, csrfToken: string, options?: reactRenderOptions): string {
    const {
        title = "Efficient Democracy",
        includeChartJs = false,
        includeVotesJs = false,
        includeScript = false,
        includeRegisterJs = false,
        cspNonce = null,
    } = options;
    // csrfToken is for client side api calls via axios
    // <script>0</script> for firefox fouc bug https://bugzilla.mozilla.org/show_bug.cgi?id=1404468
    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />

    ${includeVotesJs 
        ? `<script src="/public/axios.min.js"></script>
        <script src="/public/index.js"></script>`
        : ""}
    ${includeChartJs
        ? `<script type="application/json" id="chartData">${JSON.stringify(options.dangerousChartData)}</script>
        <script src="/public/sampleChart.js"></script>
        <script src="/public/chart.min.js"></script>`
        : ""}
    ${includeRegisterJs
        ? `<script src="https://www.google.com/recaptcha/api.js?render=${process.env.GOOGLE_CAPTCHA_SITE_KEY}" nonce="${cspNonce}"></script>
        <script src="/public/register.js"></script>`
        : ""}
    ${includeScript 
        ? `<script src="${includeScript}"></script>`
        : ""}
    <link rel="stylesheet" href="/public/styles.css" />
    <link rel="icon" type="image/png" sizes="32x32" href="/public/favicon/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/public/favicon/favicon-16x16.png" />

    <meta name="csrf-token" content="${csrfToken}" />

    <title>${title}</title>
</head>

<body>
    <div class="bg-gray-100 gray-900" id="content">
        ${innerHtml}
    </div>
    <script>0</script>
</body>
</html>
`;
}