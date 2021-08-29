import {DangerousATag} from '../../views/utils';
import ReactDOMServer from 'react-dom/server';

describe("dangerouseATag", () => {
    it("works", () => {
        const res = ReactDOMServer.renderToStaticMarkup(DangerousATag({className:"a", title:"b", href:"c", onclick:"d", innerHtml:"f"}));
        expect(res).toEqual(`<div style="display:inline"><a class="a"  title="b" href="c" onclick="d">f</a></div>`);
    })
    it("handles undefined fields", () => {
        const res = ReactDOMServer.renderToStaticMarkup(DangerousATag({className:"a", href:"c", onclick:"d"}));
        expect(res).toEqual(`<div style="display:inline"><a class="a"  href="c" onclick="d"></a></div>`);
    })
})