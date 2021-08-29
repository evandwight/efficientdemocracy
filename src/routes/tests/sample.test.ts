import { countsToDataTable, countsToChartData } from '../../routes/sample';


describe('countsToDataTable', () => {
    it('works', () => {
        const counts = [
            {vote: true, strike_ups: false, strike_downs: false, strike_poster: false, strike_disputers: false, count: 1},
            {vote: false, strike_ups: true, strike_downs: true, strike_poster: true, strike_disputers: true, count: 2},
            {vote: null, strike_ups: true, strike_downs: true, strike_poster: true, strike_disputers: true, count: 3},
        ]
        const res = countsToDataTable(counts);
        expect(res).toMatchSnapshot();
    });
});

describe('countsToChartData', () => {
    it('works', () => {
        const counts = [
            {vote: true, strike_ups: false, strike_downs: false, strike_poster: false, strike_disputers: false, count: 1},
            {vote: false, strike_ups: true, strike_downs: true, strike_poster: true, strike_disputers: true, count: 2},
            {vote: null, strike_ups: true, strike_downs: true, strike_poster: true, strike_disputers: true, count: 3},
        ]
        const sample = {
            result: {vote: false, strike_ups: true, strike_downs: true, strike_poster: true, strike_disputers: true},
            counts
        }
        const res = countsToChartData(sample);
        expect(res).toMatchSnapshot();
    });
    it('handles null results', () => {
        const counts = [
            {vote: true, strike_ups: false, strike_downs: false, strike_poster: false, strike_disputers: false, count: 1},
            {vote: false, strike_ups: true, strike_downs: true, strike_poster: true, strike_disputers: true, count: 2},
            {vote: null, strike_ups: true, strike_downs: true, strike_poster: true, strike_disputers: true, count: 3},
        ]
        const sample = {
            result: null,
            counts
        }
        const res = countsToChartData(sample);
        expect(res).toMatchSnapshot();
    });
});