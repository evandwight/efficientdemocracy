import { combine, listToMap, trimPosts } from '../qPost';

describe("qposts", () => {
    describe('listToMap', () => {
        it('works', () => {
            const res = listToMap([{id: 1, val: 2}], v => v.id, (v, pv) => ({... pv || {}, val: v.val}));
            expect(res).toEqual({"1": {val: 2}});
        });
    });
    describe('combine', () => {
        it('works', () => {
            const res = combine([{id: 1}], {"1": {val: 2}}, v => v.id);
            expect(res).toEqual([{id: 1, val:2}]);
        });
    });
    describe('trimPosts', () => {
        it('handles less posts', () => {
            const {posts, moreLink} = trimPosts({posts: Array(5), moreLinkBase:"a", page:0});
            expect(posts.length).toBe(5);
            expect(moreLink).toEqual(null);
        });
        it('handles more posts', () => {
            const {posts, moreLink} = trimPosts({posts: Array(35), moreLinkBase:"a", page:0});
            expect(posts.length).toBe(30);
            expect(moreLink).toEqual("a/1");
        });
    });
});