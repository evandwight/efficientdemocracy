import {countsToViewData} from '../viewPostModActions';

describe('viewPostModActions', () => {
    describe('countsToViewData', () => {
        it('includes disputers', () => {
            const counts = [
                {vote: true, strike_ups: false, strike_downs: true, strike_poster: false, strike_disputers: false, count: 1},
                {vote: false, strike_ups: true, strike_downs: false, strike_poster: true, strike_disputers: true, count: 2},
                {vote: null, strike_ups: true, strike_downs: true, strike_poster: true, strike_disputers: true, count: 3},
            ]
            const res = countsToViewData({counts, result: false, isSample:true});
            expect(res).toMatchSnapshot();
        });
        it('excludes disputers', () => {
            const counts = [
                {vote: true, strike_ups: true, strike_downs: false, strike_poster: false, count: 1},
                {vote: false, strike_ups: true, strike_downs: true, strike_poster: true, count: 2},
                {vote: null, strike_ups: true, strike_downs: true, strike_poster: true, count: 3},
            ]
            const res = countsToViewData({counts, result: true, isSample:false});
            expect(res).toMatchSnapshot();
        });
        it('handles no counts', () => {
            const counts = [];
            const res = countsToViewData({counts, result: false, isSample:true});
            expect(res).toMatchSnapshot();
        });
    });
});