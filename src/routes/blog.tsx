import {reactAboutRender} from '../views/utils';
import * as Blogs from '../views/blog';

// TODO https://guides.github.com/features/mastering-markdown/#what
// https://www.npmjs.com/package/markdown-it
// put entries in the database and load them

export const renderBlog = (page: {element: () => JSX.Element, title: string}) => {
    return (req, res) => {
        reactAboutRender(res, page.element(), page.title);
    }
} 

export const index = (req, res) => {
    const page = req.params.page ? parseInt(req.params.page) : 0;
    const entriesPerPage = 10;

    const entries = BLOG_ENTRIES.map(blog => ({title: blog.title, url: blog.url, created: blog.created}));

    const pageEntries = entries.slice(page * entriesPerPage, (page + 1) * entriesPerPage);

    const showNext = ((page + 1) * entriesPerPage) < entries.length;
    const title = (page > 0 ? "Blog " + page : "Blog");
    reactAboutRender(res, Blogs.Blogs({entries:pageEntries, page, showNext}), title);
}

export const BLOG_ENTRIES = [
    Blogs.CspInlineScript,
    Blogs.JestSerialCodeCoverage,
    Blogs.ReactStaticRender
];