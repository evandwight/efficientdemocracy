import db from '../../db/databaseApi';
import ModVotes from './db/modVotes';
import * as C from '../../constant';
import { UserId } from '../../db/types';
import DataFrame from 'dataframe-js';

export function countsToWinner(counts): UserId {
    if (counts.length === 0) {
        return null;
    }
    let df = new DataFrame(counts, ["vote", "count"]);
    df = df.sortBy("count", true);
    return df.getRow(0).get("vote");
}

export async function updateMod() {
    // find current mod
    const currentMod = await db.users.getMod();
    // find new mod
    const counts = await ModVotes.countVotes();
    const newMod = countsToWinner(counts);

    if (newMod !== null && newMod !== currentMod) {
        // swappers
        await db.users.setSetting(newMod, C.USER.COLUMNS.is_mod, true);
        await db.users.setSetting(currentMod, C.USER.COLUMNS.is_mod, false);
    }
}

export async function getEligibleMods() {
    return db.users.getEligibleMods();
}