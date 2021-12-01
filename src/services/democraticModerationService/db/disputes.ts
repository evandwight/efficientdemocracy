import dbPool from "../../../db/dbPool";
import { existsOne, selectRows } from "../../../db/utils";

export default class Disputes {
    static submitDispute({thingId, userId, field, shouldBe}) {
        return dbPool.query(
            `INSERT INTO disputes  
            (thing_id, user_id, field, should_be) VALUES ($1, $2, $3, $4)
            ON CONFLICT (thing_id, user_id, field)
            DO NOTHING`,
            [thingId, userId, field, shouldBe]).then(existsOne);
    }

    static getDisputes(threshold = 0)
        : Promise<{thing_id: string, field: string, should_be: boolean, value?: boolean, priority?: number, count: number}[]> {
        return dbPool.query(`
            SELECT d.thing_id, d.field, d.should_be, ma.value, ma.priority, count(*)
            FROM disputes as d
            LEFT JOIN mod_actions as ma ON d.thing_id = ma.thing_id and d.field = ma.field
            GROUP BY d.thing_id, d.field, d.should_be, ma.value, ma.priority
            HAVING count(*) >= $1
            ORDER BY count DESC`, [threshold])
            .then(selectRows)
            .then(rows => rows.map(row => ({... row, count: parseInt(row.count)})));
    }
}