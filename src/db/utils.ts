import * as C from '../constant'
import { UnexpectedInternalError } from '../routes/utils';
const crypto = require('crypto');

export function countToNumber(result) {
    return result.rows.map(v => ({... v, count: parseInt(v.count)}));
}

export function selectAttr(attr) {
    return (result) => {
        return result.rows.map(row => row[attr]);
    }
}

export function selectOne(result)  {
    if (result.rowCount === 0) {
        return null;
    } else if (result.rowCount === 1) {
        return result.rows[0];
    } else {
        throw new Error("More than one result!");
    }
}

export function selectOneAttr(attr) {
    return (result) => {
        let one = selectOne(result);
        return !!one ? one[attr] : null;
    }
}

export function selectCount(result) {
    return parseInt(selectOne(result)['count'],10);
}

export function assertOne(result) {
    if (result.rowCount === 1) {
        return result;
    }
    else {
        throw new Error("Didn't get one result");
    }
}

export function assertOneCustomError(errorFunc) {
    return (result) => {
        if (result.rowCount === 1) {
            return result;
        }
        else {
            throw errorFunc();
        }
    }
}

export const internalAssertOne = assertOneCustomError(() => new UnexpectedInternalError("Didn't get one result"));

export function existsOne(result) {
    if (result.rowCount === 1) {
        return true;
    }
    else {
        return false;
    }
}

export function selectRows(result) {
    return result.rows;
}

export function retryOnce(func: () => Promise<boolean>) {
    return func().then(suceeded => {
        if (! suceeded) {
            return func();
        }
    });
}

export function retryOnceOnUniqueError(func) {
    return func().catch((error) => {
        if (error.code == C.DB.ERROR_CODE.UNIQUE_VIOLATION) {
            // retry once as UUIDs shouldnt collide that often
            return func();
        }
        else {
            throw error;
        }
    });
}

export function generateUniqueRandom(maxValue, numValues) {
    if (maxValue + 1 < numValues) {
        throw new Error("Too few numValues");
    }
    
    let bag = [...Array(maxValue + 1).keys()];

    if (bag.length === numValues) {
        return bag;
    }

    let vals = [];

    for (let i = 0; i < numValues; i += 1) {
        let selectIndex;
        if (bag.length === 1) {
            selectIndex = 0;
        } else {
            selectIndex = crypto.randomInt(0, bag.length);
        }
        vals.push(bag[selectIndex]);
        bag.splice(selectIndex, 1);
    }

    return vals;
}

export async function WithTransaction<T>(db, func: (PoolClient) => Promise<T>): Promise<T> {
    const client = await db.pool.connect();
    const wrappedClient = {
        query: async (query, parameters) => {
            return client.query(query, parameters).catch(error => {
                console.log("Error:", error)
                console.log("Query args:", query, parameters);
                throw error;
            });
        }
    }    
    let res;
    try {
        await client.query('BEGIN')
        res = await func(wrappedClient);
        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }
    return res;
}

export function daysFromNow(days) {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}

export function lastSaturday(date?: Date) {
    return lastWeekday(6, date);
}

export function lastWeekday(weekDay: number, date?: Date) {
    date = date || new Date();
    let prevDate = new Date(date);

    // day = date.getDay
    // saturday = 6
    // sunday = 0
    let dateDay = date.getDay();
    if (dateDay <= weekDay) {
        dateDay += 7;
    }
    const daysSince = dateDay - weekDay; 

    // getDate gives day of the month, setDate handles negatives
    prevDate.setDate(date.getDate() - daysSince);

    return prevDate;
}
// module.exports = {selectOne, selectCount, assertOne, retryOnceOnUniqueError, selectOneAttr};