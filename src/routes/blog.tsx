import * as C from '../constant';
import {reactAboutRender} from '../views/utils';
import * as Blogs from '../views/blog';

// TODO https://guides.github.com/features/mastering-markdown/#what
// https://www.npmjs.com/package/markdown-it

export const renderBlog = (page: {element: () => JSX.Element, title: string}) => {
    return (req, res) => {
        reactAboutRender(res, page.element(), page.title);
    }
} 

export const index = (req, res) => {
    const page = req.params.page ? parseInt(req.params.page) : 0;
    const entriesPerPage = 10;

    const entries = [
        {title: Blogs.CspInlineScript, url: C.URLS.BLOG_CSP_INLINE_SCRIPT},
        {title: Blogs.JestSerialCodeCoverage.title, url: C.URLS.BLOG_JEST_SERIAL_CODE_COVERAGE},
        {title: Blogs.ReactStaticRender.title, url: C.URLS.BLOG_REACT_STATIC_RENDER},
    ];
    const pageEntries = entries.slice(page * entriesPerPage, (page + 1) * entriesPerPage);

    const showNext = ((page + 1) * entriesPerPage) < entries.length;
    const title = (page > 0 ? "Blog " + page : "Blog");
    reactAboutRender(res, Blogs.Blogs({entries:pageEntries, page, showNext}), title);
}