
import React from "react";
import ReactDOMServer from 'react-dom/server';
import {Header} from "./header";
import {Page as AboutHeader} from "./about/header";

type reactRenderOptions = {
    title?: string, 
    showLogin?: boolean,
    includeChartJs?: boolean,
    dangerousChartData?: any,
    includeVotesJs?: boolean,
}

export const reactRender = (res, element, options?: reactRenderOptions) => {
    options = options || {};
    const showLogin = options.showLogin || true;
    const innerHtml = ReactDOMServer.renderToStaticMarkup(
        <div>
            <Header showLogin={showLogin} user={res.locals.user} csrfToken={res.locals.csrfToken}/>
            {element}
            <hr className="blue-400"/>
        </div>);
    res.send(HtmlBoilerPlate(innerHtml, res.locals.csrfToken, options));
}


export const reactAboutRender = (res, element: JSX.Element, title: string) => {
    const innerHtml = ReactDOMServer.renderToStaticMarkup(
        <div>
            <AboutHeader />
            {element}
            <hr className="blue-400"/>
        </div>);
    const options = {
        title
    }
    res.send(HtmlBoilerPlate(innerHtml, res.locals.csrfToken, options));
}

export const Checkbox = ({name, label, checked}: {name: string, label: string, checked?: boolean}) => {
    return <div>
      <label htmlFor={name}>{label}</label>
      <input type="checkbox" id={name} name={name} value="1" defaultChecked={!!checked}/>
    </div>;
}

export function HtmlBoilerPlate(innerHtml: string, csrfToken: string, options?: reactRenderOptions): string {
    const title = options.title || "Efficient Democracy";
    const includeChartJs = options.includeChartJs || false;
    const chartData = includeChartJs ? `<script> var chartData = ${JSON.stringify(options.dangerousChartData)}</script>` : "";
    const includeVotesJs = options.includeVotesJs || false;
    // csrfToken is for client side api calls via axios
    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />

    ${includeVotesJs ? 
        `<script src="/public/axios.min.js"></script>
        <script src="/public/index.js"></script>`
        : ""}
    ${includeChartJs ? `<script src="https://cdn.jsdelivr.net/npm/chart.js@3.5.1/dist/chart.min.js" crossorigin></script>` : ""}
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

    ${includeChartJs ? `${chartData} <script src="/public/chart.js"></script>`: ""}
</body>
</html>
`;
}