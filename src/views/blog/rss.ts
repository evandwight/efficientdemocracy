import { BlogEntry } from "./blogEntry"
import * as C from '../../constant';

export function rssXmlBoilerPlate(entries: BlogEntry[]) {
    const lastModified = entries[0].created.toUTCString();
    return `
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>Efficient democracy blog</title>
    <description>Development updates</description>
    <link>https://efficientdemocracy.com/blog</link>
    <copyright>Que?</copyright>
    <lastBuildDate>${lastModified}</lastBuildDate>
    <pubDate>${new Date(2021, 10, 16).toUTCString()}</pubDate>
    <ttl>1440</ttl>
    <atom:link href="${C.URLS.BASE_URL + C.URLS.BLOG_FEED}" rel="self" type="application/atom+xml" />

${entries.map(rssItem).join("\n")}

</channel>
</rss>`
}

export function rssItem(entry: BlogEntry) {
    const url = C.URLS.BASE_URL + entry.url;
    return `
<item>
<title>${entry.title}</title>
<link>${url}</link>
<pubDate>${entry.created.toUTCString()}</pubDate>
<guid>${url}</guid>
</item>
`;
}