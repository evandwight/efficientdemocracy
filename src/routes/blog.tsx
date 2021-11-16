import { reactAboutRender } from '../views/utils';
import { BlogPage, BlogEntries } from '../views/blog';
import type { BlogEntry } from '../views/blog/blogEntry';
import { rssXmlBoilerPlate } from '../views/blog/rss';

// TODO https://guides.github.com/features/mastering-markdown/#what
// https://www.npmjs.com/package/markdown-it
// put entries in the database and load them

export const renderBlog = (page: BlogEntry) => {
    return (req, res) => {
        reactAboutRender(res, page.element(), { title: page.title, includeScript: page.includeScript, includeBlogRssHint: true });
    }
}

let blogEntries = Object.values(BlogEntries);
blogEntries.sort((a, b) => b.created.getTime() - a.created.getTime());
const cachedRssXml = rssXmlBoilerPlate(blogEntries);

export const index = (req, res) => {
    const page = req.params.page ? parseInt(req.params.page) : 0;
    const entriesPerPage = 10;

    const entries = blogEntries.map(blog => ({ title: blog.title, url: blog.url, created: blog.created }));

    const pageEntries = entries.slice(page * entriesPerPage, (page + 1) * entriesPerPage);

    const showNext = ((page + 1) * entriesPerPage) < entries.length;
    const title = (page > 0 ? "Blog " + page : "Blog");
    reactAboutRender(res, BlogPage({ entries: pageEntries, page, showNext }), { title, includeBlogRssHint: true });
}

export const getRssXml = (req, res) => {
    res.setHeader('content-type', 'application/atom+xml');
    res.send(cachedRssXml);
}