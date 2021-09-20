const utils = require('../utils');
import crypto from 'crypto';
import { lastSaturday } from '../utils';

jest.mock('crypto');
let mockedCrypto: any = crypto as any;

beforeEach(() => {
    mockedCrypto.randomInt.mockRestore();
});
describe("db.utils", () => {
    describe('generateUniqueRandom', () => {
        it('handles 0 attempts', () => {
            let res = utils.generateUniqueRandom(2,0);
            expect(res.length).toBe(0);
        });
        it('handles 1 attempts', () => {
            let res = utils.generateUniqueRandom(3,1);
            expect(res.length).toBe(1);
        });
        it('handles 10 attempts', () => {
            let res = utils.generateUniqueRandom(10,10);
            expect(res.length).toBe(10);
        });
        it('handles more attempts then possible values', () => {
            expect(() => utils.generateUniqueRandom(0,2)).toThrow("Too few numValues");
        });
    });

    describe('generateUniqueRandom mocked', () => {
        beforeEach(() => {
            mockedCrypto.randomInt.mockReset();
        })
        it('mocks', () => {
            mockedCrypto.randomInt.mockReturnValueOnce(2);
            expect(crypto.randomInt(5)).toBe(2);
        });
        it('handles 2 users', () => {
            mockedCrypto.randomInt
                .mockReturnValueOnce(0);
            let res = utils.generateUniqueRandom(1, 1);
            const {calls} = mockedCrypto.randomInt.mock;
            expect(calls[0]).toEqual([0, 2]);
            expect(res).toEqual([0]);
        });
        it('handles 10 users sampled twice', () => {
            mockedCrypto.randomInt
                .mockReturnValueOnce(0)
                .mockReturnValueOnce(0);
            let res = utils.generateUniqueRandom(9, 2);
            expect(mockedCrypto.randomInt.mock.calls).toEqual([[0, 10], [0, 9]]);
            expect(res).toEqual([0, 1]);
        });
    });

    describe('selectOneAttr', () => {
        it('handles 0 rows', () => {
            const result = utils.selectOneAttr('id')({rowCount: 0, rows: []});
            expect(result).toEqual(null);
        });
        it('handles 1 row', () => {
            const result = utils.selectOneAttr('id')({rowCount: 1, rows: [{'id': 1}]});
            expect(result).toEqual(1);
        });
        it('handles 2 row', () => {
            expect(() => {
                utils.selectOneAttr('id')({rowCount: 2, rows: [{'id': 1}, {'id': 2}]})
            }).toThrow();
        });
    });
    describe('lastSaturday', () => {
        it('handles mid month days', () => {
            expect(lastSaturday(new Date(2021, 8, 20))).toEqual(new Date(2021,8, 18));
        });
        it('handles saturdays', () => {
            expect(lastSaturday(new Date(2021, 8, 18))).toEqual(new Date(2021,8, 11));
        });
        it('handles beginning of the month days', () => {
            expect(lastSaturday(new Date(2021, 8, 4))).toEqual(new Date(2021,7, 28));
            expect(lastSaturday(new Date(2021, 8, 1))).toEqual(new Date(2021,7, 28));
        });
    });
});